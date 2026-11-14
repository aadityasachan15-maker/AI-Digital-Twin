import type {
  CampusBlock,
  CampusBlockId,
  CampusAsset,
  EnergyReading,
  StudentDensityZone,
  IoTTelemetryRecord,
  DigitalTwinScenario,
  BuildingDistanceEntry,
  RoomScheduleIoTRecord
} from '../types/campus.ts';

// Real-world LNCT College Campus Coordinates (Kalchuri Nagar, Raisen Road, Bhopal, MP)
// Center anchor: 23.2515 N, 77.5245 E
export const LNCT_CAMPUS_CENTER = { lat: 23.2515, lng: 77.5245 };

export const LNCT_CAMPUS_BLOCKS: CampusBlock[] = [
  {
    id: 'block-a-cse',
    name: 'Block A - CSE & IT Complex (LNCT Main)',
    hindiName: 'कंप्यूटर साइंस भवन',
    code: 'CSE-A',
    category: 'academic',
    areaSqm: 14200,
    floors: 4,
    gps: { lat: 23.25195, lng: 77.52410 },
    coordinates: { x: 120, y: 160, width: 140, height: 110, depth: 40 },
    activeSensors: 64,
    currentOccupancy: 840,
    maxCapacity: 1200,
    powerDrawKw: 142.6,
    temperatureC: 23.4,
    co2Ppm: 685,
    healthStatus: 'nominal',
    description: 'Houses 24 computing labs, High Performance Computing (HPC) cluster, AI/ML research workstations, and 32 smart classrooms.',
    keyLabsOrRooms: ['AI/Deep Learning Lab 402', 'Cloud Computing Lab 301', 'IoT Embedded Lab 205', 'NVIDIA GPU Cluster Room', 'Seminar Hall 1'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'block-b-ece',
    name: 'Block B - ECE & Electrical Wing',
    hindiName: 'इलेक्ट्रॉनिक्स एवं विद्युत भवन',
    code: 'ECE-B',
    category: 'academic',
    areaSqm: 11800,
    floors: 3,
    gps: { lat: 23.25188, lng: 77.52505 },
    coordinates: { x: 290, y: 170, width: 130, height: 100, depth: 32 },
    activeSensors: 48,
    currentOccupancy: 560,
    maxCapacity: 950,
    powerDrawKw: 98.4,
    temperatureC: 24.1,
    co2Ppm: 610,
    healthStatus: 'nominal',
    description: 'VLSI design suites, Microwave Engineering lab, DSP workbench, and Electrical Machines & Drives testing floor.',
    keyLabsOrRooms: ['VLSI Cadence Suite', 'Robotics & Automation Lab', 'High Voltage Testing Cell', 'Microprocessor Lab 104'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'block-c-mech',
    name: 'Block C - Mechanical Workshops & CNC',
    hindiName: 'मैकेनिकल कार्यशाला',
    code: 'MEC-C',
    category: 'academic',
    areaSqm: 9600,
    floors: 2,
    gps: { lat: 23.25115, lng: 77.52395 },
    coordinates: { x: 120, y: 310, width: 150, height: 95, depth: 24 },
    activeSensors: 38,
    currentOccupancy: 280,
    maxCapacity: 600,
    powerDrawKw: 165.2,
    temperatureC: 26.8,
    co2Ppm: 540,
    healthStatus: 'warning',
    description: 'Heavy machinery shop, 5-Axis CNC Milling machines, Fluid Dynamics wind tunnel, and Material Strength Testing benches.',
    keyLabsOrRooms: ['CNC Machining Center', 'Internal Combustion Engines Lab', 'Material Testing Hydraulic Press', 'CAD/CAM Studio'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'auditorium',
    name: 'Kalchuri Central Auditorium',
    hindiName: 'कलचुरी सभागार',
    code: 'AUD-K',
    category: 'facility',
    areaSqm: 3800,
    floors: 2,
    gps: { lat: 23.25180, lng: 77.52605 },
    coordinates: { x: 450, y: 180, width: 120, height: 110, depth: 36 },
    activeSensors: 32,
    currentOccupancy: 420,
    maxCapacity: 1250,
    powerDrawKw: 84.5,
    temperatureC: 22.0,
    co2Ppm: 740,
    healthStatus: 'nominal',
    description: 'Acoustically engineered 1,250-seater main campus convention hall with central chilled-water HVAC and intelligent dimmable lighting.',
    keyLabsOrRooms: ['Main Seating Orchestra', 'Balcony Tier A & B', 'Central AHU Plant Room', 'Green Rooms & Stage Control'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'central-library',
    name: 'Dr. APJ Abdul Kalam Central Library',
    hindiName: 'केंद्रीय पुस्तकालय',
    code: 'LIB-K',
    category: 'facility',
    areaSqm: 6400,
    floors: 3,
    gps: { lat: 23.25118, lng: 77.52500 },
    coordinates: { x: 295, y: 310, width: 125, height: 95, depth: 28 },
    activeSensors: 36,
    currentOccupancy: 390,
    maxCapacity: 750,
    powerDrawKw: 42.1,
    temperatureC: 23.0,
    co2Ppm: 590,
    healthStatus: 'nominal',
    description: 'Central knowledge repository with 90,000+ volumes, automated RFID kiosk checkouts, digital research carrels, and climate-controlled archives.',
    keyLabsOrRooms: ['Digital E-Library Section', 'Quiet Reference Room', 'Rare Periodicals Archive', 'Stack Area Floors 1-3'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'rnd-incubation',
    name: 'LNCT Incubation & Innovation Cell',
    hindiName: 'नवाचार एवं अनुसंधान केंद्र',
    code: 'RND-I',
    category: 'academic',
    areaSqm: 4200,
    floors: 2,
    gps: { lat: 23.25112, lng: 77.52595 },
    coordinates: { x: 445, y: 320, width: 115, height: 85, depth: 24 },
    activeSensors: 26,
    currentOccupancy: 140,
    maxCapacity: 350,
    powerDrawKw: 31.8,
    temperatureC: 23.5,
    co2Ppm: 520,
    healthStatus: 'nominal',
    description: 'Startup incubator, 3D printing rapid prototyping lab, patent filing desk, and collaborative co-working hub.',
    keyLabsOrRooms: ['3D Printing Rapid Prototyping', 'Drone Testing Cage', 'PCB Milling Bench', 'Student Venture Incubator'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'substation-utility',
    name: 'Campus Central Substation & 550kWp Solar',
    hindiName: 'केंद्रीय विद्युत सबस्टेशन',
    code: 'SUB-U',
    category: 'utility',
    areaSqm: 3200,
    floors: 1,
    gps: { lat: 23.25182, lng: 77.52695 },
    coordinates: { x: 590, y: 190, width: 110, height: 90, depth: 16 },
    activeSensors: 52,
    currentOccupancy: 12,
    maxCapacity: 30,
    powerDrawKw: 580.4,
    temperatureC: 38.2,
    co2Ppm: 460,
    healthStatus: 'warning',
    description: 'Primary 11 kV/415V step-down transformers, APFC capacitor banks, 6x 100kW Solar string inverters, and 500kVA Cummins DG genset.',
    keyLabsOrRooms: ['Transformer Yard T-01 & T-02', 'HT Switchgear Control Room', 'Sungrow Solar Inverter Bank', '500kVA Silent DG Genset Bay'],
    relays: { acOn: true, lightsOn: true, autoControl: false }
  },
  {
    id: 'hostel-cluster',
    name: 'Ratanpur Boys & Gargi Girls Hostels + Canteen',
    hindiName: 'छात्रावास एवं कैंटीन परिसर',
    code: 'HST-R',
    category: 'residential',
    areaSqm: 22000,
    floors: 5,
    gps: { lat: 23.25032, lng: 77.52430 },
    coordinates: { x: 120, y: 440, width: 220, height: 110, depth: 45 },
    activeSensors: 72,
    currentOccupancy: 1650,
    maxCapacity: 2200,
    powerDrawKw: 118.0,
    temperatureC: 25.2,
    co2Ppm: 630,
    healthStatus: 'nominal',
    description: 'On-campus student living quarters, central dining mess with automated induction kettles, and student plaza canteen.',
    keyLabsOrRooms: ['Boys Wing A & B', 'Gargi Girls Residence', 'Central Dining Mess', 'Student Plaza Canteen'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'sports-complex',
    name: 'LNCT Sports Arena & Cricket Ground',
    hindiName: 'क्रीड़ा संकुल',
    code: 'SPT-G',
    category: 'facility',
    areaSqm: 18000,
    floors: 1,
    gps: { lat: 23.25035, lng: 77.52580 },
    coordinates: { x: 370, y: 440, width: 190, height: 110, depth: 12 },
    activeSensors: 14,
    currentOccupancy: 190,
    maxCapacity: 1500,
    powerDrawKw: 16.4,
    temperatureC: 27.5,
    co2Ppm: 420,
    healthStatus: 'nominal',
    description: 'Floodlit cricket ground, synthetic basketball courts, badminton indoor court, and outdoor athletics track.',
    keyLabsOrRooms: ['Main Cricket Pavilion', 'Indoor Badminton Court', 'High-Mast LED Lighting Towers', 'Gymnasium'],
    relays: { acOn: false, lightsOn: true, autoControl: true }
  },
  {
    id: 'main-gate-transport',
    name: 'Raisen Road Main Gate & RFID Fleet',
    hindiName: 'मुख्य प्रवेश द्वार एवं परिवहन',
    code: 'GAT-1',
    category: 'facility',
    areaSqm: 4500,
    floors: 1,
    gps: { lat: 23.25075, lng: 77.52700 },
    coordinates: { x: 590, y: 320, width: 110, height: 120, depth: 14 },
    activeSensors: 22,
    currentOccupancy: 85,
    maxCapacity: 400,
    powerDrawKw: 12.8,
    temperatureC: 28.0,
    co2Ppm: 470,
    healthStatus: 'nominal',
    description: 'Automated ANPR boom barriers, student RFID turnstiles, bus depot monitoring 65 LNCT college commuter buses across Bhopal.',
    keyLabsOrRooms: ['Security Command Post', 'Automated RFID Pedestrian Turnstiles', 'Bus Fleet GPS Depot', 'Visitor Desk'],
    relays: { acOn: true, lightsOn: true, autoControl: false }
  }
];

// Exact Haversine Distance Calculator (meters) from Google Earth / Maps Lat-Long
export function calculateHaversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Walking path distance incorporates 1.24x campus sidewalk Manhattan tortuosity factor
export function getInterBuildingDistance(fromId: CampusBlockId, toId: CampusBlockId): BuildingDistanceEntry {
  const b1 = LNCT_CAMPUS_BLOCKS.find(b => b.id === fromId) || LNCT_CAMPUS_BLOCKS[0];
  const b2 = LNCT_CAMPUS_BLOCKS.find(b => b.id === toId) || LNCT_CAMPUS_BLOCKS[0];
  if (b1.id === b2.id) {
    return {
      fromId: b1.id,
      fromName: b1.name,
      toId: b2.id,
      toName: b2.name,
      straightLineMeters: 0,
      walkingPathMeters: 0,
      walkingTimeMin: 0
    };
  }
  const straight = calculateHaversineMeters(b1.gps.lat, b1.gps.lng, b2.gps.lat, b2.gps.lng);
  const walking = Math.round(straight * 1.24);
  const walkMin = Number((walking / 80).toFixed(1)); // Average campus pace ~80 m/min (4.8 km/h)
  return {
    fromId: b1.id,
    fromName: b1.name,
    toId: b2.id,
    toName: b2.name,
    straightLineMeters: straight,
    walkingPathMeters: walking,
    walkingTimeMin: walkMin
  };
}

// Precompute full pairwise distance matrix for export and table view
export const LNCT_DISTANCE_MATRIX: BuildingDistanceEntry[] = (() => {
  const list: BuildingDistanceEntry[] = [];
  for (let i = 0; i < LNCT_CAMPUS_BLOCKS.length; i++) {
    for (let j = i + 1; j < LNCT_CAMPUS_BLOCKS.length; j++) {
      list.push(getInterBuildingDistance(LNCT_CAMPUS_BLOCKS[i].id, LNCT_CAMPUS_BLOCKS[j].id));
    }
  }
  return list;
})();

// Precompute static spatial blueprint export dataset
export const LNCT_SPATIAL_BLUEPRINT_DATA = LNCT_CAMPUS_BLOCKS.map(b => ({
  block_id: b.id,
  code: b.code,
  building_name: b.name,
  category: b.category,
  latitude: b.gps.lat,
  longitude: b.gps.lng,
  built_up_area_sqm: b.areaSqm,
  floors: b.floors,
  max_capacity: b.maxCapacity,
  installed_iot_nodes: b.activeSensors,
  distance_from_main_gate_m: getInterBuildingDistance('main-gate-transport', b.id).walkingPathMeters,
  distance_from_library_m: getInterBuildingDistance('central-library', b.id).walkingPathMeters,
  key_facilities: b.keyLabsOrRooms.join(' | ')
}));

// Generate 30-day timetable-driven hourly dataset (matches exact schema from student's project plan)
export function generate30DayTimetableDataset(days: number = 7): RoomScheduleIoTRecord[] {
  const blocks = [
    { name: 'CS_Block', rooms: ['Lab_402_AI', 'Cloud_Lab_301', 'Smart_LH_101', 'IoT_Lab_205'] },
    { name: 'Main_Block_ECE', rooms: ['VLSI_Lab_201', 'DSP_Lab_104', 'Seminar_Hall_1'] },
    { name: 'Central_Library', rooms: ['Reading_Hall_F2', 'Digital_ELibrary'] },
    { name: 'Kalchuri_Audi', rooms: ['Orchestra_Main'] }
  ];

  const records: RoomScheduleIoTRecord[] = [];
  const start = new Date('2026-10-15T00:00:00Z').getTime();
  const totalHours = days * 24;

  // Deterministic pseudo-random helper so previews stay stable & fast
  let seed = 4219;
  const nextRand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let h = 0; h < totalHours; h++) {
    const dt = new Date(start + h * 3600 * 1000);
    const hour = dt.getUTCHours();
    const dayOfWeek = dt.getUTCDay(); // 0 = Sun
    const isCollegeHour = dayOfWeek !== 0 && hour >= 9 && hour <= 17;

    for (const blk of blocks) {
      for (const room of blk.rooms) {
        let occupancy = 0;
        let temp = 21.5;
        let light = 15;
        let acStatus: 0 | 1 = 0;

        if (isCollegeHour) {
          // 15% chance room has free period during daytime
          const hasClass = nextRand() > 0.15;
          occupancy = hasClass ? Math.floor(24 + nextRand() * 48) : 0;
          temp = Number((22.5 + nextRand() * 6.5).toFixed(1));
          light = occupancy > 0 ? Math.floor(340 + nextRand() * 180) : (nextRand() < 0.25 ? 360 : 40);
          acStatus = occupancy > 15 || temp > 26.0 ? 1 : (nextRand() < 0.12 ? 1 : 0);
        } else {
          occupancy = 0;
          temp = Number((19.0 + nextRand() * 4.5).toFixed(1));
          light = nextRand() < 0.04 ? 320 : Math.floor(nextRand() * 15);
          // 6% chance someone forgot to turn off AC overnight (Wastage Anomaly!)
          acStatus = nextRand() < 0.06 ? 1 : 0;
        }

        const wastageFlag: 0 | 1 = occupancy === 0 && (acStatus === 1 || light > 200) ? 1 : 0;
        let powerKwh = 0.25; // Standby UPS / Router draw
        if (acStatus === 1) powerKwh += 1.85 + nextRand() * 1.1;
        if (light > 200) powerKwh += 0.28;
        if (occupancy > 0 && blk.name === 'CS_Block') powerKwh += (occupancy * 0.06); // PCs active

        records.push({
          Timestamp: dt.toISOString().replace('T', ' ').slice(0, 19),
          Block_Name: blk.name,
          Room_ID: room,
          Temperature_C: temp,
          Humidity: Number((38 + nextRand() * 24).toFixed(1)),
          Light_Lux: light,
          Occupancy_Count: occupancy,
          AC_Status: acStatus,
          Power_Usage_kWh: Number(powerKwh.toFixed(2)),
          Wastage_Flag: wastageFlag
        });
      }
    }
  }
  return records;
}

export const LNCT_CAMPUS_ASSETS: CampusAsset[] = [
  {
    id: 'AST-HVAC-01',
    name: 'Kalchuri Auditorium Chiller Compressor 1',
    blockId: 'auditorium',
    location: 'Auditorium Central AHU Plant Room, Ground Floor',
    category: 'hvac',
    makeModel: 'Blue Star Centrifugal Chiller 180 TR (Water Cooled)',
    ratedCapacity: '180 TR / 140 kW',
    installedYear: 2021,
    lastServiceDate: '2026-08-14',
    nextScheduledService: '2026-11-14',
    healthIndex: 88,
    vibrationRms: 1.82,
    vibrationThreshold: 2.80,
    bearingTempC: 54.2,
    tempThreshold: 68.0,
    currentDrawAmps: 184.5,
    harmonicThdPct: 3.2,
    predictedRulDays: 142,
    failureRisk: 'low',
    iotSensorNode: 'NODE-AUD-VIB-01 (ESP32 + MPU6050 + PT100)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-08-14', action: 'Refrigerant R134a top-up & oil filter replacement', technician: 'M. P. Cooling Systems' },
      { date: '2026-02-10', action: 'Bearing vibration FFT spectral calibration', technician: 'LNCT Mechanical Dept' }
    ]
  },
  {
    id: 'AST-ELEC-TR01',
    name: 'Primary Step-Down Transformer T-01 (11kV / 415V)',
    blockId: 'substation-utility',
    location: 'Central Substation Transformer Bay 1',
    category: 'electrical',
    makeModel: 'Kirloskar Electric 1250 kVA ONAN Oil Cooled',
    ratedCapacity: '1250 kVA / 11 kV to 415 V',
    installedYear: 2019,
    lastServiceDate: '2026-06-20',
    nextScheduledService: '2026-12-20',
    healthIndex: 79,
    vibrationRms: 2.35,
    vibrationThreshold: 3.10,
    bearingTempC: 62.8,
    tempThreshold: 75.0,
    currentDrawAmps: 820.0,
    harmonicThdPct: 4.8,
    predictedRulDays: 98,
    failureRisk: 'moderate',
    iotSensorNode: 'NODE-SUB-TR1-01 (Modbus RTU to MQTT Gateway)',
    telemetryStatus: 'warning',
    maintenanceHistory: [
      { date: '2026-06-20', action: 'Transformer oil BDV dielectric test (passed 48 kV)', technician: 'Bhopal Power Tech' },
      { date: '2025-11-15', action: 'Silica gel breather reactivation & bushing cleanup', technician: 'Campus Electrical Team' }
    ]
  },
  {
    id: 'AST-SOLAR-INV03',
    name: 'Block A Rooftop Solar Inverter 3 (100 kW)',
    blockId: 'block-a-cse',
    location: 'Block A Rooftop Inverter Station',
    category: 'solar',
    makeModel: 'Sungrow SG110CX Multi-MPPT String Inverter',
    ratedCapacity: '100 kW AC / 1100 V DC Max',
    installedYear: 2022,
    lastServiceDate: '2026-09-02',
    nextScheduledService: '2027-03-02',
    healthIndex: 94,
    vibrationRms: 0.45,
    vibrationThreshold: 1.50,
    bearingTempC: 48.6,
    tempThreshold: 65.0,
    currentDrawAmps: 139.2,
    harmonicThdPct: 1.9,
    predictedRulDays: 280,
    failureRisk: 'low',
    iotSensorNode: 'NODE-SLR-INV3 (RS485 Modbus TCP Gateway)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-09-02', action: 'Firmware upgrade & DC isolator contact check', technician: 'CleanMax Solar AMC' }
    ]
  },
  {
    id: 'AST-PUMP-HYD01',
    name: 'Campus Central Overhead Booster Water Pump 1',
    blockId: 'substation-utility',
    location: 'Pump House near Substation, Ground Reservoir',
    category: 'hydraulics',
    makeModel: 'Kirloskar Monobloc Centrifugal Pump 25 HP',
    ratedCapacity: '25 HP (18.6 kW) / 120 m³/hr',
    installedYear: 2020,
    lastServiceDate: '2026-07-11',
    nextScheduledService: '2026-10-15',
    healthIndex: 67,
    vibrationRms: 3.42,
    vibrationThreshold: 3.50,
    bearingTempC: 71.4,
    tempThreshold: 75.0,
    currentDrawAmps: 34.8,
    harmonicThdPct: 5.6,
    predictedRulDays: 24,
    failureRisk: 'elevated',
    iotSensorNode: 'NODE-PUMP-01 (ESP32 + ADXL345 Vibration Sensor)',
    telemetryStatus: 'alert',
    maintenanceHistory: [
      { date: '2026-07-11', action: 'Impeller de-scaling & mechanical gland packing', technician: 'Shree Balaji Pumps Bhopal' }
    ]
  },
  {
    id: 'AST-GEN-DG01',
    name: 'Campus Standby Diesel Generator (500 kVA)',
    blockId: 'substation-utility',
    location: 'Acoustic Generator Enclosure, Substation Yard',
    category: 'electrical',
    makeModel: 'Cummins India 500 kVA Silent DG Set (KTA19-G5)',
    ratedCapacity: '500 kVA (400 kW) @ 1500 RPM',
    installedYear: 2018,
    lastServiceDate: '2026-09-18',
    nextScheduledService: '2026-12-18',
    healthIndex: 85,
    vibrationRms: 2.10,
    vibrationThreshold: 4.20,
    bearingTempC: 58.0,
    tempThreshold: 85.0,
    currentDrawAmps: 0.0,
    harmonicThdPct: 2.8,
    predictedRulDays: 195,
    failureRisk: 'low',
    iotSensorNode: 'NODE-DG-01 (Cummins PCC2100 CAN Bus Sniffer)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-09-18', action: 'Engine oil 15W40 change, fuel filter & coolant flush', technician: 'Jakson Cummins Service' }
    ]
  },
  {
    id: 'AST-COMP-HPC01',
    name: 'Block A AI & GPU Supercomputing Cluster Rack',
    blockId: 'block-a-cse',
    location: 'CSE Block A, Room 402 AI Research Lab',
    category: 'computing',
    makeModel: 'Dell PowerEdge R750xa with 4x NVIDIA A100 80GB',
    ratedCapacity: '12 kW Continuous Power / Dual 2400W Redundant PSU',
    installedYear: 2023,
    lastServiceDate: '2026-05-19',
    nextScheduledService: '2026-11-19',
    healthIndex: 96,
    vibrationRms: 0.28,
    vibrationThreshold: 1.00,
    bearingTempC: 38.4,
    tempThreshold: 55.0,
    currentDrawAmps: 26.4,
    harmonicThdPct: 1.4,
    predictedRulDays: 340,
    failureRisk: 'low',
    iotSensorNode: 'NODE-CSE-HPC-01 (SNMP v3 & IPMI Agent)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-05-19', action: 'Fan tray clean, firmware updates, thermal paste inspect', technician: 'Dell Enterprise Support' }
    ]
  },
  {
    id: 'AST-HVAC-VRF02',
    name: 'Central Library VRF Air Conditioning Outdoor Unit',
    blockId: 'central-library',
    location: 'Library Terrace, North Bay',
    category: 'hvac',
    makeModel: 'Daikin VRV X Series 24 HP Outdoor Modular',
    ratedCapacity: '67 kW Cooling / 24 HP',
    installedYear: 2021,
    lastServiceDate: '2026-06-12',
    nextScheduledService: '2026-12-12',
    healthIndex: 82,
    vibrationRms: 1.65,
    vibrationThreshold: 2.60,
    bearingTempC: 56.1,
    tempThreshold: 70.0,
    currentDrawAmps: 48.2,
    harmonicThdPct: 3.5,
    predictedRulDays: 160,
    failureRisk: 'low',
    iotSensorNode: 'NODE-LIB-VRF-01 (Daikin DIII-Net Gateway)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-06-12', action: 'Condenser coil high pressure nitrogen wash', technician: 'Daikin Authorized Bhopal' }
    ]
  },
  {
    id: 'AST-MECH-CNC01',
    name: 'Block C 5-Axis VMC Machining Center',
    blockId: 'block-c-mech',
    location: 'Mechanical Workshop Bay 3, Ground Floor',
    category: 'electrical',
    makeModel: 'Jyoti CNC VMC 850 Performance Machining Center',
    ratedCapacity: '15 kW Spindle Motor / 10,000 RPM',
    installedYear: 2019,
    lastServiceDate: '2026-04-10',
    nextScheduledService: '2026-10-10',
    healthIndex: 74,
    vibrationRms: 2.88,
    vibrationThreshold: 3.20,
    bearingTempC: 66.5,
    tempThreshold: 72.0,
    currentDrawAmps: 28.7,
    harmonicThdPct: 4.1,
    predictedRulDays: 48,
    failureRisk: 'moderate',
    iotSensorNode: 'NODE-MECH-CNC-01 (Industrial Accelerometer + Current CT)',
    telemetryStatus: 'warning',
    maintenanceHistory: [
      { date: '2026-04-10', action: 'Spindle runout laser check and gib adjustment', technician: 'Jyoti CNC Engineers' }
    ]
  }
];

export const LNCT_STUDENT_DENSITY_ZONES: StudentDensityZone[] = [
  {
    zoneId: 'ZONE-CSE-LAB402',
    zoneName: 'AI & GPU Research Lab (Block A)',
    blockId: 'block-a-cse',
    floor: 'Floor 4',
    areaSqm: 240,
    maxCapacity: 90,
    currentOccupancy: 82,
    densityPerSqm: 0.34,
    inflowRatePerHour: 28,
    outflowRatePerHour: 14,
    wifiProbeCount: 94,
    tofSensorCount: 2,
    predictedDensity1h: 0.38,
    predictedDensity2h: 0.12,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 22.5,
    hvacSavingsKw: 2.4
  },
  {
    zoneId: 'ZONE-CSE-LH101',
    zoneName: 'Smart Lecture Hall 101 (Block A)',
    blockId: 'block-a-cse',
    floor: 'Floor 1',
    areaSqm: 180,
    maxCapacity: 120,
    currentOccupancy: 104,
    densityPerSqm: 0.58,
    inflowRatePerHour: 45,
    outflowRatePerHour: 38,
    wifiProbeCount: 112,
    tofSensorCount: 2,
    predictedDensity1h: 0.61,
    predictedDensity2h: 0.05,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 23.0,
    hvacSavingsKw: 3.8
  },
  {
    zoneId: 'ZONE-AUD-MAIN',
    zoneName: 'Kalchuri Auditorium Orchestra Hall',
    blockId: 'auditorium',
    floor: 'Ground',
    areaSqm: 1800,
    maxCapacity: 1000,
    currentOccupancy: 380,
    densityPerSqm: 0.21,
    inflowRatePerHour: 65,
    outflowRatePerHour: 20,
    wifiProbeCount: 420,
    tofSensorCount: 4,
    predictedDensity1h: 0.45,
    predictedDensity2h: 0.72,
    congestionLevel: 'moderate',
    hvacSetpointOptimalC: 22.0,
    hvacSavingsKw: 8.6
  },
  {
    zoneId: 'ZONE-LIB-READ',
    zoneName: 'Dr. APJ Kalam Library Reading Hall',
    blockId: 'central-library',
    floor: 'Floor 2',
    areaSqm: 850,
    maxCapacity: 350,
    currentOccupancy: 275,
    densityPerSqm: 0.32,
    inflowRatePerHour: 34,
    outflowRatePerHour: 26,
    wifiProbeCount: 298,
    tofSensorCount: 2,
    predictedDensity1h: 0.36,
    predictedDensity2h: 0.39,
    congestionLevel: 'moderate',
    hvacSetpointOptimalC: 23.5,
    hvacSavingsKw: 1.8
  },
  {
    zoneId: 'ZONE-CANTEEN-PLAZA',
    zoneName: 'LNCT Student Plaza & Central Canteen',
    blockId: 'hostel-cluster',
    floor: 'Ground',
    areaSqm: 900,
    maxCapacity: 450,
    currentOccupancy: 395,
    densityPerSqm: 0.44,
    inflowRatePerHour: 140,
    outflowRatePerHour: 125,
    wifiProbeCount: 440,
    tofSensorCount: 3,
    predictedDensity1h: 0.48,
    predictedDensity2h: 0.18,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 24.0,
    hvacSavingsKw: 4.2
  },
  {
    zoneId: 'ZONE-ECE-VLSI',
    zoneName: 'VLSI & Embedded Lab (Block B)',
    blockId: 'block-b-ece',
    floor: 'Floor 2',
    areaSqm: 160,
    maxCapacity: 75,
    currentOccupancy: 48,
    densityPerSqm: 0.30,
    inflowRatePerHour: 12,
    outflowRatePerHour: 8,
    wifiProbeCount: 52,
    tofSensorCount: 1,
    predictedDensity1h: 0.28,
    predictedDensity2h: 0.10,
    congestionLevel: 'low',
    hvacSetpointOptimalC: 24.0,
    hvacSavingsKw: 1.2
  },
  {
    zoneId: 'ZONE-MECH-SHOP',
    zoneName: 'Heavy Machine Workshop (Block C)',
    blockId: 'block-c-mech',
    floor: 'Ground',
    areaSqm: 650,
    maxCapacity: 150,
    currentOccupancy: 85,
    densityPerSqm: 0.13,
    inflowRatePerHour: 18,
    outflowRatePerHour: 12,
    wifiProbeCount: 78,
    tofSensorCount: 2,
    predictedDensity1h: 0.15,
    predictedDensity2h: 0.08,
    congestionLevel: 'low',
    hvacSetpointOptimalC: 25.5,
    hvacSavingsKw: 2.1
  },
  {
    zoneId: 'ZONE-GATE-BOOM',
    zoneName: 'Raisen Road RFID Turnstile Gate 1',
    blockId: 'main-gate-transport',
    floor: 'Entry Plaza',
    areaSqm: 350,
    maxCapacity: 200,
    currentOccupancy: 52,
    densityPerSqm: 0.15,
    inflowRatePerHour: 180,
    outflowRatePerHour: 60,
    wifiProbeCount: 68,
    tofSensorCount: 4,
    predictedDensity1h: 0.22,
    predictedDensity2h: 0.10,
    congestionLevel: 'low',
    hvacSetpointOptimalC: 26.0,
    hvacSavingsKw: 0.5
  }
];

export const LNCT_ENERGY_TIMESERIES_24H: EnergyReading[] = [
  { timestamp: '2026-11-14T00:00:00Z', timeSlot: '00:00', gridImportKw: 110.2, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 110.2, apparentPowerKva: 122.4, powerFactor: 0.90, solarIrradianceWm2: 0, gridFrequencyHz: 50.02, co2SavedKg: 0, costInr: 936, specificEnergyKwhM2: 0.0016 },
  { timestamp: '2026-11-14T02:00:00Z', timeSlot: '02:00', gridImportKw: 96.5, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 96.5, apparentPowerKva: 106.1, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.04, co2SavedKg: 0, costInr: 820, specificEnergyKwhM2: 0.0014 },
  { timestamp: '2026-11-14T04:00:00Z', timeSlot: '04:00', gridImportKw: 104.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 104.0, apparentPowerKva: 114.2, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 49.98, co2SavedKg: 0, costInr: 884, specificEnergyKwhM2: 0.0015 },
  { timestamp: '2026-11-14T06:00:00Z', timeSlot: '06:00', gridImportKw: 138.4, solarGenerationKw: 12.5, dieselGensetKw: 0.0, totalDemandKw: 150.9, apparentPowerKva: 164.0, powerFactor: 0.92, solarIrradianceWm2: 65, gridFrequencyHz: 50.01, co2SavedKg: 10.2, costInr: 1176, specificEnergyKwhM2: 0.0022 },
  { timestamp: '2026-11-14T08:00:00Z', timeSlot: '08:00', gridImportKw: 245.0, solarGenerationKw: 118.4, dieselGensetKw: 0.0, totalDemandKw: 363.4, apparentPowerKva: 395.0, powerFactor: 0.92, solarIrradianceWm2: 320, gridFrequencyHz: 49.95, co2SavedKg: 97.1, costInr: 2082, specificEnergyKwhM2: 0.0053 },
  { timestamp: '2026-11-14T09:30:00Z', timeSlot: '09:30', gridImportKw: 310.8, solarGenerationKw: 265.0, dieselGensetKw: 0.0, totalDemandKw: 575.8, apparentPowerKva: 619.1, powerFactor: 0.93, solarIrradianceWm2: 610, gridFrequencyHz: 50.00, co2SavedKg: 217.3, costInr: 2641, specificEnergyKwhM2: 0.0084 },
  { timestamp: '2026-11-14T11:00:00Z', timeSlot: '11:00', gridImportKw: 285.2, solarGenerationKw: 420.5, dieselGensetKw: 0.0, totalDemandKw: 705.7, apparentPowerKva: 750.7, powerFactor: 0.94, solarIrradianceWm2: 890, gridFrequencyHz: 49.96, co2SavedKg: 344.8, costInr: 2424, specificEnergyKwhM2: 0.0103 },
  { timestamp: '2026-11-14T12:30:00Z', timeSlot: '12:30', gridImportKw: 232.0, solarGenerationKw: 492.0, dieselGensetKw: 0.0, totalDemandKw: 724.0, apparentPowerKva: 762.1, powerFactor: 0.95, solarIrradianceWm2: 960, gridFrequencyHz: 50.01, co2SavedKg: 403.4, costInr: 1972, specificEnergyKwhM2: 0.0106 },
  { timestamp: '2026-11-14T14:00:00Z', timeSlot: '14:00', gridImportKw: 260.5, solarGenerationKw: 445.0, dieselGensetKw: 0.0, totalDemandKw: 705.5, apparentPowerKva: 742.6, powerFactor: 0.95, solarIrradianceWm2: 850, gridFrequencyHz: 49.99, co2SavedKg: 364.9, costInr: 2214, specificEnergyKwhM2: 0.0103 },
  { timestamp: '2026-11-14T15:30:00Z', timeSlot: '15:30', gridImportKw: 348.0, solarGenerationKw: 280.0, dieselGensetKw: 0.0, totalDemandKw: 628.0, apparentPowerKva: 668.0, powerFactor: 0.94, solarIrradianceWm2: 520, gridFrequencyHz: 49.97, co2SavedKg: 229.6, costInr: 2958, specificEnergyKwhM2: 0.0092 },
  { timestamp: '2026-11-14T17:00:00Z', timeSlot: '17:00', gridImportKw: 382.4, solarGenerationKw: 85.0, dieselGensetKw: 0.0, totalDemandKw: 467.4, apparentPowerKva: 508.0, powerFactor: 0.92, solarIrradianceWm2: 140, gridFrequencyHz: 49.95, co2SavedKg: 69.7, costInr: 3250, specificEnergyKwhM2: 0.0068 },
  { timestamp: '2026-11-14T18:30:00Z', timeSlot: '18:30', gridImportKw: 315.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 315.0, apparentPowerKva: 346.1, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.02, co2SavedKg: 0, costInr: 2677, specificEnergyKwhM2: 0.0046 },
  { timestamp: '2026-11-14T20:00:00Z', timeSlot: '20:00', gridImportKw: 242.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 242.0, apparentPowerKva: 266.0, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.00, co2SavedKg: 0, costInr: 2057, specificEnergyKwhM2: 0.0035 },
  { timestamp: '2026-11-14T22:00:00Z', timeSlot: '22:00', gridImportKw: 168.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 168.0, apparentPowerKva: 184.6, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.03, co2SavedKg: 0, costInr: 1428, specificEnergyKwhM2: 0.0025 }
];

export const LNCT_SAMPLE_IOT_TELEMETRY: IoTTelemetryRecord[] = [
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-CSE-402', blockId: 'block-a-cse', blockName: 'Block A - CSE', zone: 'AI Lab 402', floor: 4, tempCelsius: 22.8, humidityRh: 48.2, co2Ppm: 712, acousticDb: 46.5, ambientLux: 420, activePowerKw: 14.8, powerFactor: 0.95, pirCount: 24, wifiProbeCount: 88, vibrationRms: 0.22, batteryPct: 100, rssiDbm: -54 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-CSE-LH101', blockId: 'block-a-cse', blockName: 'Block A - CSE', zone: 'Lecture Hall 101', floor: 1, tempCelsius: 23.6, humidityRh: 51.0, co2Ppm: 840, acousticDb: 62.4, ambientLux: 510, activePowerKw: 8.6, powerFactor: 0.94, pirCount: 42, wifiProbeCount: 110, vibrationRms: 0.18, batteryPct: 98, rssiDbm: -58 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-AUD-AHU1', blockId: 'auditorium', blockName: 'Auditorium', zone: 'Central Plant Room', floor: 0, tempCelsius: 26.4, humidityRh: 44.5, co2Ppm: 520, acousticDb: 78.2, ambientLux: 180, activePowerKw: 84.5, powerFactor: 0.91, pirCount: 3, wifiProbeCount: 8, vibrationRms: 1.82, batteryPct: 100, rssiDbm: -62 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-AUD-ORCH', blockId: 'auditorium', blockName: 'Auditorium', zone: 'Main Hall', floor: 0, tempCelsius: 22.1, humidityRh: 47.8, co2Ppm: 760, acousticDb: 58.0, ambientLux: 360, activePowerKw: 18.2, powerFactor: 0.96, pirCount: 86, wifiProbeCount: 412, vibrationRms: 0.15, batteryPct: 95, rssiDbm: -50 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-LIB-STACK1', blockId: 'central-library', blockName: 'Central Library', zone: 'Reading Hall Floor 2', floor: 2, tempCelsius: 22.9, humidityRh: 46.2, co2Ppm: 590, acousticDb: 34.2, ambientLux: 480, activePowerKw: 12.4, powerFactor: 0.97, pirCount: 38, wifiProbeCount: 295, vibrationRms: 0.10, batteryPct: 100, rssiDbm: -48 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-SUB-TR1', blockId: 'substation-utility', blockName: 'Central Substation', zone: 'Transformer Yard T-01', floor: 0, tempCelsius: 62.8, humidityRh: 38.0, co2Ppm: 450, acousticDb: 68.9, ambientLux: 820, activePowerKw: 580.4, powerFactor: 0.94, pirCount: 1, wifiProbeCount: 4, vibrationRms: 2.35, batteryPct: 100, rssiDbm: -64 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-PUMP-01', blockId: 'substation-utility', blockName: 'Central Substation', zone: 'Booster Pump House', floor: 0, tempCelsius: 71.4, humidityRh: 42.0, co2Ppm: 460, acousticDb: 84.1, ambientLux: 220, activePowerKw: 18.6, powerFactor: 0.88, pirCount: 2, wifiProbeCount: 3, vibrationRms: 3.42, batteryPct: 92, rssiDbm: -68 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-MECH-CNC1', blockId: 'block-c-mech', blockName: 'Block C - Mech', zone: 'CNC Workshop Bay 3', floor: 0, tempCelsius: 28.5, humidityRh: 49.0, co2Ppm: 560, acousticDb: 82.5, ambientLux: 540, activePowerKw: 28.7, powerFactor: 0.89, pirCount: 14, wifiProbeCount: 42, vibrationRms: 2.88, batteryPct: 99, rssiDbm: -60 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-HST-MESS', blockId: 'hostel-cluster', blockName: 'Hostel Cluster', zone: 'Central Dining Mess', floor: 0, tempCelsius: 27.2, humidityRh: 62.0, co2Ppm: 890, acousticDb: 72.8, ambientLux: 380, activePowerKw: 46.2, powerFactor: 0.93, pirCount: 95, wifiProbeCount: 440, vibrationRms: 0.32, batteryPct: 94, rssiDbm: -52 },
  { timestamp: '2026-11-14T09:45:00Z', nodeId: 'NODE-GATE-TURN1', blockId: 'main-gate-transport', blockName: 'Raisen Road Gate', zone: 'Turnstile Plaza', floor: 0, tempCelsius: 28.0, humidityRh: 44.0, co2Ppm: 470, acousticDb: 64.0, ambientLux: 950, activePowerKw: 4.8, powerFactor: 0.92, pirCount: 68, wifiProbeCount: 85, vibrationRms: 0.12, batteryPct: 100, rssiDbm: -56 }
];

export const LNCT_DIGITAL_TWIN_SCENARIOS: DigitalTwinScenario[] = [
  {
    id: 'nominal-weekday',
    title: 'Nominal College Day (Baseline)',
    description: 'Standard working day with full classroom schedules, active computer labs, and balanced 550kWp rooftop solar generation.',
    badge: 'Baseline Mode',
    impactMetrics: [
      { label: 'Campus Total Demand', value: '645 kW', change: 'Normal' },
      { label: 'Solar Contribution', value: '445 kW (69%)', change: 'Optimal' },
      { label: 'Student Occupancy', value: '4,450 On-Campus', change: 'Nominal' }
    ],
    simulationAdjustments: {
      densityMultiplier: 1.0,
      solarMultiplier: 1.0,
      gridAvailable: true,
      dgActive: false,
      ambientTempC: 31.0
    }
  },
  {
    id: 'srishti-fest-surge',
    title: 'Srishti Annual Techfest Crowd Surge',
    description: 'Annual flagship technical festival. Auditorium and central lawns experience 300% footfall surge. Chiller and ventilation demand spikes.',
    badge: 'Extreme Crowd',
    impactMetrics: [
      { label: 'Auditorium Crowd', value: '1,220 / 1,250 (98%)', change: '+240%' },
      { label: 'HVAC Cooling Load', value: '168 kW', change: '+92%' },
      { label: 'Predicted Peak Demand', value: '880 kW', change: '+36%' }
    ],
    simulationAdjustments: {
      densityMultiplier: 2.8,
      solarMultiplier: 1.0,
      gridAvailable: true,
      dgActive: false,
      ambientTempC: 33.0
    }
  },
  {
    id: 'bhopal-heatwave-43c',
    title: 'Bhopal Summer Heatwave (43°C Ambient)',
    description: 'Extreme May climate on Raisen Road. Ambient temperature reaches 43.5°C, reducing solar PV panel efficiency by 14% and raising chiller COP stress.',
    badge: 'Thermal Stress',
    impactMetrics: [
      { label: 'Ambient Temperature', value: '43.2°C', change: '+12.2°C' },
      { label: 'Solar PV Derating', value: '-14.8% (Thermal Loss)', change: 'Derated' },
      { label: 'Transformer T-01 Temp', value: '74.5°C (Alert)', change: '+11.7°C' }
    ],
    simulationAdjustments: {
      densityMultiplier: 1.05,
      solarMultiplier: 0.85,
      gridAvailable: true,
      dgActive: false,
      ambientTempC: 43.2
    }
  },
  {
    id: 'grid-blackout-dg-transfer',
    title: 'MPEB 11kV Grid Failure & DG Transfer',
    description: 'Simulates sudden utility grid tripping on Raisen Road feeder. Automatic Transfer Switch (ATS) synchronizes Cummins 500kVA DG set within 8 seconds.',
    badge: 'Island Microgrid',
    impactMetrics: [
      { label: 'Grid Feed Voltage', value: '0.0 kV (Tripped)', change: 'Failed' },
      { label: 'Standby DG Genset', value: '380 kW Active', change: 'Running' },
      { label: 'Automated Shedding', value: 'Non-Essential Labs Shed', change: '-165 kW' }
    ],
    simulationAdjustments: {
      densityMultiplier: 1.0,
      solarMultiplier: 0.5,
      gridAvailable: false,
      dgActive: true,
      ambientTempC: 30.5
    }
  },
  {
    id: 'asset-fault-waterpump',
    title: 'Critical Pump 1 Bearing Degradation (Predictive)',
    description: 'Simulates mechanical bearing flaking on Kirloskar 25HP booster pump. RMS vibration exceeds ISO 10816 threshold (3.9 mm/s), triggering auto-switchover to Pump 2.',
    badge: 'Predictive Maintenance',
    impactMetrics: [
      { label: 'Pump 1 Vibration', value: '3.92 mm/s (Alert)', change: '+115%' },
      { label: 'Predicted RUL', value: '3.2 Days Remaining', change: 'Critical' },
      { label: 'Auto-Switchover', value: 'Pump 2 Engaged', change: 'Protected' }
    ],
    simulationAdjustments: {
      densityMultiplier: 1.0,
      solarMultiplier: 1.0,
      gridAvailable: true,
      dgActive: false,
      ambientTempC: 31.0,
      assetFaultId: 'AST-PUMP-HYD01'
    }
  }
];

export function convertToCSV(data: Record<string, unknown>[]): string {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers
      .map(fieldName => {
        const val = row[fieldName];
        if (typeof val === 'object' && val !== null) {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [headers.join(','), ...rows].join('\r\n');
}

export function downloadFile(filename: string, content: string, contentType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
