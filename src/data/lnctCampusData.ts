import type {
  CampusBlock,
  CampusBlockId,
  CampusAsset,
  EnergyReading,
  StudentDensityZone,
  IoTTelemetryRecord,
  DigitalTwinScenario,
  BuildingDistanceEntry,
  RoomScheduleIoTRecord,
  FloorSectionRoom,
  RGPVTimetableRecord,
  RGPVPaperPredictionRecord
} from '../types/campus.ts';

// LNCT Bhopal Raisen Road Campus (Kalchuri Nagar, Bhopal, MP 462022)
export const LNCT_CAMPUS_CENTER = { lat: 23.2515, lng: 77.5245 };

export const LNCT_CAMPUS_BLOCKS: CampusBlock[] = [
  {
    id: 'lnct-main',
    name: 'LNCT Main Building',
    hindiName: 'एलएनसीटी मुख्य भवन',
    code: 'LNCT-M',
    category: 'academic',
    areaSqm: 16500,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['CSE', 'CSE-AIML', 'AIDS', 'EC', 'EC Advance', 'EEE', 'Electrical', 'Mechanical'],
    specialFacilities: ['Admin & Principal Office', 'Kalchuri Seminar Hall', 'Core EC/EEE/Mech Labs', 'Rooftop Chhatt Solar Array'],
    gps: { lat: 23.25205, lng: 77.52405 },
    coordinates: { x: 110, y: 150, width: 150, height: 110, depth: 48 },
    activeSensors: 78,
    currentOccupancy: 1320,
    maxCapacity: 1800,
    powerDrawKw: 168.4,
    temperatureC: 24.0,
    co2Ppm: 690,
    healthStatus: 'nominal',
    description: 'Primary 6-floor (+ Chhatt) flagship building housing EC, EC Advance, EEE, Electrical, Mechanical, CSE, CSE-AIML & AIDS departments with G1-G10 through F5-1 to F5-10 sections.',
    keyLabsOrRooms: ['G1-G10 Admin & Mech/EEE Labs', 'F1-1 to F1-10 EC & EC Advance', 'F2-1 to F2-10 CSE & Electrical', 'F3-1 to F3-10 CSE-AIML & AIDS', 'F4/F5 Lecture Halls + Roof Solar Chhatt'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'cv-raman-block',
    name: 'Sir CV Raman Block (Central Library)',
    hindiName: 'सर सी.वी. रमन भवन एवं केंद्रीय पुस्तकालय',
    code: 'CVR-LIB',
    category: 'academic',
    areaSqm: 13400,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['3rd Yr B.Tech CSE-AIDS', '3rd Yr B.Tech CSE-AIML', '2nd Yr B.Tech AIDS', '2nd Yr B.Tech AIML'],
    specialFacilities: ['LNCT Central Library (G & F1)', 'Digital E-Library', 'AI/ML Computing Carrels', 'Rooftop Chhatt Chiller Units'],
    gps: { lat: 23.25195, lng: 77.52505 },
    coordinates: { x: 280, y: 160, width: 135, height: 105, depth: 48 },
    activeSensors: 72,
    currentOccupancy: 1180,
    maxCapacity: 1600,
    powerDrawKw: 138.5,
    temperatureC: 22.8,
    co2Ppm: 720,
    healthStatus: 'nominal',
    description: '6-floor (+ Chhatt) Sir CV Raman Block housing the LNCT Central Library alongside 2nd Year B.Tech AIDS/AIML and 3rd Year B.Tech CSE-AIDS/CSE-AIML classrooms & labs (G1-G10 to F5-1..F5-10).',
    keyLabsOrRooms: ['G1-G10 LNCT Central Library & Reading Hall', 'F1-1 to F1-10 Digital E-Library & Reference', 'F2-1 to F2-10 2nd Yr AIDS & AIML Classes', 'F3-1 to F3-10 3rd Yr CSE-AIDS & CSE-AIML', 'F4/F5 Project Studios & Roof Chhatt'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'refftronix-drone-lab',
    name: 'Refftronix Drone Lab (Nr. CV Raman)',
    hindiName: 'रेफट्रॉनिक्स ड्रोन प्रयोगशाला',
    code: 'RFT-DRN',
    category: 'lab',
    areaSqm: 1850,
    floors: 2,
    hasRoofChhatt: true,
    sectionsPerFloor: 4,
    branches: ['UAV & Drone R&D', 'Robotics', 'CSE-AIML / EC Projects'],
    specialFacilities: ['Indoor Drone Flight Cage', 'LiPo Battery Charging Safety Bay', 'BLDC Thrust Test Rig', 'Flight Telemetry Ground Station'],
    gps: { lat: 23.25165, lng: 77.52548 },
    coordinates: { x: 350, y: 270, width: 80, height: 65, depth: 18 },
    activeSensors: 18,
    currentOccupancy: 46,
    maxCapacity: 80,
    powerDrawKw: 22.4,
    temperatureC: 24.6,
    co2Ppm: 510,
    healthStatus: 'nominal',
    description: 'Specialized UAV & autonomous drone engineering lab located adjacent to Sir CV Raman Block for quadcopter prototyping, flight dynamics, and LiDAR payload testing.',
    keyLabsOrRooms: ['Drone Netted Flight Arena', 'Flight Controller Calibration Bench', '3D Printing Airframe Bay', 'Ground Control Telemetry Desk'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'charles-babbage-it',
    name: 'IT Building (Charles Babbage Block)',
    hindiName: 'चार्ल्स बैबेज आईटी भवन',
    code: 'IT-CBB',
    category: 'academic',
    areaSqm: 12200,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['IT', 'CSE Practical Labs', 'Cloud & Network Computing'],
    specialFacilities: ['Campus Data Center', 'High-Density Coding Labs', 'RGPV Online Practical Test Center', 'Cisco Networking Lab'],
    gps: { lat: 23.25135, lng: 77.52415 },
    coordinates: { x: 115, y: 295, width: 135, height: 100, depth: 48 },
    activeSensors: 68,
    currentOccupancy: 910,
    maxCapacity: 1400,
    powerDrawKw: 154.2,
    temperatureC: 22.5,
    co2Ppm: 675,
    healthStatus: 'nominal',
    description: '6-floor (+ Chhatt) Charles Babbage IT Building hosting enterprise computer labs, server racks, and RGPV university practical exam workstations.',
    keyLabsOrRooms: ['G1-G10 Central Computing & Server Hub', 'F1-1 to F1-10 Cisco & Linux Labs', 'F2-1 to F2-10 Java/Python Practical Halls', 'F3-F5 Software Engineering & Project Labs'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'lncts-old',
    name: 'LNCT&S Old Block',
    hindiName: 'एलएनसीटीएंडएस पुराना भवन',
    code: 'LNCTS-O',
    category: 'academic',
    areaSqm: 11200,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['EC', 'CSE', 'AIML', 'CSE-Cyber Security (Exclusive)'],
    specialFacilities: ['Cyber Forensics & SOC Lab', 'EC VLSI Workbench', '6 Floors G1-F5_10'],
    gps: { lat: 23.25190, lng: 77.52610 },
    coordinates: { x: 445, y: 155, width: 125, height: 95, depth: 48 },
    activeSensors: 58,
    currentOccupancy: 820,
    maxCapacity: 1250,
    powerDrawKw: 112.0,
    temperatureC: 24.4,
    co2Ppm: 660,
    healthStatus: 'nominal',
    description: '6-floor (+ Chhatt) LNCT&S Old Block housing EC, CSE, AIML, and the exclusive CSE-Cyber Security labs (offered only in LNCT&S).',
    keyLabsOrRooms: ['G1-G10 EC & Basic Science Labs', 'F1-1 to F1-10 CSE Lecture Sections', 'F2-1 to F2-10 CSE-Cyber Security Exclusive Labs', 'F3-F5 AIML & Seminar Halls'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'lncts-new',
    name: 'LNCT&S New Block',
    hindiName: 'एलएनसीटीएंडएस नया भवन',
    code: 'LNCTS-N',
    category: 'academic',
    areaSqm: 12800,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['CSE', 'AIML', 'CSE-Cyber Security (Exclusive)', 'EC'],
    specialFacilities: ['Ethical Hacking & Penetration Testing Lab', 'Smart Auditorium Wing', '6 Floors G1-F5_10'],
    gps: { lat: 23.25130, lng: 77.52620 },
    coordinates: { x: 450, y: 280, width: 125, height: 95, depth: 48 },
    activeSensors: 62,
    currentOccupancy: 890,
    maxCapacity: 1350,
    powerDrawKw: 124.6,
    temperatureC: 23.6,
    co2Ppm: 645,
    healthStatus: 'nominal',
    description: 'Modern 6-floor (+ Chhatt) LNCT&S New Block expanding CSE, AIML, EC, and exclusive CSE-Cyber Security academic batches.',
    keyLabsOrRooms: ['G1-G10 Cyber Security & Placement Cell', 'F1-1 to F1-10 CSE-Cyber Security Classrooms', 'F2-1 to F2-10 AIML Smart Classrooms', 'F3-F5 EC & Project Incubation Halls'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'lncte-building',
    name: 'LNCTE Building (Excellence)',
    hindiName: 'एलएनसीटीई भवन',
    code: 'LNCTE',
    category: 'academic',
    areaSqm: 11900,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['CSE', 'CSE-AIML', 'CSE-DS (Data Science)'],
    specialFacilities: ['Big Data & Hadoop Analytics Lab', 'CSE-DS Visualization Studio', '6 Floors G1-F5_10'],
    gps: { lat: 23.25060, lng: 77.52510 },
    coordinates: { x: 280, y: 390, width: 135, height: 95, depth: 48 },
    activeSensors: 60,
    currentOccupancy: 860,
    maxCapacity: 1300,
    powerDrawKw: 116.8,
    temperatureC: 23.9,
    co2Ppm: 635,
    healthStatus: 'nominal',
    description: '6-floor (+ Chhatt) LNCTE Excellence Building specializing in CSE, CSE-AIML, and CSE-Data Science (CSE-DS) with 10 sections per floor.',
    keyLabsOrRooms: ['G1-G10 CSE-DS Analytics Hub', 'F1-1 to F1-10 CSE Core Classrooms', 'F2-1 to F2-10 CSE-AIML Computing Labs', 'F3-F5 CSE-DS & RGPV Exam Halls'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'lnctu-building',
    name: 'LNCTU Building (LNCT University Wing)',
    hindiName: 'एलएनसीटी विश्वविद्यालय भवन',
    code: 'LNCTU',
    category: 'academic',
    areaSqm: 13800,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['University Engineering', 'BCA / MCA', 'Management & Research'],
    specialFacilities: ['Central University Innovation Hall', 'Moot & Research Labs', '6 Floors G1-F5_10'],
    gps: { lat: 23.25055, lng: 77.52625 },
    coordinates: { x: 445, y: 400, width: 130, height: 95, depth: 48 },
    activeSensors: 54,
    currentOccupancy: 740,
    maxCapacity: 1200,
    powerDrawKw: 104.5,
    temperatureC: 24.2,
    co2Ppm: 595,
    healthStatus: 'nominal',
    description: '6-floor (+ Chhatt) LNCTU academic block on Raisen Road housing university engineering, computing, and research divisions.',
    keyLabsOrRooms: ['G1-G10 University Reception & Studios', 'F1-1 to F1-10 School of Computing', 'F2-F5 Lecture Suites & Research Labs'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'lncp-pharmacy',
    name: 'LNCP (Lakshmi Narain College of Pharmacy)',
    hindiName: 'लक्ष्मी नारायण फार्मेसी महाविद्यालय',
    code: 'LNCP',
    category: 'academic',
    areaSqm: 8400,
    floors: 6,
    hasRoofChhatt: true,
    sectionsPerFloor: 10,
    branches: ['B.Pharm', 'M.Pharm', 'Pharmaceutics & Pharmacology'],
    specialFacilities: ['HPLC & Analytical Chemistry Lab', 'Pharmaceutical Formulation Cleanroom', 'Medicinal Garden', '6 Floors G1-F5_10'],
    gps: { lat: 23.25045, lng: 77.52380 },
    coordinates: { x: 110, y: 420, width: 130, height: 90, depth: 44 },
    activeSensors: 44,
    currentOccupancy: 520,
    maxCapacity: 850,
    powerDrawKw: 86.2,
    temperatureC: 22.2,
    co2Ppm: 530,
    healthStatus: 'warning',
    description: '6-floor (+ Chhatt) LNCP Pharmacy college featuring temperature-controlled pharmaceutics labs, fume hoods, and RGPV pharmacy exam sections.',
    keyLabsOrRooms: ['G1-G10 Pharmaceutics & Machine Room', 'F1-1 to F1-10 Pharmacology & Cold Storage', 'F2-F5 Pharmaceutical Chemistry & Classrooms'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'lnct-main-canteen',
    name: 'LNCT Main Canteen & Student Plaza',
    hindiName: 'एलएनसीटी मुख्य कैंटीन',
    code: 'CANT-M',
    category: 'facility',
    areaSqm: 2600,
    floors: 2,
    hasRoofChhatt: true,
    sectionsPerFloor: 4,
    branches: ['All Campus Branches (Break Rush Hub)'],
    specialFacilities: ['Main Dining Counter', 'Food Court Seating', 'Cold Storage Chillers', 'Lunch Peak Crowd Sensor'],
    gps: { lat: 23.25120, lng: 77.52505 },
    coordinates: { x: 280, y: 295, width: 110, height: 70, depth: 18 },
    activeSensors: 20,
    currentOccupancy: 410,
    maxCapacity: 550,
    powerDrawKw: 48.5,
    temperatureC: 26.5,
    co2Ppm: 780,
    healthStatus: 'nominal',
    description: 'Central campus dining and break-hour gathering plaza experiencing massive 12:30 PM – 02:00 PM footfall spikes between CV Raman, Main Building, and LNCTE.',
    keyLabsOrRooms: ['Main Counter Queue Zone', 'Indoor Dining Hall', 'Outdoor Plaza Seating', 'Kitchen Cold Room'],
    relays: { acOn: true, lightsOn: true, autoControl: true }
  },
  {
    id: 'substation-solar',
    name: 'Campus 11kV Substation & 550kWp Solar Hub',
    hindiName: 'केंद्रीय विद्युत सबस्टेशन एवं सोलर प्लांट',
    code: 'SUB-PV',
    category: 'utility',
    areaSqm: 2800,
    floors: 1,
    hasRoofChhatt: false,
    sectionsPerFloor: 4,
    branches: ['Campus Microgrid Infrastructure'],
    specialFacilities: ['1250 kVA Transformer T-01', '500 kVA Cummins DG', 'Sungrow Solar String Inverters', 'Kirloskar Booster Pumps'],
    gps: { lat: 23.25195, lng: 77.52705 },
    coordinates: { x: 600, y: 170, width: 105, height: 85, depth: 16 },
    activeSensors: 48,
    currentOccupancy: 10,
    maxCapacity: 25,
    powerDrawKw: 580.4,
    temperatureC: 37.8,
    co2Ppm: 455,
    healthStatus: 'warning',
    description: 'Central campus power substation distributing 11kV/415V power across all 10 LNCT buildings alongside rooftop solar aggregation.',
    keyLabsOrRooms: ['Transformer Yard T-01', 'HT Switchgear Room', 'Solar Inverter Bank', 'Booster Water Pump House'],
    relays: { acOn: true, lightsOn: true, autoControl: false }
  },
  {
    id: 'raisen-main-gate',
    name: 'Raisen Road Main Gate & Bus Fleet Depot',
    hindiName: 'रायसेन रोड मुख्य प्रवेश द्वार',
    code: 'GATE-1',
    category: 'facility',
    areaSqm: 4200,
    floors: 1,
    hasRoofChhatt: false,
    sectionsPerFloor: 4,
    branches: ['Campus Entry & Transport'],
    specialFacilities: ['ANPR Entry Gate', 'RFID Student Turnstiles', '65+ College Bus Bay'],
    gps: { lat: 23.25060, lng: 77.52715 },
    coordinates: { x: 600, y: 340, width: 105, height: 100, depth: 14 },
    activeSensors: 22,
    currentOccupancy: 95,
    maxCapacity: 450,
    powerDrawKw: 14.2,
    temperatureC: 28.0,
    co2Ppm: 470,
    healthStatus: 'nominal',
    description: 'Primary Raisen Road entrance monitoring morning student bus arrivals (08:30–09:30 AM) and afternoon departures.',
    keyLabsOrRooms: ['Security Command Post', 'RFID Pedestrian Turnstiles', 'LNCT Bus Parking Yard', 'Visitor Desk'],
    relays: { acOn: true, lightsOn: true, autoControl: false }
  }
];

// Generate all 6-floor x 10-section rooms (G1..G10, F1-1..F1-10 ... F5-1..F5-10 + Roof Chhatt)
export function generateAllFloorSectionsDataset(): FloorSectionRoom[] {
  const floors: ('G' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5')[] = ['G', 'F1', 'F2', 'F3', 'F4', 'F5'];
  const rooms: FloorSectionRoom[] = [];

  for (const blk of LNCT_CAMPUS_BLOCKS) {
    if (blk.floors >= 6) {
      for (const fl of floors) {
        for (let s = 1; s <= 10; s++) {
          const roomId = fl === 'G' ? `G${s}` : `${fl}-${s}`;
          let assignedGroup = blk.branches[s % blk.branches.length] || 'General';
          let roomType: FloorSectionRoom['roomType'] = s <= 3 ? 'Computer Lab' : 'Classroom';

          if (blk.id === 'cv-raman-block') {
            if (fl === 'G' || (fl === 'F1' && s <= 6)) {
              assignedGroup = 'LNCT Central Library (All Branches)';
              roomType = 'Central Library';
            } else if (fl === 'F2') {
              assignedGroup = s <= 5 ? '2nd Yr B.Tech AIDS' : '2nd Yr B.Tech AIML';
              roomType = s <= 2 ? 'Computer Lab' : 'Classroom';
            } else if (fl === 'F3') {
              assignedGroup = s <= 5 ? '3rd Yr B.Tech CSE-AIDS' : '3rd Yr B.Tech CSE-AIML';
              roomType = s <= 3 ? 'Computer Lab' : 'Classroom';
            } else {
              assignedGroup = s % 2 === 0 ? '3rd Yr CSE-AIML' : '2nd Yr AIDS/AIML';
            }
          } else if (blk.id === 'lncts-old' || blk.id === 'lncts-new') {
            if (fl === 'F2' || (fl === 'F3' && s <= 5)) {
              assignedGroup = 'CSE-Cyber Security (LNCT&S Exclusive)';
              roomType = s <= 4 ? 'Computer Lab' : 'Classroom';
            } else {
              assignedGroup = blk.branches[s % blk.branches.length];
            }
          } else if (blk.id === 'lncte-building') {
            assignedGroup = s <= 4 ? 'CSE-DS (Data Science)' : s <= 7 ? 'CSE-AIML' : 'CSE';
          } else if (blk.id === 'lncp-pharmacy') {
            roomType = s <= 5 ? 'Pharmacy Lab' : 'Classroom';
          } else if (blk.id === 'lnct-main') {
            if (fl === 'G') {
              assignedGroup = s <= 4 ? 'Mechanical / Electrical Workshop' : 'EC / EEE';
              roomType = s <= 5 ? 'Workshop/Lab' : 'Classroom';
            }
          }

          const cap = roomType === 'Central Library' ? 120 : roomType === 'Computer Lab' ? 45 : 65;
          const occ = Math.round(cap * (0.55 + ((s * 7 + fl.length * 3) % 35) / 100));

          rooms.push({
            roomId,
            blockId: blk.id,
            blockName: blk.name,
            floorCode: fl,
            sectionNumber: s,
            assignedGroup,
            roomType,
            capacity: cap,
            currentOccupancy: Math.min(cap, occ),
            tempC: Number((22.2 + ((s + fl.charCodeAt(0)) % 5) * 0.6).toFixed(1)),
            acOn: blk.relays.acOn,
            lightsOn: blk.relays.lightsOn,
            iotNodeId: `NODE-${blk.code}-${roomId}`
          });
        }
      }

      // Add Roof / Chhatt monitoring node
      rooms.push({
        roomId: 'ROOF-CHHATT',
        blockId: blk.id,
        blockName: blk.name,
        floorCode: 'Roof',
        sectionNumber: 1,
        assignedGroup: 'Rooftop Solar PV & HVAC Chiller Deck',
        roomType: 'Rooftop Chhatt',
        capacity: 10,
        currentOccupancy: 0,
        tempC: 34.5,
        acOn: false,
        lightsOn: false,
        iotNodeId: `NODE-${blk.code}-CHHATT`
      });
    } else {
      // 1-2 floor special blocks (Refftronix Drone Lab, Canteen, Substation, Gate)
      for (let s = 1; s <= blk.sectionsPerFloor; s++) {
        const roomId = `G${s}`;
        rooms.push({
          roomId,
          blockId: blk.id,
          blockName: blk.name,
          floorCode: 'G',
          sectionNumber: s,
          assignedGroup: blk.branches[0] || 'Facility',
          roomType: blk.id === 'refftronix-drone-lab' ? 'Drone Lab' : 'Canteen/Utility',
          capacity: blk.id === 'lnct-main-canteen' ? 140 : 25,
          currentOccupancy: blk.id === 'lnct-main-canteen' ? 105 : 12,
          tempC: 25.0,
          acOn: blk.relays.acOn,
          lightsOn: blk.relays.lightsOn,
          iotNodeId: `NODE-${blk.code}-${roomId}`
        });
      }
    }
  }
  return rooms;
}

export const LNCT_ALL_ROOM_SECTIONS: FloorSectionRoom[] = generateAllFloorSectionsDataset();

// RGPV University Academic Timetable, Practicals, Mid-Sems & Final Exams Dataset
export const LNCT_RGPV_TIMETABLE_DATA: RGPVTimetableRecord[] = [
  {
    id: 'RGPV-TT-01',
    branch: 'CSE-AIDS (3rd Year)',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'cv-raman-block',
    buildingName: 'Sir CV Raman Block',
    floorSections: 'F3-1 to F3-5',
    subjectCode: 'AD-501',
    subjectName: 'Machine Learning & Pattern Recognition',
    eventType: 'Theory Class',
    dayOrDate: 'Mon-Fri',
    timeSlot: '09:30 AM - 10:30 AM',
    expectedStudentLoad: 310,
    predictedPowerKw: 24.5
  },
  {
    id: 'RGPV-TT-02',
    branch: 'CSE-AIML (3rd Year)',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'cv-raman-block',
    buildingName: 'Sir CV Raman Block',
    floorSections: 'F3-6 to F3-10',
    subjectCode: 'AL-502',
    subjectName: 'Deep Learning & Neural Networks Lab',
    eventType: 'RGPV Practical',
    dayOrDate: 'Tue & Thu',
    timeSlot: '02:00 PM - 04:00 PM',
    expectedStudentLoad: 280,
    predictedPowerKw: 42.0
  },
  {
    id: 'RGPV-TT-03',
    branch: 'AIDS & AIML (2nd Year)',
    yearSem: '2nd Year / 3rd Sem',
    buildingId: 'cv-raman-block',
    buildingName: 'Sir CV Raman Block',
    floorSections: 'F2-1 to F2-10',
    subjectCode: 'AL-303',
    subjectName: 'Data Structures & Algorithms',
    eventType: 'Mid-Sem I',
    dayOrDate: '2026-10-12',
    timeSlot: '10:00 AM - 12:00 PM',
    expectedStudentLoad: 580,
    predictedPowerKw: 38.2
  },
  {
    id: 'RGPV-TT-04',
    branch: 'CSE-Cyber Security (LNCT&S Only)',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'lncts-new',
    buildingName: 'LNCT&S New Block',
    floorSections: 'F2-1 to F2-5',
    subjectCode: 'CY-501',
    subjectName: 'Cryptography, Network Security & Ethical Hacking',
    eventType: 'RGPV Practical',
    dayOrDate: '2026-11-22',
    timeSlot: '11:00 AM - 01:30 PM',
    expectedStudentLoad: 185,
    predictedPowerKw: 31.5
  },
  {
    id: 'RGPV-TT-05',
    branch: 'CSE-DS (Data Science)',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'lncte-building',
    buildingName: 'LNCTE Building',
    floorSections: 'G1 to G4 & F1-1 to F1-5',
    subjectCode: 'CD-502',
    subjectName: 'Big Data Analytics & Hadoop Ecosystem',
    eventType: 'RGPV Final Exam',
    dayOrDate: '2026-12-08',
    timeSlot: '10:00 AM - 01:00 PM',
    expectedStudentLoad: 420,
    predictedPowerKw: 29.8
  },
  {
    id: 'RGPV-TT-06',
    branch: 'EC & EC Advance',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'lnct-main',
    buildingName: 'LNCT Main Building',
    floorSections: 'F1-1 to F1-8',
    subjectCode: 'EC-501',
    subjectName: 'Microprocessors, Microcontrollers & Embedded Systems',
    eventType: 'RGPV Final Exam',
    dayOrDate: '2026-12-10',
    timeSlot: '10:00 AM - 01:00 PM',
    expectedStudentLoad: 360,
    predictedPowerKw: 34.0
  },
  {
    id: 'RGPV-TT-07',
    branch: 'EEE & Electrical',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'lnct-main',
    buildingName: 'LNCT Main Building',
    floorSections: 'G3 to G8',
    subjectCode: 'EE-502',
    subjectName: 'Power Electronics & Microgrid Drives Lab',
    eventType: 'RGPV Practical',
    dayOrDate: '2026-11-24',
    timeSlot: '01:30 PM - 04:00 PM',
    expectedStudentLoad: 210,
    predictedPowerKw: 48.6
  },
  {
    id: 'RGPV-TT-08',
    branch: 'Mechanical Engineering',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'lnct-main',
    buildingName: 'LNCT Main Building',
    floorSections: 'G1, G2 & F4-1 to F4-6',
    subjectCode: 'ME-501',
    subjectName: 'Internal Combustion Engines & Dynamics of Machines',
    eventType: 'Mid-Sem II',
    dayOrDate: '2026-11-16',
    timeSlot: '02:00 PM - 04:00 PM',
    expectedStudentLoad: 240,
    predictedPowerKw: 22.4
  },
  {
    id: 'RGPV-TT-09',
    branch: 'IT & CSE Practical Batch',
    yearSem: '2nd & 3rd Year',
    buildingId: 'charles-babbage-it',
    buildingName: 'IT Building (Charles Babbage Block)',
    floorSections: 'F2-1 to F2-10',
    subjectCode: 'CS-502',
    subjectName: 'Database Management Systems (DBMS) Viva & Lab',
    eventType: 'RGPV Practical',
    dayOrDate: '2026-11-25',
    timeSlot: '10:00 AM - 01:00 PM',
    expectedStudentLoad: 540,
    predictedPowerKw: 64.2
  },
  {
    id: 'RGPV-TT-10',
    branch: 'B.Pharm (RGPV Pharmacy)',
    yearSem: '3rd Year / 5th Sem',
    buildingId: 'lncp-pharmacy',
    buildingName: 'LNCP (Pharmacy)',
    floorSections: 'G1 to G6 & F1-1 to F1-5',
    subjectCode: 'BP-503T',
    subjectName: 'Pharmacology II & Medicinal Chemistry',
    eventType: 'RGPV Final Exam',
    dayOrDate: '2026-12-12',
    timeSlot: '10:00 AM - 01:00 PM',
    expectedStudentLoad: 300,
    predictedPowerKw: 26.8
  },
  {
    id: 'RGPV-TT-11',
    branch: 'UAV & Robotics Practical',
    yearSem: '3rd Year Minor Project',
    buildingId: 'refftronix-drone-lab',
    buildingName: 'Refftronix Drone Lab (Nr. CV Raman)',
    floorSections: 'G1 to G4',
    subjectCode: 'AL-506',
    subjectName: 'Autonomous Drone Flight & IoT Telemetry Minor Project',
    eventType: 'RGPV Practical',
    dayOrDate: 'Fri & Sat',
    timeSlot: '01:00 PM - 04:30 PM',
    expectedStudentLoad: 65,
    predictedPowerKw: 18.4
  }
];

// RGPV Syllabus Comparison (Previous Year vs Current) & Exam Paper Question Predictor
export const LNCT_RGPV_PAPER_PREDICTIONS: RGPVPaperPredictionRecord[] = [
  {
    id: 'PRED-AIML-501',
    branch: 'CSE-AIML & CSE-AIDS',
    buildingExclusiveNote: 'Sir CV Raman Block (2nd Yr & 3rd Yr) + LNCT Main / LNCTE',
    semester: '5th Sem (RGPV)',
    subjectCode: 'AL-501 / AD-501',
    subjectName: 'Deep Learning & Soft Computing / Machine Learning',
    rgpvPaperFormat: 'RGPV 70 Marks · 8 Questions (Attempt any 5, 14M each) · 3 Hours',
    unitNumber: 'Unit III & IV',
    unitTitle: 'CNN Architectures, Backpropagation, LSTM & Attention Mechanisms',
    prevYearSyllabusStatus: 'Modified Weightage',
    pastAppearances: 'Asked in RGPV Dec 2022, Dec 2023, Dec 2024, May 2025',
    predictedProbabilityPct: 92,
    predictedMarksOutOf70: 28,
    predictedQuestions: [
      {
        part: 'Part C (14M Long)',
        question: 'Derive the Backpropagation Through Time (BPTT) weight update equations and explain how LSTM forget/input gates solve vanishing gradients.',
        confidencePct: 94
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Compare ResNet skip connections vs VGG-16 pooling layers with parameter count calculation on a 224x224x3 input tensor.',
        confidencePct: 89
      },
      {
        part: 'Part A (2M Short)',
        question: 'Define Batch Normalization and Dropout regularization in deep neural networks.',
        confidencePct: 86
      }
    ],
    syllabusComparisonNotes: 'Compared to 2024 syllabus, Transformer Self-Attention moved into Unit IV replacing older Hopfield Network proofs (+14% weightage shift).'
  },
  {
    id: 'PRED-CY-501',
    branch: 'CSE-Cyber Security',
    buildingExclusiveNote: 'Exclusive to LNCT&S Old & New Blocks Only',
    semester: '5th Sem (RGPV)',
    subjectCode: 'CY-501',
    subjectName: 'Cryptography, Network Security & Cyber Forensics',
    rgpvPaperFormat: 'RGPV 70 Marks · 8 Questions (Attempt any 5, 14M each) · 3 Hours',
    unitNumber: 'Unit II & III',
    unitTitle: 'AES Key Expansion, RSA Modular Arithmetic, Diffie-Hellman & Zero-Trust Auth',
    prevYearSyllabusStatus: 'High-Frequency Repeat',
    pastAppearances: 'Asked in RGPV Dec 2021, Dec 2023, Dec 2024, Nov 2025',
    predictedProbabilityPct: 95,
    predictedMarksOutOf70: 28,
    predictedQuestions: [
      {
        part: 'Part C (14M Long)',
        question: 'Given primes p=17, q=11 and e=7, compute the RSA public/private key pair and encrypt/decrypt plaintext M=88 using modular exponentiation.',
        confidencePct: 96
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Illustrate the 4 transformations in an AES round (SubBytes, ShiftRows, MixColumns, AddRoundKey) and analyze avalanche effect.',
        confidencePct: 91
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Explain Man-in-the-Middle vulnerability in Diffie-Hellman Key Exchange and mitigation via X.509 Digital Certificates.',
        confidencePct: 88
      }
    ],
    syllabusComparisonNotes: 'Core RSA/AES numericals retained 100% from previous RGPV scheme; Post-Quantum Lattice intro added as 7-mark short note in Unit V.'
  },
  {
    id: 'PRED-CSE-502',
    branch: 'CSE & IT',
    buildingExclusiveNote: 'LNCT Main + Charles Babbage IT + LNCT&S + LNCTE',
    semester: '5th Sem (RGPV)',
    subjectCode: 'CS-502',
    subjectName: 'Database Management Systems (DBMS)',
    rgpvPaperFormat: 'RGPV 70 Marks · 8 Questions (Attempt any 5, 14M each) · 3 Hours',
    unitNumber: 'Unit III & IV',
    unitTitle: 'BCNF/3NF Normalization, B+ Tree Indexing & Two-Phase Locking (2PL)',
    prevYearSyllabusStatus: 'Retained (Core)',
    pastAppearances: 'Asked every alternate RGPV cycle (2021–2025)',
    predictedProbabilityPct: 94,
    predictedMarksOutOf70: 28,
    predictedQuestions: [
      {
        part: 'Part C (14M Long)',
        question: 'Test whether a given schedule is Conflict Serializable using Precedence Graph and demonstrate Strict 2PL deadlock prevention.',
        confidencePct: 95
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Decompose relation R(A,B,C,D,E) with FDs into lossless-join, dependency-preserving BCNF and 3NF.',
        confidencePct: 92
      }
    ],
    syllabusComparisonNotes: 'Zero syllabus deletion vs previous year; NoSQL CAP theorem comparison added to Unit V.'
  },
  {
    id: 'PRED-DS-502',
    branch: 'CSE-DS (Data Science)',
    buildingExclusiveNote: 'LNCTE Building (Data Science Wing)',
    semester: '5th Sem (RGPV)',
    subjectCode: 'CD-502',
    subjectName: 'Big Data Analytics & Distributed Processing',
    rgpvPaperFormat: 'RGPV 70 Marks · 8 Questions (Attempt any 5, 14M each) · 3 Hours',
    unitNumber: 'Unit II & IV',
    unitTitle: 'HDFS NameNode Architecture, MapReduce Shuffle & Apache Spark RDDs',
    prevYearSyllabusStatus: 'Newly Added 2026',
    pastAppearances: 'Spark Streaming expanded from 2024 syllabus',
    predictedProbabilityPct: 89,
    predictedMarksOutOf70: 21,
    predictedQuestions: [
      {
        part: 'Part C (14M Long)',
        question: 'Compare Hadoop MapReduce disk I/O bottlenecks with Apache Spark in-memory DAG execution and RDD lineage fault tolerance.',
        confidencePct: 90
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Write a MapReduce word/sensor-anomaly aggregation pseudo-code explaining Partitioner and Combiner phases.',
        confidencePct: 87
      }
    ],
    syllabusComparisonNotes: 'Pig/Hive reduced from Unit IV; PySpark Structured Streaming promoted to primary 14-mark topic.'
  },
  {
    id: 'PRED-EC-501',
    branch: 'EC, EC Advance & EEE',
    buildingExclusiveNote: 'LNCT Main Building + LNCT&S Old Block',
    semester: '5th Sem (RGPV)',
    subjectCode: 'EC-501 / EE-502',
    subjectName: 'Microprocessors, Embedded Systems & Power Electronics',
    rgpvPaperFormat: 'RGPV 70 Marks · 8 Questions (Attempt any 5, 14M each) · 3 Hours',
    unitNumber: 'Unit I & III',
    unitTitle: '8086 Pin Diagram, Interrupt Vector Table, ARM Cortex-M & PWM Inverters',
    prevYearSyllabusStatus: 'Modified Weightage',
    pastAppearances: 'Asked in RGPV Dec 2022, May 2024, Dec 2024',
    predictedProbabilityPct: 90,
    predictedMarksOutOf70: 28,
    predictedQuestions: [
      {
        part: 'Part C (14M Long)',
        question: 'Draw 8086 Maximum Mode timing diagram and write an assembly routine to interface 8255 PPI with 7-segment display.',
        confidencePct: 91
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Analyze 3-Phase Voltage Source Inverter (180-degree conduction mode) line-to-line output harmonic THD.',
        confidencePct: 88
      }
    ],
    syllabusComparisonNotes: '8085 basics trimmed; ARM / ESP32 RTOS interrupt latency added in EC Advance Unit V.'
  },
  {
    id: 'PRED-ME-501',
    branch: 'Mechanical Engineering',
    buildingExclusiveNote: 'LNCT Main Building (Ground & Upper Floors)',
    semester: '5th Sem (RGPV)',
    subjectCode: 'ME-501',
    subjectName: 'Internal Combustion Engines & Dynamics of Machines',
    rgpvPaperFormat: 'RGPV 70 Marks · 8 Questions (Attempt any 5, 14M each) · 3 Hours',
    unitNumber: 'Unit II & IV',
    unitTitle: 'Otto/Diesel Knocking Analysis, Gyroscopic Couple & Governor Sensitivity',
    prevYearSyllabusStatus: 'Retained (Core)',
    pastAppearances: 'Asked in RGPV Dec 2022, Dec 2023, May 2025',
    predictedProbabilityPct: 91,
    predictedMarksOutOf70: 28,
    predictedQuestions: [
      {
        part: 'Part C (14M Long)',
        question: 'Derive Porter/Hartnell Governor equilibrium speed equation and compute controlling force curve stability.',
        confidencePct: 93
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Compare SI vs CI engine detonation/knocking parameters and explain MPFI + CRDi injection timing.',
        confidencePct: 89
      }
    ],
    syllabusComparisonNotes: 'BS-VI emission norms & EV hybrid powertrain comparative note added to Unit V.'
  },
  {
    id: 'PRED-PY-503',
    branch: 'B.Pharm (Pharmacy)',
    buildingExclusiveNote: 'LNCP (Lakshmi Narain College of Pharmacy)',
    semester: '5th Sem (RGPV / PCI)',
    subjectCode: 'BP-503T',
    subjectName: 'Pharmacology II & Bioassays',
    rgpvPaperFormat: 'PCI/RGPV 75 Marks · Long Essays (2x10M) + Short Notes (7x5M) + MCQs (20M)',
    unitNumber: 'Unit I & II',
    unitTitle: 'Anti-hypertensives, Anti-arrhythmics, Diuretics & Autocoids',
    prevYearSyllabusStatus: 'Retained (Core)',
    pastAppearances: 'Asked in 2022, 2023, 2024, 2025',
    predictedProbabilityPct: 93,
    predictedMarksOutOf70: 30,
    predictedQuestions: [
      {
        part: 'Part C (14M Long)',
        question: 'Classify Anti-hypertensive drugs with MOA, adverse effects, and therapeutic uses of ACE Inhibitors & Calcium Channel Blockers.',
        confidencePct: 95
      },
      {
        part: 'Part B (7M Analytical)',
        question: 'Explain the pharmacology of Loop Diuretics (Furosemide) on the ascending limb of Loop of Henle.',
        confidencePct: 90
      }
    ],
    syllabusComparisonNotes: 'Follows unified PCI/RGPV scheme; high consistency with 2023–2025 end-sem question banks.'
  }
];

export function calculateHaversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

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
  const walkMin = Number((walking / 80).toFixed(1));
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

export const LNCT_DISTANCE_MATRIX: BuildingDistanceEntry[] = (() => {
  const list: BuildingDistanceEntry[] = [];
  for (let i = 0; i < LNCT_CAMPUS_BLOCKS.length; i++) {
    for (let j = i + 1; j < LNCT_CAMPUS_BLOCKS.length; j++) {
      list.push(getInterBuildingDistance(LNCT_CAMPUS_BLOCKS[i].id, LNCT_CAMPUS_BLOCKS[j].id));
    }
  }
  return list;
})();

export const LNCT_SPATIAL_BLUEPRINT_DATA = LNCT_CAMPUS_BLOCKS.map(b => ({
  block_id: b.id,
  code: b.code,
  building_name: b.name,
  branches_hosted: b.branches.join(' | '),
  floors: b.floors,
  sections_per_floor: b.sectionsPerFloor,
  has_roof_chhatt: b.hasRoofChhatt,
  latitude: b.gps.lat,
  longitude: b.gps.lng,
  built_up_area_sqm: b.areaSqm,
  max_capacity: b.maxCapacity,
  installed_iot_nodes: b.activeSensors,
  distance_from_main_gate_m: getInterBuildingDistance('raisen-main-gate', b.id).walkingPathMeters,
  distance_from_cv_raman_library_m: getInterBuildingDistance('cv-raman-block', b.id).walkingPathMeters
}));

// 30-day timetable-driven IoT dataset using exact LNCT Raisen Road buildings, floors & G1..F5-10 sections
export function generate30DayTimetableDataset(days: number = 30): RoomScheduleIoTRecord[] {
  const sampleSections = [
    { block: 'LNCT_Main_Building', floor: 'G', section: 'G4', branch: 'EC / Mechanical' },
    { block: 'LNCT_Main_Building', floor: 'F3', section: 'F3-2', branch: 'CSE / EEE' },
    { block: 'Sir_CV_Raman_Block', floor: 'G', section: 'G1_Library', branch: 'Central Library' },
    { block: 'Sir_CV_Raman_Block', floor: 'F2', section: 'F2-4', branch: '2nd Yr AIDS & AIML' },
    { block: 'Sir_CV_Raman_Block', floor: 'F3', section: 'F3-7', branch: '3rd Yr CSE-AIDS & AIML' },
    { block: 'Refftronix_Drone_Lab', floor: 'G', section: 'G1', branch: 'UAV Drone R&D' },
    { block: 'Charles_Babbage_IT', floor: 'F2', section: 'F2-5', branch: 'IT & RGPV Lab' },
    { block: 'LNCTS_Old_Block', floor: 'F2', section: 'F2-3', branch: 'CSE-Cyber Security (LNCT&S)' },
    { block: 'LNCTS_New_Block', floor: 'F1', section: 'F1-6', branch: 'CSE-Cyber Security / AIML' },
    { block: 'LNCTE_Building', floor: 'F1', section: 'F1-8', branch: 'CSE-DS / CSE-AIML' },
    { block: 'LNCTU_Building', floor: 'F2', section: 'F2-2', branch: 'LNCT University' },
    { block: 'LNCP_Pharmacy', floor: 'G', section: 'G2', branch: 'B.Pharm Pharmaceutics' }
  ];

  const records: RoomScheduleIoTRecord[] = [];
  const start = new Date('2026-10-15T00:00:00Z').getTime();
  const totalHours = days * 24;

  let seed = 4219;
  const nextRand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let h = 0; h < totalHours; h++) {
    const dt = new Date(start + h * 3600 * 1000);
    const hour = dt.getUTCHours();
    const dayOfWeek = dt.getUTCDay();
    const isCollegeHour = dayOfWeek !== 0 && hour >= 9 && hour <= 17;

    for (const s of sampleSections) {
      let occupancy = 0;
      let temp = 21.5;
      let light = 15;
      let acStatus: 0 | 1 = 0;

      if (isCollegeHour) {
        const hasClass = nextRand() > 0.14;
        occupancy = hasClass ? Math.floor(28 + nextRand() * 40) : 0;
        temp = Number((22.5 + nextRand() * 6.5).toFixed(1));
        light = occupancy > 0 ? Math.floor(350 + nextRand() * 170) : (nextRand() < 0.25 ? 360 : 40);
        acStatus = occupancy > 15 || temp > 26.0 ? 1 : (nextRand() < 0.12 ? 1 : 0);
      } else {
        occupancy = 0;
        temp = Number((19.0 + nextRand() * 4.5).toFixed(1));
        light = nextRand() < 0.04 ? 320 : Math.floor(nextRand() * 15);
        acStatus = nextRand() < 0.06 ? 1 : 0;
      }

      const wastageFlag: 0 | 1 = occupancy === 0 && (acStatus === 1 || light > 200) ? 1 : 0;
      let powerKwh = 0.25;
      if (acStatus === 1) powerKwh += 1.9 + nextRand() * 1.1;
      if (light > 200) powerKwh += 0.28;
      if (occupancy > 0 && (s.block.includes('IT') || s.block.includes('CV_Raman') || s.block.includes('LNCTS'))) {
        powerKwh += occupancy * 0.05;
      }

      records.push({
        Timestamp: dt.toISOString().replace('T', ' ').slice(0, 19),
        Block_Name: s.block,
        Floor: s.floor,
        Section_Room: s.section,
        Branch_Year: s.branch,
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
  return records;
}

export const LNCT_CAMPUS_ASSETS: CampusAsset[] = [
  {
    id: 'AST-HVAC-CVR01',
    name: 'Sir CV Raman Block Central Library Chiller 1',
    blockId: 'cv-raman-block',
    location: 'CV Raman Rooftop Chhatt HVAC Plant',
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
    iotSensorNode: 'NODE-CVR-CHHATT-01 (ESP32 + MPU6050 + PT100)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-08-14', action: 'Refrigerant R134a top-up & oil filter replacement', technician: 'M. P. Cooling Systems' },
      { date: '2026-02-10', action: 'Bearing vibration FFT spectral calibration', technician: 'LNCT Mechanical Dept' }
    ]
  },
  {
    id: 'AST-ELEC-TR01',
    name: 'Primary Step-Down Transformer T-01 (11kV / 415V)',
    blockId: 'substation-solar',
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
    id: 'AST-SOLAR-MAIN01',
    name: 'LNCT Main Building Chhatt Solar Inverter (100 kW)',
    blockId: 'lnct-main',
    location: 'LNCT Main Building 6th Floor Rooftop Chhatt',
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
    iotSensorNode: 'NODE-LNCTM-CHHATT-INV (RS485 Modbus Gateway)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-09-02', action: 'Firmware upgrade & DC isolator contact check', technician: 'CleanMax Solar AMC' }
    ]
  },
  {
    id: 'AST-PUMP-HYD01',
    name: 'Campus Central Overhead Booster Water Pump 1',
    blockId: 'substation-solar',
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
    id: 'AST-COMP-IT01',
    name: 'Charles Babbage IT Block Central Server & RGPV Lab Rack',
    blockId: 'charles-babbage-it',
    location: 'IT Building Ground Floor G1 Data Center',
    category: 'computing',
    makeModel: 'Dell PowerEdge R750xa + Cisco Core Switch',
    ratedCapacity: '18 kW Continuous / Dual Redundant UPS',
    installedYear: 2023,
    lastServiceDate: '2026-05-19',
    nextScheduledService: '2026-11-19',
    healthIndex: 96,
    vibrationRms: 0.28,
    vibrationThreshold: 1.00,
    bearingTempC: 36.8,
    tempThreshold: 55.0,
    currentDrawAmps: 32.4,
    harmonicThdPct: 1.4,
    predictedRulDays: 340,
    failureRisk: 'low',
    iotSensorNode: 'NODE-CBB-DC-01 (SNMP v3 & IPMI Agent)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-05-19', action: 'Precision cooling calibration & UPS battery load test', technician: 'Dell Enterprise Support' }
    ]
  },
  {
    id: 'AST-LAB-PHARM01',
    name: 'LNCP Pharmacy Formulation Cold Storage & Fume Exhaust',
    blockId: 'lncp-pharmacy',
    location: 'LNCP Building, Floor F1 Pharmaceutics Bay',
    category: 'hvac',
    makeModel: 'Blue Star Pharma Walk-In Cold Chamber + Scrubber',
    ratedCapacity: '18 TR Precision Temp (2°C to 8°C Chamber)',
    installedYear: 2021,
    lastServiceDate: '2026-06-12',
    nextScheduledService: '2026-12-12',
    healthIndex: 76,
    vibrationRms: 2.15,
    vibrationThreshold: 2.60,
    bearingTempC: 60.4,
    tempThreshold: 68.0,
    currentDrawAmps: 24.2,
    harmonicThdPct: 3.5,
    predictedRulDays: 68,
    failureRisk: 'moderate',
    iotSensorNode: 'NODE-LNCP-F1-COLD (PT100 + Relay Monitor)',
    telemetryStatus: 'warning',
    maintenanceHistory: [
      { date: '2026-06-12', action: 'HEPA exhaust filter check & thermal sensor calibration', technician: 'LNCP Technical Staff' }
    ]
  },
  {
    id: 'AST-DRONE-RIG01',
    name: 'Refftronix UAV LiPo Charging & Thrust Bench',
    blockId: 'refftronix-drone-lab',
    location: 'Refftronix Drone Lab (Near Sir CV Raman Block)',
    category: 'electrical',
    makeModel: 'Smart 6S LiPo Multi-Bay Thermal Monitored Station',
    ratedCapacity: '8.5 kW Regulated DC Bench',
    installedYear: 2024,
    lastServiceDate: '2026-09-10',
    nextScheduledService: '2027-01-10',
    healthIndex: 93,
    vibrationRms: 0.95,
    vibrationThreshold: 2.20,
    bearingTempC: 39.2,
    tempThreshold: 55.0,
    currentDrawAmps: 18.5,
    harmonicThdPct: 2.1,
    predictedRulDays: 310,
    failureRisk: 'low',
    iotSensorNode: 'NODE-RFT-DRN-01 (IR Thermal + Current Sensor)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-09-10', action: 'Thrust load-cell calibration & thermal cutoff verification', technician: 'Refftronix Lab Team' }
    ]
  },
  {
    id: 'AST-CYBER-SOC01',
    name: 'LNCT&S Cyber Security Exclusive SOC Server Cluster',
    blockId: 'lncts-new',
    location: 'LNCT&S New Block, Floor F2 Section F2-2',
    category: 'computing',
    makeModel: 'HPE ProLiant DL380 Security Range Cluster',
    ratedCapacity: '10 kW Continuous Power',
    installedYear: 2023,
    lastServiceDate: '2026-08-05',
    nextScheduledService: '2027-02-05',
    healthIndex: 95,
    vibrationRms: 0.31,
    vibrationThreshold: 1.00,
    bearingTempC: 37.9,
    tempThreshold: 55.0,
    currentDrawAmps: 21.8,
    harmonicThdPct: 1.6,
    predictedRulDays: 325,
    failureRisk: 'low',
    iotSensorNode: 'NODE-LNCTS-SOC-01 (SNMP + PZEM-004T)',
    telemetryStatus: 'online',
    maintenanceHistory: [
      { date: '2026-08-05', action: 'Dedicated VLAN firewall & cooling blower inspection', technician: 'LNCT&S CSE Cyber Team' }
    ]
  }
];

export const LNCT_STUDENT_DENSITY_ZONES: StudentDensityZone[] = [
  {
    zoneId: 'ZONE-CVR-LIB',
    zoneName: 'LNCT Central Library (Sir CV Raman G & F1)',
    blockId: 'cv-raman-block',
    floor: 'G & F1 (G1-G10)',
    areaSqm: 1200,
    maxCapacity: 480,
    currentOccupancy: 385,
    densityPerSqm: 0.32,
    inflowRatePerHour: 62,
    outflowRatePerHour: 44,
    wifiProbeCount: 418,
    tofSensorCount: 4,
    predictedDensity1h: 0.38,
    predictedDensity2h: 0.42,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 23.0,
    hvacSavingsKw: 3.4
  },
  {
    zoneId: 'ZONE-CVR-F3',
    zoneName: '3rd Yr CSE-AIDS & AIML Wing (CV Raman F3-1..F3-10)',
    blockId: 'cv-raman-block',
    floor: 'Floor F3',
    areaSqm: 950,
    maxCapacity: 620,
    currentOccupancy: 540,
    densityPerSqm: 0.57,
    inflowRatePerHour: 95,
    outflowRatePerHour: 80,
    wifiProbeCount: 582,
    tofSensorCount: 4,
    predictedDensity1h: 0.59,
    predictedDensity2h: 0.14,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 22.5,
    hvacSavingsKw: 5.2
  },
  {
    zoneId: 'ZONE-CVR-F2',
    zoneName: '2nd Yr AIDS & AIML Wing (CV Raman F2-1..F2-10)',
    blockId: 'cv-raman-block',
    floor: 'Floor F2',
    areaSqm: 950,
    maxCapacity: 600,
    currentOccupancy: 495,
    densityPerSqm: 0.52,
    inflowRatePerHour: 88,
    outflowRatePerHour: 72,
    wifiProbeCount: 530,
    tofSensorCount: 4,
    predictedDensity1h: 0.50,
    predictedDensity2h: 0.18,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 23.0,
    hvacSavingsKw: 4.1
  },
  {
    zoneId: 'ZONE-MAIN-ECE-MECH',
    zoneName: 'LNCT Main EC / EC Adv / EEE / Mech (G1..F3)',
    blockId: 'lnct-main',
    floor: 'G to F3',
    areaSqm: 1600,
    maxCapacity: 900,
    currentOccupancy: 640,
    densityPerSqm: 0.40,
    inflowRatePerHour: 110,
    outflowRatePerHour: 95,
    wifiProbeCount: 685,
    tofSensorCount: 6,
    predictedDensity1h: 0.42,
    predictedDensity2h: 0.22,
    congestionLevel: 'moderate',
    hvacSetpointOptimalC: 23.5,
    hvacSavingsKw: 6.4
  },
  {
    zoneId: 'ZONE-LNCTS-CYBER',
    zoneName: 'LNCT&S Cyber Security Exclusive Floor (F2-1..F2-10)',
    blockId: 'lncts-new',
    floor: 'Floor F2',
    areaSqm: 680,
    maxCapacity: 400,
    currentOccupancy: 315,
    densityPerSqm: 0.46,
    inflowRatePerHour: 52,
    outflowRatePerHour: 40,
    wifiProbeCount: 342,
    tofSensorCount: 3,
    predictedDensity1h: 0.48,
    predictedDensity2h: 0.16,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 23.0,
    hvacSavingsKw: 2.9
  },
  {
    zoneId: 'ZONE-LNCTE-DS',
    zoneName: 'LNCTE CSE-DS & CSE-AIML Labs (F1-1..F2-10)',
    blockId: 'lncte-building',
    floor: 'Floors F1-F2',
    areaSqm: 820,
    maxCapacity: 500,
    currentOccupancy: 350,
    densityPerSqm: 0.43,
    inflowRatePerHour: 60,
    outflowRatePerHour: 48,
    wifiProbeCount: 376,
    tofSensorCount: 3,
    predictedDensity1h: 0.40,
    predictedDensity2h: 0.15,
    congestionLevel: 'moderate',
    hvacSetpointOptimalC: 23.5,
    hvacSavingsKw: 3.1
  },
  {
    zoneId: 'ZONE-CANTEEN-MAIN',
    zoneName: 'LNCT Main Canteen & Student Plaza',
    blockId: 'lnct-main-canteen',
    floor: 'Ground & First',
    areaSqm: 900,
    maxCapacity: 550,
    currentOccupancy: 410,
    densityPerSqm: 0.46,
    inflowRatePerHour: 185,
    outflowRatePerHour: 160,
    wifiProbeCount: 452,
    tofSensorCount: 4,
    predictedDensity1h: 0.56,
    predictedDensity2h: 0.18,
    congestionLevel: 'high',
    hvacSetpointOptimalC: 24.0,
    hvacSavingsKw: 2.2
  },
  {
    zoneId: 'ZONE-RFT-DRONE',
    zoneName: 'Refftronix Drone Lab (Nr. CV Raman)',
    blockId: 'refftronix-drone-lab',
    floor: 'Ground',
    areaSqm: 320,
    maxCapacity: 80,
    currentOccupancy: 46,
    densityPerSqm: 0.14,
    inflowRatePerHour: 18,
    outflowRatePerHour: 12,
    wifiProbeCount: 51,
    tofSensorCount: 2,
    predictedDensity1h: 0.18,
    predictedDensity2h: 0.10,
    congestionLevel: 'low',
    hvacSetpointOptimalC: 24.5,
    hvacSavingsKw: 1.1
  }
];

export const LNCT_ENERGY_TIMESERIES_24H: EnergyReading[] = [
  { timestamp: '2026-11-14T00:00:00Z', timeSlot: '00:00', gridImportKw: 110.2, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 110.2, apparentPowerKva: 122.4, powerFactor: 0.90, solarIrradianceWm2: 0, gridFrequencyHz: 50.02, co2SavedKg: 0, costInr: 936, specificEnergyKwhM2: 0.0016 },
  { timestamp: '2026-11-14T02:00:00Z', timeSlot: '02:00', gridImportKw: 96.5, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 96.5, apparentPowerKva: 106.1, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.04, co2SavedKg: 0, costInr: 820, specificEnergyKwhM2: 0.0014 },
  { timestamp: '2026-11-14T04:00:00Z', timeSlot: '04:00', gridImportKw: 104.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 104.0, apparentPowerKva: 114.2, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 49.98, co2SavedKg: 0, costInr: 884, specificEnergyKwhM2: 0.0015 },
  { timestamp: '2026-11-14T06:00:00Z', timeSlot: '06:00', gridImportKw: 138.4, solarGenerationKw: 12.5, dieselGensetKw: 0.0, totalDemandKw: 150.9, apparentPowerKva: 164.0, powerFactor: 0.92, solarIrradianceWm2: 65, gridFrequencyHz: 50.01, co2SavedKg: 10.2, costInr: 1176, specificEnergyKwhM2: 0.0022 },
  { timestamp: '2026-11-14T08:00:00Z', timeSlot: '08:00', gridImportKw: 245.0, solarGenerationKw: 118.4, dieselGensetKw: 0.0, totalDemandKw: 363.4, apparentPowerKva: 395.0, powerFactor: 0.92, solarIrradianceWm2: 320, gridFrequencyHz: 49.95, co2SavedKg: 97.1, costInr: 2082, specificEnergyKwhM2: 0.0053 },
  { timestamp: '2026-11-14T09:30:00Z', timeSlot: '09:30', gridImportKw: 390.8, solarGenerationKw: 265.0, dieselGensetKw: 0.0, totalDemandKw: 655.8, apparentPowerKva: 705.1, powerFactor: 0.93, solarIrradianceWm2: 610, gridFrequencyHz: 50.00, co2SavedKg: 217.3, costInr: 3321, specificEnergyKwhM2: 0.0084 },
  { timestamp: '2026-11-14T11:00:00Z', timeSlot: '11:00', gridImportKw: 485.2, solarGenerationKw: 420.5, dieselGensetKw: 0.0, totalDemandKw: 905.7, apparentPowerKva: 963.5, powerFactor: 0.94, solarIrradianceWm2: 890, gridFrequencyHz: 49.96, co2SavedKg: 344.8, costInr: 4124, specificEnergyKwhM2: 0.0103 },
  { timestamp: '2026-11-14T12:30:00Z', timeSlot: '12:30', gridImportKw: 442.0, solarGenerationKw: 492.0, dieselGensetKw: 0.0, totalDemandKw: 934.0, apparentPowerKva: 983.1, powerFactor: 0.95, solarIrradianceWm2: 960, gridFrequencyHz: 50.01, co2SavedKg: 403.4, costInr: 3757, specificEnergyKwhM2: 0.0106 },
  { timestamp: '2026-11-14T14:00:00Z', timeSlot: '14:00', gridImportKw: 460.5, solarGenerationKw: 445.0, dieselGensetKw: 0.0, totalDemandKw: 905.5, apparentPowerKva: 953.1, powerFactor: 0.95, solarIrradianceWm2: 850, gridFrequencyHz: 49.99, co2SavedKg: 364.9, costInr: 3914, specificEnergyKwhM2: 0.0103 },
  { timestamp: '2026-11-14T15:30:00Z', timeSlot: '15:30', gridImportKw: 498.0, solarGenerationKw: 280.0, dieselGensetKw: 0.0, totalDemandKw: 778.0, apparentPowerKva: 827.6, powerFactor: 0.94, solarIrradianceWm2: 520, gridFrequencyHz: 49.97, co2SavedKg: 229.6, costInr: 4233, specificEnergyKwhM2: 0.0092 },
  { timestamp: '2026-11-14T17:00:00Z', timeSlot: '17:00', gridImportKw: 382.4, solarGenerationKw: 85.0, dieselGensetKw: 0.0, totalDemandKw: 467.4, apparentPowerKva: 508.0, powerFactor: 0.92, solarIrradianceWm2: 140, gridFrequencyHz: 49.95, co2SavedKg: 69.7, costInr: 3250, specificEnergyKwhM2: 0.0068 },
  { timestamp: '2026-11-14T18:30:00Z', timeSlot: '18:30', gridImportKw: 285.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 285.0, apparentPowerKva: 313.1, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.02, co2SavedKg: 0, costInr: 2422, specificEnergyKwhM2: 0.0046 },
  { timestamp: '2026-11-14T20:00:00Z', timeSlot: '20:00', gridImportKw: 212.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 212.0, apparentPowerKva: 233.0, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.00, co2SavedKg: 0, costInr: 1802, specificEnergyKwhM2: 0.0035 },
  { timestamp: '2026-11-14T22:00:00Z', timeSlot: '22:00', gridImportKw: 148.0, solarGenerationKw: 0.0, dieselGensetKw: 0.0, totalDemandKw: 148.0, apparentPowerKva: 162.6, powerFactor: 0.91, solarIrradianceWm2: 0, gridFrequencyHz: 50.03, co2SavedKg: 0, costInr: 1258, specificEnergyKwhM2: 0.0025 }
];

export const LNCT_SAMPLE_IOT_TELEMETRY: IoTTelemetryRecord[] = [
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-CVR-F3-2', blockId: 'cv-raman-block', blockName: 'Sir CV Raman Block', zone: 'F3-2 (3rd Yr CSE-AIDS)', floor: 'F3', tempCelsius: 23.1, humidityRh: 48.0, co2Ppm: 745, acousticDb: 58.2, ambientLux: 440, activePowerKw: 12.4, powerFactor: 0.95, pirCount: 48, wifiProbeCount: 64, vibrationRms: 0.18, batteryPct: 100, rssiDbm: -52 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-CVR-G1-LIB', blockId: 'cv-raman-block', blockName: 'Sir CV Raman Block', zone: 'G1 Central Library', floor: 'G', tempCelsius: 22.4, humidityRh: 46.2, co2Ppm: 620, acousticDb: 36.4, ambientLux: 490, activePowerKw: 18.6, powerFactor: 0.96, pirCount: 84, wifiProbeCount: 312, vibrationRms: 0.11, batteryPct: 100, rssiDbm: -48 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-LNCTM-F1-4', blockId: 'lnct-main', blockName: 'LNCT Main Building', zone: 'F1-4 (EC Advance Lab)', floor: 'F1', tempCelsius: 24.2, humidityRh: 49.5, co2Ppm: 680, acousticDb: 54.0, ambientLux: 460, activePowerKw: 16.8, powerFactor: 0.94, pirCount: 36, wifiProbeCount: 44, vibrationRms: 0.24, batteryPct: 99, rssiDbm: -55 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-LNCTS-F2-3', blockId: 'lncts-new', blockName: 'LNCT&S New Block', zone: 'F2-3 (CSE-Cyber Security)', floor: 'F2', tempCelsius: 22.9, humidityRh: 47.1, co2Ppm: 710, acousticDb: 52.8, ambientLux: 430, activePowerKw: 14.2, powerFactor: 0.95, pirCount: 42, wifiProbeCount: 58, vibrationRms: 0.16, batteryPct: 100, rssiDbm: -51 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-LNCTE-F1-7', blockId: 'lncte-building', blockName: 'LNCTE Building', zone: 'F1-7 (CSE-DS Analytics)', floor: 'F1', tempCelsius: 23.6, humidityRh: 48.8, co2Ppm: 690, acousticDb: 55.1, ambientLux: 450, activePowerKw: 15.1, powerFactor: 0.94, pirCount: 39, wifiProbeCount: 52, vibrationRms: 0.19, batteryPct: 98, rssiDbm: -56 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-RFT-G1', blockId: 'refftronix-drone-lab', blockName: 'Refftronix Drone Lab', zone: 'G1 Flight Cage', floor: 'G', tempCelsius: 24.8, humidityRh: 45.0, co2Ppm: 510, acousticDb: 74.2, ambientLux: 520, activePowerKw: 9.4, powerFactor: 0.92, pirCount: 16, wifiProbeCount: 22, vibrationRms: 1.12, batteryPct: 100, rssiDbm: -49 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-CBB-G1-DC', blockId: 'charles-babbage-it', blockName: 'Charles Babbage IT', zone: 'G1 RGPV Practical Center', floor: 'G', tempCelsius: 21.8, humidityRh: 44.0, co2Ppm: 660, acousticDb: 59.5, ambientLux: 480, activePowerKw: 28.4, powerFactor: 0.97, pirCount: 56, wifiProbeCount: 72, vibrationRms: 0.25, batteryPct: 100, rssiDbm: -50 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-LNCP-F1-2', blockId: 'lncp-pharmacy', blockName: 'LNCP Pharmacy', zone: 'F1-2 Formulation Lab', floor: 'F1', tempCelsius: 22.0, humidityRh: 42.5, co2Ppm: 540, acousticDb: 48.9, ambientLux: 540, activePowerKw: 11.8, powerFactor: 0.91, pirCount: 28, wifiProbeCount: 34, vibrationRms: 0.68, batteryPct: 97, rssiDbm: -59 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-CANT-G1', blockId: 'lnct-main-canteen', blockName: 'LNCT Main Canteen', zone: 'G1 Dining Hall', floor: 'G', tempCelsius: 26.8, humidityRh: 59.0, co2Ppm: 810, acousticDb: 74.0, ambientLux: 390, activePowerKw: 34.5, powerFactor: 0.92, pirCount: 140, wifiProbeCount: 390, vibrationRms: 0.30, batteryPct: 95, rssiDbm: -53 },
  { timestamp: '2026-11-14T10:15:00Z', nodeId: 'NODE-SUB-TR1', blockId: 'substation-solar', blockName: 'Central Substation', zone: 'Transformer T-01', floor: 'G', tempCelsius: 62.8, humidityRh: 38.0, co2Ppm: 455, acousticDb: 68.9, ambientLux: 820, activePowerKw: 580.4, powerFactor: 0.94, pirCount: 2, wifiProbeCount: 4, vibrationRms: 2.35, batteryPct: 100, rssiDbm: -64 }
];

export const LNCT_DIGITAL_TWIN_SCENARIOS: DigitalTwinScenario[] = [
  {
    id: 'nominal-weekday',
    title: 'Nominal RGPV College Day (Baseline)',
    description: 'Regular classes across LNCT Main, CV Raman (2nd/3rd Yr AIDS & AIML + Library), LNCT&S (CSE-Cyber Security), LNCTE (CSE-DS), and LNCP.',
    badge: 'Baseline Mode',
    impactMetrics: [
      { label: 'Campus Total Demand', value: '905 kW', change: 'Normal' },
      { label: 'Rooftop Chhatt Solar', value: '445 kW (49%)', change: 'Optimal' },
      { label: 'Student Occupancy', value: '7,200 On-Campus', change: 'Nominal' }
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
    id: 'rgpv-final-exams',
    title: 'RGPV End-Sem Theory & Practical Exam Week',
    description: 'RGPV Final Exams + Practicals active simultaneously. High occupancy in CV Raman, LNCT Main, LNCT&S, LNCTE & Charles Babbage IT practical centers.',
    badge: 'RGPV Exam Rush',
    impactMetrics: [
      { label: 'Exam & Lab Occupancy', value: '9,450 Students', change: '+31%' },
      { label: 'IT / Lab PC Power', value: '1,120 kW Peak', change: '+24%' },
      { label: 'Canteen Break Surge', value: '540 / 550 (98%)', change: 'Peak Rush' }
    ],
    simulationAdjustments: {
      densityMultiplier: 1.35,
      solarMultiplier: 1.0,
      gridAvailable: true,
      dgActive: false,
      ambientTempC: 27.5
    }
  },
  {
    id: 'bhopal-heatwave-43c',
    title: 'Bhopal May Mid-Sem Heatwave (43°C Ambient)',
    description: 'Extreme Raisen Road summer during RGPV Mid-Sem II. Rooftop Chhatt solar panels experience -14% thermal derating while all 6-floor HVAC chillers peak.',
    badge: 'Thermal Stress',
    impactMetrics: [
      { label: 'Ambient Temperature', value: '43.2°C', change: '+12.2°C' },
      { label: 'Solar PV Derating', value: '-14.8% Loss', change: 'Derated' },
      { label: 'Transformer T-01', value: '74.5°C (Alert)', change: '+11.7°C' }
    ],
    simulationAdjustments: {
      densityMultiplier: 1.1,
      solarMultiplier: 0.85,
      gridAvailable: true,
      dgActive: false,
      ambientTempC: 43.2
    }
  },
  {
    id: 'grid-blackout-dg-transfer',
    title: 'Raisen Road 11kV Grid Trip & DG Islanding',
    description: 'Utility grid feeder fault on Raisen Road. Automatic Transfer Switch (ATS) brings 500kVA DG online and sheds non-essential AC on empty sections.',
    badge: 'Island Microgrid',
    impactMetrics: [
      { label: 'Grid Feed Voltage', value: '0.0 kV (Tripped)', change: 'Failed' },
      { label: 'Standby DG Genset', value: '380 kW Active', change: 'Running' },
      { label: 'Auto Load Shedding', value: 'Empty Sections Shed', change: '-210 kW' }
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
    description: 'Mechanical bearing flaking on campus booster pump. RMS vibration exceeds ISO 10816 limit (3.9 mm/s), triggering automatic work order.',
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
