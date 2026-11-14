import React, { useState } from 'react';
import { CampusBlock, CampusBlockId, LiveTelemetryPacket } from '../types/campus';
import { downloadFile } from '../data/lnctCampusData';
import {
  Cpu,
  Send,
  AlertTriangle,
  CheckCircle2,
  Download,
  Terminal,
  Copy,
  Check,
  Zap,
  RefreshCw,
  Code2,
  Radio
} from 'lucide-react';

interface HardwareBridgeViewProps {
  blocks: CampusBlock[];
  packets: LiveTelemetryPacket[];
  onRefreshState: () => Promise<void>;
}

const PYTHON_FASTAPI_SERVER_CODE = `"""
LNCT Bhopal Smart Campus AI Digital Twin - Python FastAPI Backend
Run locally:
  pip install -r requirements.txt
  uvicorn fastapi_twin_server:app --host 0.0.0.0 --port 8000 --reload
"""
from datetime import datetime, timezone
from typing import Dict, List, Literal, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="LNCT Bhopal AI Digital Twin Backend",
    description="Hardware-ready REST + AI Anomaly Engine for ESP32/Arduino & React 3D Twin",
    version="1.0.0"
)

# Enable CORS so React/Three.js frontend connects seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TelemetryIngest(BaseModel):
    node_id: str = Field(default="NODE-CSE-402")
    block_id: str = Field(default="block-a-cse")
    room_id: str = Field(default="AI_Lab_402")
    temp_c: float = Field(ge=-10, le=70)
    humidity: float = Field(ge=0, le=100)
    light_lux: int = Field(ge=0, le=5000)
    occupancy: int = Field(ge=0, le=2000)
    ac_status: Literal[0, 1]
    power_kwh: float = Field(ge=0)
    source: Literal["esp32_hardware", "software_simulator"] = "esp32_hardware"

class RelayCommand(BaseModel):
    block_id: str
    ac_on: Optional[bool] = None
    lights_on: Optional[bool] = None
    auto_control: Optional[bool] = None

# In-memory block relay states (replace with MongoDB/PostgreSQL for persistence)
BLOCK_RELAYS: Dict[str, Dict[str, bool]] = {
    "block-a-cse": {"acOn": True, "lightsOn": True, "autoControl": True},
    "block-b-ece": {"acOn": True, "lightsOn": True, "autoControl": True},
    "block-c-mech": {"acOn": True, "lightsOn": True, "autoControl": True},
    "auditorium": {"acOn": True, "lightsOn": True, "autoControl": True},
    "central-library": {"acOn": True, "lightsOn": True, "autoControl": True},
    "rnd-incubation": {"acOn": True, "lightsOn": True, "autoControl": True},
    "substation-utility": {"acOn": True, "lightsOn": True, "autoControl": False},
    "hostel-cluster": {"acOn": True, "lightsOn": True, "autoControl": True},
    "sports-complex": {"acOn": False, "lightsOn": True, "autoControl": True},
    "main-gate-transport": {"acOn": True, "lightsOn": True, "autoControl": False},
}

TELEMETRY_LOG: List[dict] = []

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "online",
        "service": "LNCT Bhopal FastAPI Digital Twin",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/v1/telemetry/ingest")
def ingest_telemetry(payload: TelemetryIngest):
    if payload.block_id not in BLOCK_RELAYS:
        raise HTTPException(status_code=400, detail=f"Unknown block_id: {payload.block_id}")

    relays = BLOCK_RELAYS[payload.block_id]
    wastage_detected = payload.occupancy == 0 and (payload.ac_status == 1 or payload.light_lux > 200)
    wastage_kw = round((2.2 if payload.ac_status == 1 else 0.0) + (0.35 if payload.light_lux > 200 else 0.0), 2) if wastage_detected else 0.0

    command = "KEEP_ON" if payload.ac_status == 1 else "IDLE"
    if wastage_detected and relays["autoControl"]:
        relays["acOn"] = False
        relays["lightsOn"] = False
        command = "AUTO_SHUTOFF_AC"
    elif payload.occupancy > 0 and payload.temp_c > 27.5:
        command = "PRE_COOL_BOOST"

    record = {
        **payload.model_dump(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "anomaly_detected": wastage_detected,
        "wastage_kw": wastage_kw,
        "actuation_command": command,
    }
    TELEMETRY_LOG.insert(0, record)
    if len(TELEMETRY_LOG) > 200:
        TELEMETRY_LOG.pop()

    return {
        "accepted": True,
        "packet": record,
        "relay_state": relays,
        "ai_verdict": f"Wastage detected ({wastage_kw} kW)" if wastage_detected else "Nominal"
    }

@app.get("/api/v1/actuate/commands/{block_id}")
def get_esp32_commands(block_id: str):
    if block_id not in BLOCK_RELAYS:
        raise HTTPException(status_code=404, detail="Block not found")
    r = BLOCK_RELAYS[block_id]
    return {
        "block_id": block_id,
        "ac_relay": 1 if r["acOn"] else 0,
        "lights_relay": 1 if r["lightsOn"] else 0,
        "auto_control": r["autoControl"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/v1/actuate/relay")
def set_relay(cmd: RelayCommand):
    if cmd.block_id not in BLOCK_RELAYS:
        raise HTTPException(status_code=404, detail="Block not found")
    r = BLOCK_RELAYS[cmd.block_id]
    if cmd.ac_on is not None:
        r["acOn"] = cmd.ac_on
    if cmd.lights_on is not None:
        r["lightsOn"] = cmd.lights_on
    if cmd.auto_control is not None:
        r["autoControl"] = cmd.auto_control
    return {"success": True, "block_id": cmd.block_id, "relays": r}
`;

const PYTHON_AI_MODEL_CODE = `"""
LNCT Bhopal Smart Campus - AI Energy Predictor & Wastage Anomaly Detector
Trains directly on the downloaded 'lnct_30day_iot_dataset.csv' file.
"""
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.metrics import mean_absolute_error, r2_score

# 1. Load LNCT 30-day dataset (downloadable from Datasets Center)
df = pd.read_csv("lnct_30day_iot_dataset.csv")
df["Timestamp"] = pd.to_datetime(df["Timestamp"])
df["Hour"] = df["Timestamp"].dt.hour
df["DayOfWeek"] = df["Timestamp"].dt.dayofweek

# Encode categorical columns
df_encoded = pd.get_dummies(df, columns=["Block_Name", "Room_ID"], drop_first=True)

# 2. Energy Consumption Prediction Model (Random Forest)
feature_cols = [c for c in df_encoded.columns if c not in ["Timestamp", "Power_Usage_kWh", "Wastage_Flag"]]
X = df_encoded[feature_cols]
y = df_encoded["Power_Usage_kWh"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
regressor = RandomForestRegressor(n_estimators=100, random_state=42)
regressor.fit(X_train, y_train)

preds = regressor.predict(X_test)
print(f"Energy Predictor MAE: {mean_absolute_error(y_test, preds):.3f} kWh | R2: {r2_score(y_test, preds):.3f}")

# 3. Unsupervised Anomaly Detection (Isolation Forest for Energy Wastage)
iso = IsolationForest(contamination=0.06, random_state=42)
df["Anomaly_Score"] = iso.fit_predict(df[["Temperature_C", "Light_Lux", "Occupancy_Count", "AC_Status", "Power_Usage_kWh"]])
wastage_rows = df[(df["Occupancy_Count"] == 0) & (df["AC_Status"] == 1)]
print(f"Detected {len(wastage_rows)} empty-room AC wastage events. Total wasted energy: {wastage_rows['Power_Usage_kWh'].sum():.2f} kWh")
`;

const ESP32_ARDUINO_CODE = `/*
 * LNCT Bhopal Smart Campus - Hardware-Ready ESP32 IoT Node
 * Libraries required in Arduino IDE:
 *   1. DHT sensor library (Adafruit)
 *   2. ArduinoJson (by Benoit Blanchon)
 * Hardware Pins:
 *   - DHT11 Data   -> GPIO 4
 *   - PIR Sensor   -> GPIO 13
 *   - LDR Module   -> GPIO 34 (Analog ADC)
 *   - Relay Ch1 AC -> GPIO 26 (Active LOW or HIGH depending on module)
 *   - Relay Ch2 Lt -> GPIO 27
 */
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* WIFI_SSID     = "YOUR_COLLEGE_OR_HOTSPOT_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Point to your laptop's local IP running FastAPI (port 8000) or Node server (port 3000)
const char* SERVER_BASE   = "http://192.168.1.100:8000";
const char* BLOCK_ID      = "block-a-cse";
const char* ROOM_ID       = "AI_Lab_402";
const char* NODE_ID       = "NODE-CSE-402";

#define DHTPIN   4
#define DHTTYPE  DHT11
#define PIR_PIN  13
#define LDR_PIN  34
#define RELAY_AC 26
#define RELAY_LT 27

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(PIR_PIN, INPUT);
  pinMode(RELAY_AC, OUTPUT);
  pinMode(RELAY_LT, OUTPUT);
  digitalWrite(RELAY_AC, HIGH);
  digitalWrite(RELAY_LT, HIGH);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected! IP: " + WiFi.localIP().toString());
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    return;
  }

  float tempC = dht.readTemperature();
  float hum   = dht.readHumidity();
  if (isnan(tempC) || isnan(hum)) {
    tempC = 25.0; // Safe sensor fallback
    hum   = 50.0;
  }

  int motionDetected = digitalRead(PIR_PIN);
  int ldrRaw         = analogRead(LDR_PIN);
  int lightLux       = map(ldrRaw, 0, 4095, 0, 800);
  int acState        = digitalRead(RELAY_AC) == HIGH ? 1 : 0;
  float powerKwh     = (acState == 1 ? 2.40 : 0.20) + (lightLux > 200 ? 0.25 : 0.0);

  // Step 1: POST live telemetry to Digital Twin Backend
  HTTPClient http;
  String ingestUrl = String(SERVER_BASE) + "/api/v1/telemetry/ingest";
  http.begin(ingestUrl);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<384> doc;
  doc["node_id"]    = NODE_ID;
  doc["block_id"]   = BLOCK_ID;
  doc["room_id"]    = ROOM_ID;
  doc["temp_c"]     = tempC;
  doc["humidity"]   = hum;
  doc["light_lux"]  = lightLux;
  doc["occupancy"]  = motionDetected == HIGH ? 1 : 0;
  doc["ac_status"]  = acState;
  doc["power_kwh"]  = powerKwh;
  doc["source"]     = "esp32_hardware";

  String body;
  serializeJson(doc, body);
  int httpCode = http.POST(body);

  if (httpCode == 200) {
    String resp = http.getString();
    StaticJsonDocument<512> resDoc;
    DeserializationError err = deserializeJson(resDoc, resp);
    if (!err) {
      bool acOn  = resDoc["relay_state"]["acOn"];
      bool ltOn  = resDoc["relay_state"]["lightsOn"];
      digitalWrite(RELAY_AC, acOn ? HIGH : LOW);
      digitalWrite(RELAY_LT, ltOn ? HIGH : LOW);
      Serial.println("[SYNC] Relay updated -> AC: " + String(acOn) + " Lights: " + String(ltOn));
    }
  } else {
    Serial.println("[ERR] HTTP Code: " + String(httpCode));
  }
  http.end();

  delay(5000); // Send telemetry every 5 seconds
}
`;

export const HardwareBridgeView: React.FC<HardwareBridgeViewProps> = ({
  blocks,
  packets,
  onRefreshState
}) => {
  const [blockId, setBlockId] = useState<CampusBlockId>('block-a-cse');
  const [roomId, setRoomId] = useState<string>('AI_Lab_402');
  const [occupancy, setOccupancy] = useState<number>(0);
  const [tempC, setTempC] = useState<number>(22.4);
  const [lightLux, setLightLux] = useState<number>(420);
  const [acStatus, setAcStatus] = useState<0 | 1>(1);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<'fastapi' | 'ai' | 'esp32'>('fastapi');
  const [copied, setCopied] = useState<boolean>(false);

  const sendSimulatedPacket = async (overrides?: Partial<{
    block_id: CampusBlockId;
    room_id: string;
    occupancy: number;
    temp_c: number;
    light_lux: number;
    ac_status: 0 | 1;
  }>) => {
    setIsSending(true);
    const payload = {
      node_id: `NODE-${(overrides?.block_id || blockId).toUpperCase().slice(0, 7)}`,
      block_id: overrides?.block_id ?? blockId,
      room_id: overrides?.room_id ?? roomId,
      temp_c: overrides?.temp_c ?? tempC,
      humidity: 48.5,
      light_lux: overrides?.light_lux ?? lightLux,
      occupancy: overrides?.occupancy ?? occupancy,
      ac_status: overrides?.ac_status ?? acStatus,
      power_kwh: Number((((overrides?.ac_status ?? acStatus) === 1 ? 2.4 : 0.25) + ((overrides?.light_lux ?? lightLux) > 200 ? 0.3 : 0)).toFixed(2)),
      source: 'software_simulator'
    };

    try {
      const res = await fetch('/api/v1/telemetry/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      setLastResponse(JSON.stringify(json, null, 2));
      await onRefreshState();
    } catch (err) {
      setLastResponse(`Error contacting backend: ${String(err)}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = async () => {
    await fetch('/api/v1/simulate/reset', { method: 'POST' });
    setLastResponse(null);
    await onRefreshState();
  };

  const activeCode =
    activeFile === 'fastapi'
      ? PYTHON_FASTAPI_SERVER_CODE
      : activeFile === 'ai'
      ? PYTHON_AI_MODEL_CODE
      : ESP32_ARDUINO_CODE;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Explanation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <Radio className="w-3.5 h-3.5" />
              <span>Hardware-Ready REST Ingestion · Zero-Error ESP32 / Arduino Plug & Play</span>
            </div>
            <h2 className="text-lg font-semibold text-white mt-0.5">
              Virtual IoT Sensor Simulator & Python FastAPI Software Bundle
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Test the complete Digital Twin software pipeline without physical sensors. Every simulated packet hits the live <code className="text-cyan-300 font-mono">/api/v1/telemetry/ingest</code> endpoint, runs AI wastage evaluation, and triggers closed-loop relay commands that immediately sync with the 3D campus model.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Live Twin State</span>
          </button>
        </div>
      </div>

      {/* Main Split: Packet Simulator + Live Ingestion Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Virtual Sensor Injector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">1. Virtual ESP32 Sensor Injector</h3>
            <span className="text-xs text-slate-400 block mb-4">
              Send mock sensor telemetry or trigger instant test presets
            </span>

            {/* One-Click Test Presets */}
            <div className="grid grid-cols-1 gap-2 mb-5">
              <button
                onClick={() => {
                  setOccupancy(0);
                  setAcStatus(1);
                  setLightLux(420);
                  setTempC(21.5);
                  sendSimulatedPacket({ occupancy: 0, ac_status: 1, light_lux: 420, temp_c: 21.5 });
                }}
                disabled={isSending}
                className="p-2.5 text-left rounded-lg bg-rose-950/50 hover:bg-rose-950/80 border border-rose-800/70 transition-colors text-xs"
              >
                <div className="flex items-center justify-between font-semibold text-rose-300">
                  <span>Preset A: Empty Room + AC Left ON (Wastage)</span>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Triggers AI wastage detection & auto-shuts AC relay if Auto-Cutoff is enabled.
                </span>
              </button>

              <button
                onClick={() => {
                  setOccupancy(58);
                  setAcStatus(1);
                  setLightLux(460);
                  setTempC(24.0);
                  sendSimulatedPacket({ occupancy: 58, ac_status: 1, light_lux: 460, temp_c: 24.0 });
                }}
                disabled={isSending}
                className="p-2.5 text-left rounded-lg bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 transition-colors text-xs"
              >
                <div className="flex items-center justify-between font-semibold text-emerald-300">
                  <span>Preset B: Active Lecture (58 Students)</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Normal daytime class operation with optimal cooling and occupancy sync.
                </span>
              </button>
            </div>

            {/* Custom Controls */}
            <div className="space-y-3 text-xs border-t border-slate-800 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Target LNCT Block</label>
                  <select
                    value={blockId}
                    onChange={e => setBlockId(e.target.value as CampusBlockId)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {blocks.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.name.split(' - ')[0]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Room / Lab ID</label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Occupancy Count</span>
                    <span className="font-mono text-cyan-400">{occupancy}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={occupancy}
                    onChange={e => setOccupancy(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Room Temp (°C)</span>
                    <span className="font-mono text-amber-400">{tempC}°C</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="42"
                    step="0.5"
                    value={tempC}
                    onChange={e => setTempC(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Light Intensity (Lux)</span>
                    <span className="font-mono text-slate-200">{lightLux} lx</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="600"
                    step="10"
                    value={lightLux}
                    onChange={e => setLightLux(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Simulated AC State</label>
                  <button
                    onClick={() => setAcStatus(acStatus === 1 ? 0 : 1)}
                    className={`w-full py-1.5 rounded-lg font-mono text-xs border transition-colors ${
                      acStatus === 1
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    AC_Status: {acStatus} ({acStatus === 1 ? 'ON' : 'OFF'})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => sendSimulatedPacket()}
            disabled={isSending}
            className="mt-5 w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Dispatching Packet...' : 'POST /api/v1/telemetry/ingest'}</span>
          </button>
        </div>

        {/* Right: Live Backend Stream & AI Verdict Log (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">2. Live Ingestion & AI Actuation Stream</h3>
            <span className="text-xs text-slate-400">
              Real-time records processed by the backend engine (identical schema to physical ESP32 hardware)
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-[260px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Node / Room</th>
                  <th className="py-2 px-3 text-right">Occ</th>
                  <th className="py-2 px-3 text-right">Temp</th>
                  <th className="py-2 px-3 text-right">Power</th>
                  <th className="py-2 px-3">AI Verdict</th>
                  <th className="py-2 px-3">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {packets.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3">
                      <span className="text-cyan-400 block">{p.block_id}</span>
                      <span className="text-[10px] text-slate-400">{p.room_id} · {p.node_id}</span>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-slate-200">{p.occupancy}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-slate-200">{p.temp_c}°C</td>
                    <td className="py-2 px-3 text-right tabular-nums text-amber-400">{p.power_kwh} kWh</td>
                    <td className="py-2 px-3 font-sans">
                      {p.anomaly_detected ? (
                        <span className="text-rose-400 font-semibold">Wastage ({p.wastage_kw} kW)</span>
                      ) : (
                        <span className="text-emerald-400">Nominal</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        p.actuation_command === 'AUTO_SHUTOFF_AC'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-cyan-300'
                      }`}>
                        {p.actuation_command}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lastResponse && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Latest HTTP 200 JSON Response from Server:
              </span>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[150px]">
                {lastResponse}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Downloadable Python FastAPI + AI + Arduino/ESP32 Bundle */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">
              3. Downloadable Python FastAPI, AI Model & ESP32 Hardware Bundle
            </h3>
            <span className="text-xs text-slate-400">
              Drop-in Python FastAPI backend + Arduino IDE code matching the exact endpoints above
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadFile('fastapi_twin_server.py', PYTHON_FASTAPI_SERVER_CODE, 'text/x-python')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>fastapi_twin_server.py</span>
            </button>
            <button
              onClick={() => downloadFile('ai_energy_predictor.py', PYTHON_AI_MODEL_CODE, 'text/x-python')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ai_energy_predictor.py</span>
            </button>
            <button
              onClick={() => downloadFile('esp32_lnct_hardware_node.ino', ESP32_ARDUINO_CODE, 'text/plain')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>esp32_lnct_hardware_node.ino</span>
            </button>
            <button
              onClick={() =>
                downloadFile(
                  'requirements.txt',
                  'fastapi>=0.115.0\nuvicorn[standard]>=0.30.0\npydantic>=2.8.0\npandas>=2.2.0\nscikit-learn>=1.5.0\npaho-mqtt>=2.1.0\n',
                  'text/plain'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>requirements.txt</span>
            </button>
          </div>
        </div>

        {/* Code Preview Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveFile('fastapi')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeFile === 'fastapi' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Python FastAPI Server
            </button>
            <button
              onClick={() => setActiveFile('ai')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeFile === 'ai' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Scikit-Learn AI Wastage & Predictor
            </button>
            <button
              onClick={() => setActiveFile('esp32')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeFile === 'esp32' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Arduino / ESP32 Plug-and-Play Sketch
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy File'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-[11.5px] font-mono text-cyan-300 leading-relaxed overflow-x-auto max-h-[380px]">
          {activeCode}
        </pre>
      </div>
    </div>
  );
};
