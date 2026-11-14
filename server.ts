import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  LNCT_CAMPUS_BLOCKS,
  LNCT_DISTANCE_MATRIX,
  LNCT_RGPV_TIMETABLE_DATA,
  LNCT_RGPV_PAPER_PREDICTIONS,
  getInterBuildingDistance
} from './src/data/lnctCampusData.ts';
import type { CampusBlock, CampusBlockId, LiveTelemetryPacket } from './src/types/campus.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let liveBlocks: CampusBlock[] = structuredClone(LNCT_CAMPUS_BLOCKS);

const livePackets: LiveTelemetryPacket[] = [
  {
    id: 'PKT-INIT-101',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    node_id: 'NODE-CVR-F3-2',
    block_id: 'cv-raman-block',
    room_id: 'F3-2 (3rd Yr CSE-AIDS)',
    temp_c: 23.1,
    humidity: 47.5,
    light_lux: 440,
    occupancy: 58,
    ac_status: 1,
    power_kwh: 4.12,
    source: 'software_simulator',
    anomaly_detected: false,
    wastage_kw: 0,
    actuation_command: 'KEEP_ON'
  },
  {
    id: 'PKT-INIT-102',
    timestamp: new Date(Date.now() - 90000).toISOString(),
    node_id: 'NODE-LNCTS-F2-3',
    block_id: 'lncts-new',
    room_id: 'F2-3 (CSE-Cyber Security)',
    temp_c: 21.8,
    humidity: 49.0,
    light_lux: 380,
    occupancy: 0,
    ac_status: 1,
    power_kwh: 2.85,
    source: 'software_simulator',
    anomaly_detected: true,
    wastage_kw: 2.55,
    actuation_command: 'AUTO_SHUTOFF_AC'
  }
];

function evaluatePacketAI(payload: {
  occupancy: number;
  ac_status: 0 | 1;
  light_lux: number;
  temp_c: number;
  power_kwh: number;
  autoControl: boolean;
}): {
  anomaly_detected: boolean;
  wastage_kw: number;
  actuation_command: LiveTelemetryPacket['actuation_command'];
} {
  const isOccupied = payload.occupancy > 0;
  const hasWastage = !isOccupied && (payload.ac_status === 1 || payload.light_lux > 200);

  if (hasWastage) {
    const wastageKw = Number(
      ((payload.ac_status === 1 ? 2.2 : 0) + (payload.light_lux > 200 ? 0.35 : 0)).toFixed(2)
    );
    return {
      anomaly_detected: true,
      wastage_kw: wastageKw,
      actuation_command: payload.autoControl ? 'AUTO_SHUTOFF_AC' : 'IDLE'
    };
  }

  if (isOccupied && payload.temp_c > 27.5) {
    return {
      anomaly_detected: false,
      wastage_kw: 0,
      actuation_command: 'PRE_COOL_BOOST'
    };
  }

  return {
    anomaly_detected: false,
    wastage_kw: 0,
    actuation_command: payload.ac_status === 1 ? 'KEEP_ON' : 'IDLE'
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.json({
      status: 'online',
      service: 'LNCT Bhopal Raisen Road AI Digital Twin Engine',
      campus: 'Kalchuri Nagar, Raisen Road, Bhopal (MP)',
      blocks_monitored: liveBlocks.length,
      hardware_bridge: 'ESP32 / Arduino HTTP + MQTT Ready',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/v1/twin/state', (_req: Request, res: Response) => {
    const totalWastageKw = livePackets
      .filter(p => p.anomaly_detected)
      .slice(0, 12)
      .reduce((sum, p) => sum + p.wastage_kw, 0);

    res.json({
      blocks: liveBlocks,
      recent_packets: livePackets.slice(0, 25),
      summary: {
        active_anomalies: livePackets.filter(p => p.anomaly_detected).length,
        estimated_wastage_kw: Number(totalWastageKw.toFixed(2)),
        total_blocks: liveBlocks.length
      }
    });
  });

  app.post('/api/v1/telemetry/ingest', (req: Request, res: Response) => {
    const body = req.body || {};
    const blockId = (body.block_id as CampusBlockId) || 'cv-raman-block';
    const blockIdx = liveBlocks.findIndex(b => b.id === blockId);

    if (blockIdx === -1) {
      res.status(400).json({ error: `Unknown block_id '${blockId}'.` });
      return;
    }

    const temp_c = Number(body.temp_c ?? 24.0);
    const humidity = Number(body.humidity ?? 48.0);
    const light_lux = Number(body.light_lux ?? 320);
    const occupancy = Math.max(0, Math.round(Number(body.occupancy ?? 0)));
    const ac_status: 0 | 1 = Number(body.ac_status ?? 0) === 1 ? 1 : 0;
    const power_kwh = Number(body.power_kwh ?? (ac_status === 1 ? 2.6 : 0.3));
    const node_id = String(body.node_id || `NODE-${liveBlocks[blockIdx].code}-G1`);
    const room_id = String(body.room_id || 'F3-2');
    const source = body.source === 'esp32_hardware' ? 'esp32_hardware' : 'software_simulator';

    const targetBlock = liveBlocks[blockIdx];
    const aiResult = evaluatePacketAI({
      occupancy,
      ac_status,
      light_lux,
      temp_c,
      power_kwh,
      autoControl: targetBlock.relays.autoControl
    });

    targetBlock.temperatureC = Number(temp_c.toFixed(1));
    if (body.occupancy !== undefined) {
      targetBlock.currentOccupancy = Math.min(targetBlock.maxCapacity, occupancy * 16);
    }

    if (aiResult.anomaly_detected && targetBlock.relays.autoControl) {
      targetBlock.relays.acOn = false;
      targetBlock.relays.lightsOn = false;
      targetBlock.healthStatus = 'warning';
    } else {
      targetBlock.relays.acOn = ac_status === 1;
      targetBlock.relays.lightsOn = light_lux > 200;
      targetBlock.healthStatus = aiResult.anomaly_detected ? 'warning' : 'nominal';
    }

    const packet: LiveTelemetryPacket = {
      id: `PKT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      node_id,
      block_id: blockId,
      room_id,
      temp_c,
      humidity,
      light_lux,
      occupancy,
      ac_status,
      power_kwh,
      source,
      anomaly_detected: aiResult.anomaly_detected,
      wastage_kw: aiResult.wastage_kw,
      actuation_command: aiResult.actuation_command
    };

    livePackets.unshift(packet);
    if (livePackets.length > 60) {
      livePackets.pop();
    }

    res.json({
      accepted: true,
      packet,
      relay_state: targetBlock.relays,
      ai_verdict: aiResult.anomaly_detected
        ? `Wastage detected (${aiResult.wastage_kw} kW): 0 occupants with AC/Lights ON.`
        : 'Nominal operating state.'
    });
  });

  app.post('/api/v1/actuate/relay', (req: Request, res: Response) => {
    const { block_id, ac_on, lights_on, auto_control } = req.body || {};
    const block = liveBlocks.find(b => b.id === block_id);
    if (!block) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }

    if (typeof ac_on === 'boolean') block.relays.acOn = ac_on;
    if (typeof lights_on === 'boolean') block.relays.lightsOn = lights_on;
    if (typeof auto_control === 'boolean') block.relays.autoControl = auto_control;

    if (!block.relays.acOn && !block.relays.lightsOn && block.healthStatus === 'warning') {
      block.healthStatus = 'nominal';
    }

    res.json({
      success: true,
      block_id: block.id,
      relays: block.relays
    });
  });

  app.get('/api/v1/actuate/commands/:blockId', (req: Request, res: Response) => {
    const block = liveBlocks.find(b => b.id === req.params.blockId);
    if (!block) {
      res.status(404).json({ error: 'Unknown blockId' });
      return;
    }
    res.json({
      block_id: block.id,
      ac_relay: block.relays.acOn ? 1 : 0,
      lights_relay: block.relays.lightsOn ? 1 : 0,
      auto_control: block.relays.autoControl,
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/v1/distances', (req: Request, res: Response) => {
    const from = req.query.from as CampusBlockId | undefined;
    const to = req.query.to as CampusBlockId | undefined;
    if (from && to) {
      res.json(getInterBuildingDistance(from, to));
      return;
    }
    res.json({
      campus: 'LNCT Bhopal Raisen Road',
      matrix: LNCT_DISTANCE_MATRIX
    });
  });

  app.get('/api/v1/rgpv/timetable', (_req: Request, res: Response) => {
    res.json({
      university: 'RGPV Bhopal',
      institution: 'LNCT Group of Colleges, Raisen Road, Bhopal',
      timetable: LNCT_RGPV_TIMETABLE_DATA
    });
  });

  app.get('/api/v1/rgpv/predictions', (_req: Request, res: Response) => {
    res.json({
      university: 'RGPV Bhopal',
      scheme: 'RGPV 2026 Syllabus vs Previous Year Comparison',
      predictions: LNCT_RGPV_PAPER_PREDICTIONS
    });
  });

  app.post('/api/v1/simulate/reset', (_req: Request, res: Response) => {
    liveBlocks = structuredClone(LNCT_CAMPUS_BLOCKS);
    res.json({ reset: true, blocks: liveBlocks });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LNCT Digital Twin Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
