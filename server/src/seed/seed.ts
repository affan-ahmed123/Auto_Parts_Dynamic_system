import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { config } from "../config/env";
import { User } from "../models/User";
import { Make } from "../models/Make";
import { VehicleModel } from "../models/Model";
import { Category } from "../models/Category";
import { Part } from "../models/Part";
import { StockLog } from "../models/StockLog";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { slugify } from "../utils/slugify";

const MAKES_AND_MODELS: Array<{
  make: string;
  models: Array<{ name: string; yearFrom: number; yearTo: number }>;
}> = [
    {
      make: "Toyota",
      models: [
        { name: "Corolla", yearFrom: 2008, yearTo: 2025 },
        { name: "Camry", yearFrom: 2010, yearTo: 2025 },
        { name: "Yaris", yearFrom: 2012, yearTo: 2025 },
        { name: "Hilux", yearFrom: 2011, yearTo: 2025 },
        { name: "Fortuner", yearFrom: 2012, yearTo: 2025 },
      ],
    },
    {
      make: "Honda",
      models: [
        { name: "Civic", yearFrom: 2009, yearTo: 2025 },
        { name: "City", yearFrom: 2010, yearTo: 2025 },
        { name: "Accord", yearFrom: 2012, yearTo: 2024 },
        { name: "CR-V", yearFrom: 2011, yearTo: 2025 },
      ],
    },
    {
      make: "Suzuki",
      models: [
        { name: "Alto", yearFrom: 2014, yearTo: 2025 },
        { name: "Swift", yearFrom: 2010, yearTo: 2025 },
        { name: "Cultus", yearFrom: 2012, yearTo: 2024 },
        { name: "Wagon R", yearFrom: 2014, yearTo: 2025 },
      ],
    },
    {
      make: "Hyundai",
      models: [
        { name: "Elantra", yearFrom: 2012, yearTo: 2025 },
        { name: "Tucson", yearFrom: 2015, yearTo: 2025 },
        { name: "Sonata", yearFrom: 2014, yearTo: 2025 },
        { name: "Santa Fe", yearFrom: 2013, yearTo: 2024 },
      ],
    },
    {
      make: "KIA",
      models: [
        { name: "Sportage", yearFrom: 2016, yearTo: 2025 },
        { name: "Picanto", yearFrom: 2015, yearTo: 2025 },
        { name: "Sorento", yearFrom: 2014, yearTo: 2025 },
        { name: "Stonic", yearFrom: 2019, yearTo: 2025 },
      ],
    },
    {
      make: "Nissan",
      models: [
        { name: "Sunny", yearFrom: 2011, yearTo: 2024 },
        { name: "Altima", yearFrom: 2013, yearTo: 2025 },
        { name: "X-Trail", yearFrom: 2014, yearTo: 2025 },
        { name: "Dayz", yearFrom: 2015, yearTo: 2023 },
      ],
    },
    {
      make: "Mercedes",
      models: [
        { name: "C-Class", yearFrom: 2012, yearTo: 2025 },
        { name: "E-Class", yearFrom: 2013, yearTo: 2025 },
        { name: "GLC", yearFrom: 2016, yearTo: 2025 },
      ],
    },
    {
      make: "BMW",
      models: [
        { name: "3 Series", yearFrom: 2012, yearTo: 2025 },
        { name: "5 Series", yearFrom: 2013, yearTo: 2025 },
        { name: "X3", yearFrom: 2015, yearTo: 2025 },
        { name: "X5", yearFrom: 2014, yearTo: 2025 },
      ],
    },
    {
      make: "Audi",
      models: [
        { name: "A4", yearFrom: 2012, yearTo: 2025 },
        { name: "A6", yearFrom: 2013, yearTo: 2025 },
        { name: "Q5", yearFrom: 2015, yearTo: 2025 },
      ],
    },
    {
      make: "Volkswagen",
      models: [
        { name: "Golf", yearFrom: 2012, yearTo: 2025 },
        { name: "Passat", yearFrom: 2012, yearTo: 2024 },
        { name: "Tiguan", yearFrom: 2015, yearTo: 2025 },
        { name: "Polo", yearFrom: 2011, yearTo: 2024 },
      ],
    },
  ];

const CATEGORIES = [
  { name: "Engine", description: "Timing belts, spark plugs, gaskets, mounts, and pistons" },
  { name: "Brakes", description: "Ceramic brake pads, ventilated rotors, calipers, and sensors" },
  { name: "Suspension", description: "Shock absorbers, coil springs, control arms, and bushings" },
  { name: "Filters", description: "Oil filters, cabin HEPA filters, engine air, and fuel filters" },
  { name: "Electrical", description: "Alternators, starter motors, batteries, and ignition coils" },
  { name: "Body", description: "Side mirrors, bumper grilles, hood latches, and mud flaps" },
  { name: "Lights", description: "LED headlight bulbs, tail lamp assemblies, and fog lights" },
  { name: "Tyres & Wheels", description: "All-season tyres, alloy wheel hubs, and lug nuts" },
  { name: "Oils & Fluids", description: "Full synthetic motor oil, ATF transmission fluid, and coolants" },
];

const createSeedImages = (): Record<string, string> => {
  const serverSeedDir = path.resolve(__dirname, "../../uploads/seed");
  const clientSeedDir = path.resolve(__dirname, "../../../client/public/uploads/seed");

  for (const dir of [serverSeedDir, clientSeedDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const categoryFiles: Record<string, string> = {
    Engine: "engine.svg",
    Brakes: "brakes.svg",
    Suspension: "suspension.svg",
    Filters: "filters.svg",
    Electrical: "electrical.svg",
    Body: "body.svg",
    Lights: "lights.svg",
    "Tyres & Wheels": "tyres-wheels.svg",
    "Oils & Fluids": "oils-fluids.svg",
  };

  const map: Record<string, string> = {};
  for (const [catName, filename] of Object.entries(categoryFiles)) {
    // If the file already exists in client/public, ensure it's also copied to server
    const clientPath = path.join(clientSeedDir, filename);
    const serverPath = path.join(serverSeedDir, filename);
    if (fs.existsSync(clientPath) && !fs.existsSync(serverPath)) {
      fs.copyFileSync(clientPath, serverPath);
    }
    map[catName] = `/uploads/seed/${filename}`;
  }
  return map;
};

interface PartSeedDef {
  name: string;
  partNumber: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  lowStockThreshold?: number;
  condition?: "new" | "used" | "refurbished";
  warrantyMonths?: number;
  isUniversal?: boolean;
  images?: string[];
  fits?: Array<{ make: string; model: string; yearFrom: number; yearTo: number }>;
}

const PARTS_DATA: PartSeedDef[] = [
  // Brakes (6 parts)
  {
    name: "Front Ceramic Brake Pad Set",
    partNumber: "BRK-TOY-04465",
    brand: "Brembo",
    category: "Brakes",
    description: "Low-dust ceramic front brake pads engineered for quiet stopping power and reduced rotor wear in daily city and highway driving.",
    price: 54.99,
    discountPrice: 46.99,
    stock: 28,
    images: ["/uploads/parts/front-ceramic-brake-pad-set.jpg"],
    fits: [
      { make: "Toyota", model: "Corolla", yearFrom: 2014, yearTo: 2024 },
      { make: "Toyota", model: "Yaris", yearFrom: 2016, yearTo: 2024 },
    ],
  },
  {
    name: "Ventilated Front Brake Rotor (Pair)",
    partNumber: "BRK-HON-45251",
    brand: "Bosch",
    category: "Brakes",
    description: "Precision-balanced cast iron ventilated front brake discs with anti-corrosion zinc coating for steady heat dissipation.",
    price: 118.0,
    stock: 14,
    images: ["/uploads/parts/ventilated-front-brake-rotor-pair.jpg"],
    fits: [
      { make: "Honda", model: "Civic", yearFrom: 2012, yearTo: 2023 },
      { make: "Honda", model: "Accord", yearFrom: 2013, yearTo: 2022 },
    ],
  },
  {
    name: "Rear Drum Brake Shoe Kit",
    partNumber: "BRK-SUZ-53200",
    brand: "Akebono",
    category: "Brakes",
    description: "OEM-grade rear drum brake shoes with matched return springs for compact hatchbacks.",
    price: 36.5,
    stock: 4, // Low stock alert demo
    lowStockThreshold: 5,
    images: ["/uploads/parts/rear-drum-brake-shoe-kit.jpg"],
    fits: [
      { make: "Suzuki", model: "Alto", yearFrom: 2015, yearTo: 2025 },
      { make: "Suzuki", model: "Cultus", yearFrom: 2017, yearTo: 2024 },
      { make: "Suzuki", model: "Wagon R", yearFrom: 2014, yearTo: 2025 },
    ],
  },
  {
    name: "ABS Wheel Speed Sensor (Front Left)",
    partNumber: "BRK-HYU-59810",
    brand: "Denso",
    category: "Brakes",
    description: "Direct-fit magnetic ABS sensor to restore accurate wheel speed readings and clear dashboard ABS warning lights.",
    price: 42.0,
    stock: 19,
    images: ["/uploads/parts/abs-wheel-speed-sensor-front-left.jpg"],
    fits: [
      { make: "Hyundai", model: "Elantra", yearFrom: 2014, yearTo: 2022 },
      { make: "Hyundai", model: "Tucson", yearFrom: 2016, yearTo: 2023 },
      { make: "KIA", model: "Sportage", yearFrom: 2016, yearTo: 2023 },
    ],
  },
  {
    name: "Performance Slotted Brake Pad Set (Rear)",
    partNumber: "BRK-BMW-34216",
    brand: "ATE",
    category: "Brakes",
    description: "High-temperature rear brake pads formulated for European sedans and SUVs.",
    price: 78.0,
    discountPrice: 69.0,
    stock: 11,
    images: ["/uploads/parts/performance-slotted-brake-pads-rear.jpg"],
    fits: [
      { make: "BMW", model: "3 Series", yearFrom: 2013, yearTo: 2024 },
      { make: "BMW", model: "X3", yearFrom: 2015, yearTo: 2024 },
    ],
  },
  {
    name: "Brake Caliper Rebuild Seal Kit",
    partNumber: "BRK-NIS-41120",
    brand: "Seiken",
    category: "Brakes",
    description: "Complete EPDM rubber piston seal and dust boot kit for front brake calipers.",
    price: 21.5,
    stock: 35,
    images: ["/uploads/parts/brake-caliper-rebuild-seal-kit.jpg"],
    fits: [
      { make: "Nissan", model: "Sunny", yearFrom: 2012, yearTo: 2023 },
      { make: "Nissan", model: "Altima", yearFrom: 2013, yearTo: 2022 },
    ],
  },

  // Engine (6 parts)
  {
    name: "Iridium IX Spark Plug (Set of 4)",
    partNumber: "ENG-NGK-93175",
    brand: "NGK",
    category: "Engine",
    description: "Fine-wire iridium center electrode spark plugs for faster cold starts, smoother idle, and better fuel economy.",
    price: 44.0,
    discountPrice: 38.5,
    stock: 42,
    images: ["/uploads/parts/iridium-spark-plugs-set4.jpg"],
    fits: [
      { make: "Toyota", model: "Corolla", yearFrom: 2010, yearTo: 2024 },
      { make: "Honda", model: "Civic", yearFrom: 2012, yearTo: 2024 },
      { make: "Honda", model: "City", yearFrom: 2012, yearTo: 2024 },
      { make: "Suzuki", model: "Swift", yearFrom: 2011, yearTo: 2024 },
    ],
  },
  {
    name: "Timing Belt & Tensioner Kit",
    partNumber: "ENG-GAT-TCK32",
    brand: "Gates",
    category: "Engine",
    description: "Heavy-duty HNBR timing belt paired with OEM-spec idler pulley and hydraulic tensioner.",
    price: 145.0,
    stock: 9,
    images: ["/uploads/parts/timing-belt-tensioner-kit.jpg"],
    fits: [
      { make: "Volkswagen", model: "Golf", yearFrom: 2013, yearTo: 2022 },
      { make: "Volkswagen", model: "Passat", yearFrom: 2013, yearTo: 2021 },
      { make: "Audi", model: "A4", yearFrom: 2013, yearTo: 2021 },
    ],
  },
  {
    name: "Hydraulic Engine Mount (Right Side)",
    partNumber: "ENG-TOY-12305",
    brand: "Febest",
    category: "Engine",
    description: "Damped rubber-and-fluid engine mount to eliminate cabin vibration during idle and acceleration.",
    price: 68.0,
    stock: 3, // Low stock alert
    lowStockThreshold: 5,
    images: ["/uploads/parts/hydraulic-engine-mount-right.jpg"],
    fits: [
      { make: "Toyota", model: "Camry", yearFrom: 2012, yearTo: 2023 },
      { make: "Toyota", model: "Corolla", yearFrom: 2014, yearTo: 2022 },
    ],
  },
  {
    name: "Serpentine Drive Belt (6PK-1840)",
    partNumber: "ENG-CON-6PK18",
    brand: "Continental",
    category: "Engine",
    description: "Crack-resistant EPDM multi-ribbed serpentine belt for alternator, A/C compressor, and water pump drive.",
    price: 26.0,
    stock: 25,
    images: ["/uploads/parts/serpentine-drive-belt-6pk1840.jpg"],
    fits: [
      { make: "Hyundai", model: "Tucson", yearFrom: 2015, yearTo: 2024 },
      { make: "KIA", model: "Sportage", yearFrom: 2016, yearTo: 2024 },
    ],
  },
  {
    name: "Valve Cover Gasket Set",
    partNumber: "ENG-HON-12341",
    brand: "Mahle",
    category: "Engine",
    description: "Molded silicone valve cover gasket with spark plug tube seals to stop top-end oil leaks.",
    price: 29.99,
    stock: 17,
    images: ["/uploads/parts/valve-cover-gasket-set.jpg"],
    fits: [
      { make: "Honda", model: "Civic", yearFrom: 2009, yearTo: 2020 },
      { make: "Honda", model: "CR-V", yearFrom: 2012, yearTo: 2021 },
    ],
  },
  {
    name: "Aluminum Coolant Thermostat Housing",
    partNumber: "ENG-MER-27120",
    brand: "Wahler",
    category: "Engine",
    description: "Complete thermostat assembly with housing and temperature sensor for reliable engine warm-up.",
    price: 89.0,
    stock: 7,
    images: ["/uploads/parts/aluminum-coolant-thermostat-housing.jpg"],
    fits: [
      { make: "Mercedes", model: "C-Class", yearFrom: 2012, yearTo: 2021 },
      { make: "Mercedes", model: "E-Class", yearFrom: 2013, yearTo: 2021 },
    ],
  },

  // Filters (5 parts)
  {
    name: "Spin-On Engine Oil Filter",
    partNumber: "FLT-DEN-90915",
    brand: "Denso",
    category: "Filters",
    description: "High-efficiency pleated media oil filter with silicone anti-drainback valve for instant oil pressure at startup.",
    price: 11.5,
    stock: 80,
    images: ["/uploads/parts/spin-on-engine-oil-filter.jpg"],
    fits: [
      { make: "Toyota", model: "Corolla", yearFrom: 2008, yearTo: 2025 },
      { make: "Toyota", model: "Yaris", yearFrom: 2012, yearTo: 2025 },
      { make: "Toyota", model: "Camry", yearFrom: 2010, yearTo: 2025 },
      { make: "Toyota", model: "Hilux", yearFrom: 2011, yearTo: 2025 },
    ],
  },
  {
    name: "Engine Air Intake Filter",
    partNumber: "FLT-MAN-C2700",
    brand: "Mann-Filter",
    category: "Filters",
    description: "Direct-replacement panel air filter trapping fine road dust without restricting airflow.",
    price: 19.0,
    stock: 34,
    images: ["/uploads/parts/engine-air-intake-filter.jpg"],
    fits: [
      { make: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2025 },
      { make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2025 },
    ],
  },
  {
    name: "Activated Carbon Cabin Air Filter",
    partNumber: "FLT-BOS-19874",
    brand: "Bosch",
    category: "Filters",
    description: "Dual-layer activated charcoal cabin filter blocking pollen, exhaust odors, and PM2.5 particles.",
    price: 22.0,
    discountPrice: 17.5,
    stock: 46,
    images: ["/uploads/parts/activated-carbon-cabin-filter.jpg"],
    fits: [
      { make: "KIA", model: "Sportage", yearFrom: 2016, yearTo: 2025 },
      { make: "Hyundai", model: "Tucson", yearFrom: 2015, yearTo: 2025 },
      { make: "Hyundai", model: "Elantra", yearFrom: 2016, yearTo: 2025 },
    ],
  },
  {
    name: "Cartridge Fuel Filter Element",
    partNumber: "FLT-SUZ-15410",
    brand: "Sakura",
    category: "Filters",
    description: "Micro-glass fuel filter protecting injectors from sediment and moisture.",
    price: 16.0,
    stock: 22,
    images: ["/uploads/parts/cartridge-fuel-filter-element.jpg"],
    fits: [
      { make: "Suzuki", model: "Swift", yearFrom: 2010, yearTo: 2024 },
      { make: "Suzuki", model: "Alto", yearFrom: 2014, yearTo: 2025 },
      { make: "Suzuki", model: "Cultus", yearFrom: 2012, yearTo: 2024 },
    ],
  },
  {
    name: "Cartridge Oil Filter (Euro Spec)",
    partNumber: "FLT-MAN-HU702",
    brand: "Mann-Filter",
    category: "Filters",
    description: "Fleece oil filter cartridge with fresh Viton O-rings for extended synthetic oil intervals.",
    price: 18.5,
    stock: 29,
    images: ["/uploads/parts/cartridge-oil-filter-euro.jpg"],
    fits: [
      { make: "Audi", model: "A4", yearFrom: 2013, yearTo: 2025 },
      { make: "Audi", model: "Q5", yearFrom: 2015, yearTo: 2025 },
      { make: "Volkswagen", model: "Tiguan", yearFrom: 2015, yearTo: 2025 },
    ],
  },

  // Suspension (5 parts)
  {
    name: "Front Gas-Charged Shock Absorber (Pair)",
    partNumber: "SUS-KYB-33911",
    brand: "KYB",
    category: "Suspension",
    description: "Twin-tube nitrogen gas struts restoring factory ride comfort and cornering stability.",
    price: 142.0,
    discountPrice: 129.0,
    stock: 12,
    images: ["/uploads/parts/front-gas-shock-absorbers.jpg"],
    fits: [
      { make: "Toyota", model: "Corolla", yearFrom: 2009, yearTo: 2022 },
      { make: "Toyota", model: "Yaris", yearFrom: 2013, yearTo: 2022 },
    ],
  },
  {
    name: "Lower Control Arm with Ball Joint",
    partNumber: "SUS-MOO-RK620",
    brand: "Moog",
    category: "Suspension",
    description: "Forged steel front lower control arm pre-installed with greased ball joint and rubber bushings.",
    price: 84.0,
    stock: 10,
    images: ["/uploads/parts/lower-control-arm-ball-joint.jpg"],
    fits: [
      { make: "Honda", model: "Civic", yearFrom: 2012, yearTo: 2021 },
      { make: "Honda", model: "City", yearFrom: 2014, yearTo: 2023 },
    ],
  },
  {
    name: "Front Stabilizer Sway Bar Link Kit",
    partNumber: "SUS-MON-90754",
    brand: "Monroe",
    category: "Suspension",
    description: "Heavy-duty stabilizer end links to eliminate front-end clunking noises over bumps.",
    price: 31.0,
    stock: 32,
    images: ["/uploads/parts/front-sway-bar-link-kit.jpg"],
    fits: [
      { make: "Hyundai", model: "Tucson", yearFrom: 2015, yearTo: 2024 },
      { make: "KIA", model: "Sportage", yearFrom: 2016, yearTo: 2024 },
      { make: "Nissan", model: "X-Trail", yearFrom: 2014, yearTo: 2024 },
    ],
  },
  {
    name: "Rear Coil Spring Set (Heavy Duty)",
    partNumber: "SUS-BIL-36258",
    brand: "Bilstein",
    category: "Suspension",
    description: "Powder-coated rear suspension coil springs designed to prevent sagging under heavy trunk loads.",
    price: 112.0,
    stock: 4, // Low stock alert
    lowStockThreshold: 5,
    images: ["/uploads/parts/rear-coil-spring-set.jpg"],
    fits: [
      { make: "Toyota", model: "Fortuner", yearFrom: 2013, yearTo: 2024 },
      { make: "Toyota", model: "Hilux", yearFrom: 2012, yearTo: 2024 },
    ],
  },
  {
    name: "Outer Tie Rod End (Left/Right Pair)",
    partNumber: "SUS-TRW-JTE10",
    brand: "TRW",
    category: "Suspension",
    description: "Precision-machined steering tie rod ends for crisp steering response and proper wheel alignment.",
    price: 46.0,
    stock: 18,
    images: ["/uploads/parts/outer-tie-rod-end-pair.jpg"],
    fits: [
      { make: "Suzuki", model: "Swift", yearFrom: 2010, yearTo: 2024 },
      { make: "Suzuki", model: "Alto", yearFrom: 2014, yearTo: 2025 },
    ],
  },

  // Electrical (5 parts)
  {
    name: "Direct-Ignition Coil Pack (Single)",
    partNumber: "ELC-DEN-67313",
    brand: "Denso",
    category: "Electrical",
    description: "High-output pencil ignition coil eliminating engine misfires and rough acceleration.",
    price: 48.0,
    stock: 26,
    images: ["/uploads/parts/direct-ignition-coil-pack.jpg"],
    fits: [
      { make: "Toyota", model: "Corolla", yearFrom: 2010, yearTo: 2024 },
      { make: "Toyota", model: "Camry", yearFrom: 2011, yearTo: 2023 },
      { make: "Toyota", model: "Yaris", yearFrom: 2014, yearTo: 2024 },
    ],
  },
  {
    name: "12V 60Ah Maintenance-Free AGM Battery",
    partNumber: "ELC-BOS-S5005",
    brand: "Bosch",
    category: "Electrical",
    description: "Universal 12V sealed AGM starting battery with high cold-cranking amps for reliable starts.",
    price: 135.0,
    discountPrice: 122.0,
    stock: 15,
    isUniversal: true,
    warrantyMonths: 24,
    images: ["/uploads/parts/agm-maintenance-free-battery-12v.jpg"],
  },
  {
    name: "130A High-Output Alternator (Refurbished)",
    partNumber: "ELC-VAL-43980",
    brand: "Valeo",
    category: "Electrical",
    description: "Bench-tested remanufactured alternator with new bearings, brushes, and voltage regulator.",
    price: 165.0,
    stock: 2, // Low stock alert
    lowStockThreshold: 5,
    condition: "refurbished",
    warrantyMonths: 12,
    images: ["/uploads/parts/alternator-130a-high-output.jpg"],
    fits: [
      { make: "Honda", model: "Civic", yearFrom: 2012, yearTo: 2020 },
      { make: "Honda", model: "Accord", yearFrom: 2013, yearTo: 2020 },
    ],
  },
  {
    name: "Starter Motor Assembly 1.4kW",
    partNumber: "ELC-BOS-00011",
    brand: "Bosch",
    category: "Electrical",
    description: "Permanent-magnet gear-reduction starter motor for fast, reliable engine cranking.",
    price: 149.0,
    stock: 8,
    images: ["/uploads/parts/starter-motor-assembly-14kw.jpg"],
    fits: [
      { make: "Volkswagen", model: "Golf", yearFrom: 2013, yearTo: 2022 },
      { make: "Volkswagen", model: "Polo", yearFrom: 2012, yearTo: 2022 },
      { make: "Audi", model: "A4", yearFrom: 2012, yearTo: 2020 },
    ],
  },
  {
    name: "Heavy-Duty OBD2 Diagnostic Scanner",
    partNumber: "ELC-UNI-OBD2X",
    brand: "Ancel",
    category: "Electrical",
    description: "Plug-and-play universal OBD-II code reader to diagnose check-engine codes on all 1996+ cars.",
    price: 52.0,
    stock: 20,
    isUniversal: true,
    images: ["/uploads/parts/obd2-scanner-diagnostic-tool.jpg"],
  },

  // Lights (4 parts)
  {
    name: "H11 LED Headlight Bulb Kit (6000K White)",
    partNumber: "LGT-PHI-11362",
    brand: "Philips",
    category: "Lights",
    description: "Cool-white 6000K fanless LED headlight upgrade with crisp cut-off beam and no glare.",
    price: 59.0,
    discountPrice: 49.0,
    stock: 40,
    isUniversal: true,
    images: ["/uploads/parts/h11-led-headlight-bulbs.jpg"],
  },
  {
    name: "Clear Lens Fog Light Lamp Assembly (Pair)",
    partNumber: "LGT-TYC-19598",
    brand: "TYC",
    category: "Lights",
    description: "OEM-spec polycarbonate fog lamps including H11 halogen bulbs and mounting brackets.",
    price: 64.0,
    stock: 13,
    images: ["/uploads/parts/clear-lens-fog-lights-pair.jpg"],
    fits: [
      { make: "Toyota", model: "Corolla", yearFrom: 2014, yearTo: 2021 },
      { make: "Toyota", model: "Hilux", yearFrom: 2016, yearTo: 2023 },
    ],
  },
  {
    name: "LED Tail Light Assembly (Right Side)",
    partNumber: "LGT-DEP-21719",
    brand: "Depo",
    category: "Lights",
    description: "Direct-fit rear outer tail lamp with bright integrated LED brake and turn signals.",
    price: 128.0,
    stock: 6,
    images: ["/uploads/parts/led-tail-light-assembly.jpg"],
    fits: [
      { make: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2021 },
    ],
  },
  {
    name: "T10 / W5W LED Interior & License Plate Bulbs (4-Pack)",
    partNumber: "LGT-OSR-2825D",
    brand: "Osram",
    category: "Lights",
    description: "Long-life universal interior dome, map, and license plate LED bulbs.",
    price: 14.0,
    stock: 65,
    isUniversal: true,
    images: ["/uploads/parts/t10-w5w-led-bulbs.jpg"],
  },

  // Body (4 parts)
  {
    name: "Power Heated Side Mirror Assembly (Left)",
    partNumber: "BDY-TYC-52504",
    brand: "TYC",
    category: "Body",
    description: "Electric fold and heated side wing mirror with integrated turn indicator, ready to paint.",
    price: 92.0,
    stock: 9,
    images: ["/uploads/parts/power-heated-side-mirror.jpg"],
    fits: [
      { make: "Honda", model: "City", yearFrom: 2014, yearTo: 2022 },
      { make: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2022 },
    ],
  },
  {
    name: "Front Honeycomb Bumper Grille (Gloss Black)",
    partNumber: "BDY-MER-20588",
    brand: "Bapmic",
    category: "Body",
    description: "ABS plastic direct-fit front bumper grille resistant to stone chips and UV fading.",
    price: 115.0,
    stock: 5,
    images: ["/uploads/parts/front-honeycomb-grille.jpg"],
    fits: [
      { make: "Mercedes", model: "C-Class", yearFrom: 2015, yearTo: 2021 },
    ],
  },
  {
    name: "Silicone All-Weather Wiper Blades (Pair 24\"/16\")",
    partNumber: "BDY-BOS-33970",
    brand: "Bosch",
    category: "Body",
    description: "Beam-style frameless windshield wipers engineered for streak-free wiping in heavy rain.",
    price: 27.5,
    discountPrice: 22.0,
    stock: 55,
    isUniversal: true,
    images: ["/uploads/parts/silicone-wiper-blades-pair.jpg"],
  },
  {
    name: "Heavy-Duty Molded Splash Guards / Mud Flaps (Set of 4)",
    partNumber: "BDY-KIA-86831",
    brand: "OEM Genuine",
    category: "Body",
    description: "Flexible TPO mud flaps protecting lower doors and rocker panels from gravel and road tar.",
    price: 34.0,
    stock: 21,
    images: ["/uploads/parts/molded-splash-guards-mudflaps.jpg"],
    fits: [
      { make: "KIA", model: "Sportage", yearFrom: 2017, yearTo: 2024 },
      { make: "KIA", model: "Sorento", yearFrom: 2016, yearTo: 2024 },
    ],
  },

  // Tyres & Wheels (3 parts)
  {
    name: "205/55R16 Primacy 4 All-Season Tyre",
    partNumber: "TYR-MIC-20555",
    brand: "Michelin",
    category: "Tyres & Wheels",
    description: "Quiet-tread touring radial tyre offering short wet braking distances and long tread life.",
    price: 124.0,
    stock: 24,
    images: ["/uploads/parts/michelin-primacy4-tyre.jpg"],
    fits: [
      { make: "Toyota", model: "Corolla", yearFrom: 2014, yearTo: 2024 },
      { make: "Honda", model: "Civic", yearFrom: 2012, yearTo: 2022 },
      { make: "Volkswagen", model: "Golf", yearFrom: 2013, yearTo: 2024 },
    ],
  },
  {
    name: "Front Wheel Hub & Bearing Assembly",
    partNumber: "TYR-SKF-VKBA6",
    brand: "SKF",
    category: "Tyres & Wheels",
    description: "Pre-greased, sealed wheel hub bearing assembly eliminating humming wheel noise at highway speeds.",
    price: 74.0,
    stock: 11,
    images: ["/uploads/parts/wheel-hub-bearing-assembly.jpg"],
    fits: [
      { make: "Nissan", model: "Altima", yearFrom: 2013, yearTo: 2023 },
      { make: "Nissan", model: "X-Trail", yearFrom: 2014, yearTo: 2023 },
    ],
  },
  {
    name: "Chrome Steel Wheel Lug Nuts M12x1.5 (Set of 20)",
    partNumber: "TYR-UNI-LUG20",
    brand: "Dorman",
    category: "Tyres & Wheels",
    description: "Triple-plated chrome conical seat lug nuts for standard aftermarket and factory alloy rims.",
    price: 25.0,
    stock: 48,
    isUniversal: true,
    images: ["/uploads/parts/chrome-lug-nuts-m12.jpg"],
  },

  // Oils & Fluids (4 parts)
  {
    name: "5W-30 Full Synthetic Motor Oil (4 Liter)",
    partNumber: "OIL-CAS-EDGE5",
    brand: "Castrol",
    category: "Oils & Fluids",
    description: "API SP / ILSAC GF-6 full synthetic engine oil providing wear protection in stop-and-go heat.",
    price: 39.0,
    discountPrice: 34.0,
    stock: 60,
    isUniversal: true,
    images: ["/uploads/parts/motorcraft-5w30-oil.jpg"],
  },
  {
    name: "0W-20 Eco Synthetic Motor Oil (4 Liter)",
    partNumber: "OIL-MOB-0W204",
    brand: "Mobil 1",
    category: "Oils & Fluids",
    description: "Low-viscosity synthetic oil tailored for modern Japanese and Korean hybrid and petrol engines.",
    price: 44.0,
    stock: 38,
    isUniversal: true,
    images: ["/uploads/parts/shell-helix-0w20.jpg"],
  },
  {
    name: "DOT 4 High-Performance Brake Fluid (1 Liter)",
    partNumber: "OIL-ATE-DOT41",
    brand: "ATE",
    category: "Oils & Fluids",
    description: "High dry-boiling-point DOT 4 hydraulic brake and clutch fluid suitable for ABS and ESP systems.",
    price: 15.5,
    stock: 50,
    isUniversal: true,
    images: ["/uploads/parts/bendix-dot4-brake-fluid.jpg"],
  },
  {
    name: "Long-Life Premixed Engine Coolant (4 Liter)",
    partNumber: "OIL-PRE-COOL4",
    brand: "Prestone",
    category: "Oils & Fluids",
    description: "50/50 silicate-free premixed radiator antifreeze/coolant preventing rust and overheating.",
    price: 21.0,
    stock: 3, // Low stock alert
    lowStockThreshold: 5,
    isUniversal: true,
    images: ["/uploads/parts/honda-coolant-4l.jpg"],
  },
];

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.mongoUri);
    console.log("Connected! Clearing previous seed data...");

    await Promise.all([
      User.deleteMany({}),
      Make.deleteMany({}),
      VehicleModel.deleteMany({}),
      Category.deleteMany({}),
      Part.deleteMany({}),
      StockLog.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);

    // 1. Seed Verified Admin & Demo Customer
    const adminUser = await User.create({
      name: "Affan (Store Admin)",
      email: "admin@autoparts.com",
      password: "admin123",
      role: "admin",
      phone: "+92 300 0000000",
      isVerified: true,
      address: {
        street: "Auto Market Block A",
        city: "Lahore",
        postalCode: "54000",
        country: "Pakistan",
      },
    });

    await User.create({
      name: "Demo Customer",
      email: "customer@autoparts.com",
      password: "customer123",
      role: "customer",
      phone: "+92 321 1234567",
      isVerified: true,
      address: {
        street: "45 Main Boulevard",
        city: "Lahore",
        postalCode: "54600",
        country: "Pakistan",
      },
    });

    // 2. Seed 10 Makes & Models
    const makeMap = new Map<string, mongoose.Types.ObjectId>();
    const modelMap = new Map<string, mongoose.Types.ObjectId>();

    for (const item of MAKES_AND_MODELS) {
      const makeDoc = await Make.create({
        name: item.make,
        slug: slugify(item.make),
      });
      makeMap.set(item.make, makeDoc._id);

      for (const m of item.models) {
        const modelDoc = await VehicleModel.create({
          make: makeDoc._id,
          name: m.name,
          slug: slugify(m.name),
          yearFrom: m.yearFrom,
          yearTo: m.yearTo,
        });
        modelMap.set(`${item.make}:${m.name}`, modelDoc._id);
      }
    }

    // 3. Seed 9 Categories
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    for (const c of CATEGORIES) {
      const catDoc = await Category.create({
        name: c.name,
        slug: slugify(c.name),
        description: c.description,
      });
      categoryMap.set(c.name, catDoc._id);
    }

    // 4. Generate Clean Local Product SVG Images & Seed 42 Parts
    const imageMap = createSeedImages();
    const createdParts = [];

    for (const p of PARTS_DATA) {
      const categoryId = categoryMap.get(p.category);
      if (!categoryId) continue;

      const compatibility = (p.fits || [])
        .map((f) => {
          const makeId = makeMap.get(f.make);
          const modelId = modelMap.get(`${f.make}:${f.model}`);
          if (!makeId || !modelId) return null;
          return {
            make: makeId,
            model: modelId,
            yearFrom: f.yearFrom,
            yearTo: f.yearTo,
          };
        })
        .filter((c): c is NonNullable<typeof c> => c !== null);

      const partDoc = await Part.create({
        name: p.name,
        slug: slugify(`${p.name}-${p.partNumber}`),
        partNumber: p.partNumber,
        brand: p.brand,
        category: categoryId,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice ?? null,
        images: p.images && p.images.length > 0 ? p.images : [imageMap[p.category] || "/uploads/seed/engine.svg"],
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold ?? 5,
        condition: p.condition ?? "new",
        warrantyMonths: p.warrantyMonths ?? 12,
        isUniversal: Boolean(p.isUniversal),
        compatibility,
        isActive: true,
      });

      createdParts.push(partDoc);

      await StockLog.create({
        part: partDoc._id,
        change: partDoc.stock,
        newStock: partDoc.stock,
        reason: "manual_restock",
        user: adminUser._id,
        notes: "Initial store inventory seeded",
      });
    }

    console.log("===============================================");
    console.log(` Seed completed successfully!`);
    console.log(` - Users: 2 (admin@autoparts.com / customer@autoparts.com)`);
    console.log(` - Makes: ${MAKES_AND_MODELS.length}`);
    console.log(` - Models: ${modelMap.size}`);
    console.log(` - Categories: ${CATEGORIES.length}`);
    console.log(` - Parts: ${createdParts.length}`);
    console.log("===============================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

void seed();

