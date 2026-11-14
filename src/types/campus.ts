export type CampusBlockId =
  | 'block-a-cse'
  | 'block-b-ece'
  | 'block-c-mech'
  | 'auditorium'
  | 'central-library'
  | 'rnd-incubation'
  | 'substation-utility'
  | 'hostel-cluster'
  | 'sports-complex'
  | 'main-gate-transport';

export interface CampusBlock {
  id: CampusBlockId;
  name: string;
  hindiName?: string;
  code: string;
  category: 'academic' | 'utility' | 'facility' | 'residential';
  areaSqm: number;
  floors: number;
  gps: { lat: number; lng: number };
  coordinates: { x: number; y: number; width: number; height: number; depth: number };
  activeSensors: number;
  currentOccupancy: number;
  maxCapacity: number;
  powerDrawKw: number;
  temperatureC: number;
  co2Ppm: number;
  healthStatus: 'nominal' | 'warning' | 'critical';
  description: string;
  keyLabsOrRooms: string[];
  relays: {
    acOn: boolean;
    lightsOn: boolean;
    autoControl: boolean;
  };
}

export interface BuildingDistanceEntry {
  fromId: CampusBlockId;
  fromName: string;
  toId: CampusBlockId;
  toName: string;
  straightLineMeters: number;
  walkingPathMeters: number;
  walkingTimeMin: number;
}

export interface RoomScheduleIoTRecord {
  Timestamp: string;
  Block_Name: string;
  Room_ID: string;
  Temperature_C: number;
  Humidity: number;
  Light_Lux: number;
  Occupancy_Count: number;
  AC_Status: 0 | 1;
  Power_Usage_kWh: number;
  Wastage_Flag: 0 | 1;
}

export interface LiveTelemetryPacket {
  id: string;
  timestamp: string;
  node_id: string;
  block_id: CampusBlockId;
  room_id: string;
  temp_c: number;
  humidity: number;
  light_lux: number;
  occupancy: number;
  ac_status: 0 | 1;
  power_kwh: number;
  source: 'esp32_hardware' | 'software_simulator';
  anomaly_detected: boolean;
  wastage_kw: number;
  actuation_command: 'KEEP_ON' | 'AUTO_SHUTOFF_AC' | 'PRE_COOL_BOOST' | 'IDLE';
}

export interface IoTTelemetryRecord {
  timestamp: string;
  nodeId: string;
  blockId: CampusBlockId;
  blockName: string;
  zone: string;
  floor: number;
  tempCelsius: number;
  humidityRh: number;
  co2Ppm: number;
  acousticDb: number;
  ambientLux: number;
  activePowerKw: number;
  powerFactor: number;
  pirCount: number;
  wifiProbeCount: number;
  vibrationRms: number;
  batteryPct: number;
  rssiDbm: number;
}

export interface CampusAsset {
  id: string;
  name: string;
  blockId: CampusBlockId;
  location: string;
  category: 'electrical' | 'hvac' | 'computing' | 'hydraulics' | 'solar';
  makeModel: string;
  ratedCapacity: string;
  installedYear: number;
  lastServiceDate: string;
  nextScheduledService: string;
  healthIndex: number;
  vibrationRms: number;
  vibrationThreshold: number;
  bearingTempC: number;
  tempThreshold: number;
  currentDrawAmps: number;
  harmonicThdPct: number;
  predictedRulDays: number;
  failureRisk: 'low' | 'moderate' | 'elevated' | 'critical';
  iotSensorNode: string;
  telemetryStatus: 'online' | 'warning' | 'alert';
  maintenanceHistory: { date: string; action: string; technician: string }[];
}

export interface EnergyReading {
  timestamp: string;
  timeSlot: string;
  gridImportKw: number;
  solarGenerationKw: number;
  dieselGensetKw: number;
  totalDemandKw: number;
  apparentPowerKva: number;
  powerFactor: number;
  solarIrradianceWm2: number;
  gridFrequencyHz: number;
  co2SavedKg: number;
  costInr: number;
  specificEnergyKwhM2: number;
}

export interface StudentDensityZone {
  zoneId: string;
  zoneName: string;
  blockId: CampusBlockId;
  floor: string;
  areaSqm: number;
  maxCapacity: number;
  currentOccupancy: number;
  densityPerSqm: number;
  inflowRatePerHour: number;
  outflowRatePerHour: number;
  wifiProbeCount: number;
  tofSensorCount: number;
  predictedDensity1h: number;
  predictedDensity2h: number;
  congestionLevel: 'low' | 'moderate' | 'high' | 'overcrowded';
  hvacSetpointOptimalC: number;
  hvacSavingsKw: number;
}

export interface DigitalTwinScenario {
  id: string;
  title: string;
  description: string;
  badge: string;
  impactMetrics: { label: string; value: string; change: string }[];
  simulationAdjustments: {
    densityMultiplier: number;
    solarMultiplier: number;
    gridAvailable: boolean;
    dgActive: boolean;
    ambientTempC: number;
    assetFaultId?: string;
  };
}
