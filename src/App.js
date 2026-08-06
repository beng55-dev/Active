import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './responsive.css';
import { supabase } from './supabaseClient';

const branches = [
  'All branches',
  'Barbaza',
  'Laua-an',
  'Bugasong',
  'Patnongon',
  'Belison',
  'Sibalom',
  'San Remigio',
  'San Jose',
  'Hamtic',
];

const statuses = ['All', 'Pending', 'Activated', 'Disconnected', 'Subscribe'];
const requestStatusOptions = ['Activated', 'Disconnected', 'Subscribe'];

const branchBarangays = {
  Barbaza: [
    'Baghari',
    'Bahuyan',
    'Beri',
    'Biga-a',
    'Binangbang',
    'Binangbang Centro',
    'Binanu-an',
    'Cadiao',
    'Calapadan',
    'Capoyuan',
    'Cubay',
    'Embrangga-an',
    'Esparar',
    'Gua',
    'Idao',
    'Igpalge',
    'Igtunarum',
    'Integasan',
    'Ipil',
    'Jinalinan',
    'Lanas',
    'Langcaon (Evelio Javier)',
    'Lisub',
    'Lumboyan',
    'Mablad',
    'Magtulis',
    'Marigne',
    'Mayabay',
    'Mayos',
    'Nalusdan',
    'Narirong',
    'Palma',
    'Poblacion',
    'San Antonio',
    'San Ramon',
    'Soligao',
    'Tabongtabong',
    'Tig-Alaran',
    'Yapo',
  ],
  'Laua-an': [
    'Banban',
    'Bongbongan',
    'Cabariwan',
    'Cadajug',
    'Canituan',
    'Capnayan',
    'Casit-an',
    'Guinbanga-an',
    'Guiamon',
    'Guisijan',
    'Igtadiao',
    'Intao',
    'Jaguikican',
    'Jinalinan',
    'Lactudan',
    'Latazon',
    'Laua-an',
    'Leon',
    'Liberato',
    'Lindero',
    'Liya-liya',
    'Lugta',
    'Lupa-an',
    'Magyapo',
    'Maria',
    'Mauno',
    'Maybunga',
    'Necesito',
    'Oloc',
    'Omlot',
    'Pandanan',
    'Paningayan',
    'Pascuala',
    'Poblacion',
    'San Ramon',
    'Santiago',
    'Tibacan',
    'Tigunhao',
    'Virginia',
    'Bagongbayan',
  ],
  Bugasong: [
    'Anilawan',
    'Arangote',
    'Bagtason',
    'Camangahan',
    'Cubay North',
    'Cubay South',
    'Guija',
    'Igbalangao',
    'Igsoro',
    'Ilaures',
    'Jinalinan',
    'Lacayon',
    'Maray',
    'Paliwan',
    'Pangalcagan',
    'Centro Ilauod',
    'Centro Ilaya',
    'Centro Pojo',
    'Sabang East',
    'Sabang West',
    'Tagudtud North',
    'Tagudtud South',
    'Talisay',
    'Tica',
    'Tono-an',
    'Yapu',
    'Zaragoza',
  ],
  Patnongon: [
    'Alvañiz',
    'Amparo',
    'Apgahan',
    'Aureliana',
    'Badiangan',
    'Bernaldo A. Julagting',
    'Carit-an',
    'Cuyapiao',
    'Villa Elio',
    'Gella',
    'Igbarawan',
    'Igbobon',
    'Igburi',
    'La Rioja',
    'Mabasa',
    'Macarina',
    'Magarang',
    'Magsaysay',
    'Malaiba',
    'Malonoy',
    'Nabitasan',
    'Poblacion I',
    'Poblacion II',
    'Patlabawon',
    'San Angel',
    'San Vicente',
    'Santo Rosario',
    'Tabucan',
    'Talisay',
    'Tarugan',
    'Ticdalan',
    'Tuno',
    'Viga',
    'Yating',
    'Bayo Grande',
    'Bayo Sur',
  ],
  Belison: [
    'Borocboroc',
    'Buenavista',
    'Concepcion',
    'Delima',
    'Ipil',
    'Maradiona',
    'Mojon',
    'Poblacion',
    'Rombang',
    'Salvacion',
    'Sinaja',
  ],
  Sibalom: [
    'Alangan',
    'Valentin Grasparil',
    'Bari',
    'Biga-a',
    'Bongbongan I',
    'Bongbongan II',
    'Bongsod',
    'Bontol',
    'Bugnay',
    'Bululacao',
    'Cabanbanan',
    'Cabariuan',
    'Cabladan',
    'Cadoldolan',
    'Calo-oy',
    'Calog',
    'Catmon',
    'Catungan I',
    'Catungan II',
    'Catungan III',
    'Catungan IV',
    'Cubay-Sermon',
    'Ega',
    'Esperanza I',
    'Esperanza II',
    'Esperanza III',
    'Igcococ',
    'Igdalaquit',
    'Igdagmay',
    'Iglanot',
    'Igpanolong',
    'Igparas',
    'Igsuming',
    'Ilabas',
    'Imparayan',
    'Inabasan',
    'Indag-an',
    'Initan',
    'Insarayan',
    'Lacaron',
    'Lagdo',
    'Lambayagan',
    'Luna',
    'Luyang',
    'Maasin',
    'Mabini',
    'Millamena',
    'Mojon',
    'Nagdayao',
    'Cubay-Napultan',
    'Nazareth',
    'Odiong',
    'Olaga',
    'Pangpang',
    'Panlagangan',
    'Pantao',
    'Pasong',
    'Pis-anan',
    'District I',
    'District II',
    'District III',
    'District IV',
    'Rombang',
    'Salvacion',
    'San Juan',
    'Sido',
    'Solong',
    'Tabongtabong',
    'Tig-ohot',
    'Tigbalua I',
    'Tordesillas',
    'Tulatula',
    'Villafont',
    'Villahermosa',
    'Villar',
    'Tigbalua II',
  ],
  'San Remigio': [
    'Agricula',
    'Alegria',
    'Aningalan',
    'Atabay',
    'Bagumbayan',
    'Baladjay',
    'Banbanan',
    'Barangbang',
    'Bawang',
    'Bugo',
    'Bulan-bulan',
    'Cabiawan',
    'Cabunga-an',
    'Cadolonan',
    'Poblacion',
    'Carawisan I',
    'Carawisan II',
    'Carmelo I',
    'Carmelo II',
    'General Fullon',
    'General Luna',
    'Orquia',
    'Iguirindon',
    'Insubuan',
    'La Union',
    'Lapak',
    'Lumpatan',
    'Magdalena',
    'Maragubdub',
    'Nagbangi I',
    'Nagbangi II',
    'Nasuli',
    'Osorio I',
    'Osorio II',
    'Panpanan I',
    'Panpanan II',
    'Ramon Magsaysay',
    'Rizal',
    'San Rafael',
    'Sinundolan',
    'Sumaray',
    'Trinidad',
    'Tubudan',
    'Vilvar',
    'Walker',
  ],
  'San Jose': [
    'Atabay',
    'Badiang',
    'Barangay 1',
    'Barangay 2',
    'Barangay 3',
    'Barangay 4',
    'Barangay 5',
    'Barangay 6',
    'Barangay 7',
    'Barangay 8',
    'Bariri',
    'Bugarot',
    'Cansadan',
    'Durog',
    'Funda-Dalipe',
    'Igbonglo',
    'Inabasan',
    'Madrangca',
    'Magcalon',
    'Malaiba',
    'Maybato Norte',
    'Maybato Sur',
    'Mojon',
    'Pantao',
    'San Angel',
    'San Fernando',
    'San Pedro',
    'Supa',
  ],
  Hamtic: [
    'Apdo',
    'Asluman',
    'Banawon',
    'Bia-an',
    'Bongbongan I-II',
    'Bongbongan III',
    'Botbot',
    'Budbudan',
    'Buhang',
    'Calacja I',
    'Calacja II',
    'Calala',
    'Cantulan',
    'Caridad',
    'Caromangay',
    'Casalngan',
    'Dangcalan',
    'Del Pilar',
    'Fabrica',
    'Funda',
    'General Fullon',
    'Guintas',
    'Igbical',
    'Igbucagay',
    'Inabasan',
    'Ingwan-Batangan',
    'La Paz',
    'Gov. Evelio B. Javier',
    'Linaban',
    'Malandog',
    'Mapatag',
    'Masanag',
    'Nalihawan',
    'Pamandayan',
    'Pasu-Jungao',
    'Piapi I',
    'Piapi II',
    'Piapi III',
    'Pili 1, 2, 3',
    'Poblacion 1',
    'Poblacion 2',
    'Poblacion 3',
    'Poblacion 4',
    'Poblacion 5',
    'Pu-ao',
    'Suloc',
    'Villavert-Jimenez',
  ],
};

function getBranchBarangays(branch) {
  return branchBarangays[branch] || [];
}

const servicePlanCatalog = [
  {
    name: 'Fiber & Cable Bundle (Package 1) - ₱1,020/mo',
    category: 'Bundle',
    price: '₱1,020.00/month',
    summary: 'Cable TV and internet bundle for covered municipalities.',
    details: [
      'Coverage: Barbaza, Laua-an, Bugasong, Patnongon, Belison, Sibalom, San Remigio, San Jose, and Hamtic.',
      '30 meters of fiber optic wire is provided by the cooperative.',
      'Excess fiber optic wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Fiber & Cable Business Plan - up to 40Mbps',
    category: 'Internet',
    price: 'Up to 40Mbps',
    summary: 'Business-oriented fiber and cable internet package.',
    details: [
      'One-time Wi-Fi router payment: ₱1,500.00.',
      'Lock-in period: 1 year.',
      'Minimum system requirements: Windows 98, Pentium 233 Mhz, 256mb RAM, 1GB free disk space, LAN chord, USB port, and CD-ROM drive.',
    ],
  },
  {
    name: 'Cable TV Standard Package - ₱360.00/month',
    category: 'Cable TV',
    price: '₱360.00/month',
    summary: '85 digital television channels for news, education, sports, and entertainment.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Security deposit depends on the HD package availed.',
      '30 meters of fiber optic wire is provided by the cooperative. Excess fiber optic wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Cable TV Deluxe Package - ₱430.00/month',
    category: 'Cable TV',
    price: '₱430.00/month',
    summary: 'Deluxe HD cable subscription with the same service requirements.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Security deposit depends on the HD package availed.',
      '30 meters of fiber optic wire is provided by the cooperative. Excess fiber optic wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Cable TV Premium Package - ₱490.00/month',
    category: 'Cable TV',
    price: '₱490.00/month',
    summary: 'Premium HD cable subscription for the full TV channel lineup.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Security deposit depends on the HD package availed.',
      '30 meters of fiber optic wire is provided by the cooperative. Excess fiber optic wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'TV Extension Standard Package - ₱100.00/month',
    category: 'TV Extension',
    price: '₱100.00/month',
    summary: 'Standard TV extension subscription for additional viewing points.',
    details: [
      'Activation fee: ₱800.00.',
      'Installation fee: ₱500.00.',
      'Security deposit depends on the HD package availed.',
    ],
  },
  {
    name: 'TV Extension Deluxe Package - ₱130.00/month',
    category: 'TV Extension',
    price: '₱130.00/month',
    summary: 'Deluxe TV extension subscription for additional viewing points.',
    details: [
      'Activation fee: ₱800.00.',
      'Installation fee: ₱500.00.',
      'Security deposit depends on the HD package availed.',
    ],
  },
  {
    name: 'TV Extension Premium Package - ₱150.00/month',
    category: 'TV Extension',
    price: '₱150.00/month',
    summary: 'Premium TV extension subscription for additional viewing points.',
    details: [
      'Activation fee: ₱800.00.',
      'Installation fee: ₱500.00.',
      'Security deposit depends on the HD package availed.',
    ],
  },
  {
    name: 'Internet 1mbps - ₱990.00/month',
    category: 'Internet',
    price: '₱990.00/month',
    summary: 'Entry-level internet plan.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Additional security deposit for CATV: ₱30.00 for Standard HD package, ₱100.00 for Deluxe HD package, and ₱160.00 for Premium HD package.',
      '30 meters of wire is provided by the cooperative. Excess wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Internet 2mbps - ₱1,550.00/month',
    category: 'Internet',
    price: '₱1,550.00/month',
    summary: 'Balanced internet plan for everyday use.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Additional security deposit for CATV: ₱30.00 for Standard HD package, ₱100.00 for Deluxe HD package, and ₱160.00 for Premium HD package.',
      '30 meters of wire is provided by the cooperative. Excess wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Internet 3mbps - ₱2,550.00/month',
    category: 'Internet',
    price: '₱2,550.00/month',
    summary: 'Higher-speed internet plan for heavier browsing and streaming.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Additional security deposit for CATV: ₱30.00 for Standard HD package, ₱100.00 for Deluxe HD package, and ₱160.00 for Premium HD package.',
      '30 meters of wire is provided by the cooperative. Excess wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Internet 4mbps - ₱3,500.00/month',
    category: 'Internet',
    price: '₱3,500.00/month',
    summary: 'Fast internet plan for multi-device homes.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Additional security deposit for CATV: ₱30.00 for Standard HD package, ₱100.00 for Deluxe HD package, and ₱160.00 for Premium HD package.',
      '30 meters of wire is provided by the cooperative. Excess wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Internet 5mbps - ₱4,450.00/month',
    category: 'Internet',
    price: '₱4,450.00/month',
    summary: 'Top-tier consumer internet plan.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Additional security deposit for CATV: ₱30.00 for Standard HD package, ₱100.00 for Deluxe HD package, and ₱160.00 for Premium HD package.',
      '30 meters of wire is provided by the cooperative. Excess wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Internet 2mbps commercial - ₱2,000.00/month',
    category: 'Internet',
    price: '₱2,000.00/month',
    summary: 'Commercial internet plan for business setups.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Additional security deposit for CATV: ₱30.00 for Standard HD package, ₱100.00 for Deluxe HD package, and ₱160.00 for Premium HD package.',
      '30 meters of wire is provided by the cooperative. Excess wire is charged at ₱35.00 per meter.',
    ],
  },
  {
    name: 'Internet 4mbps commercial - ₱4,000.00/month',
    category: 'Internet',
    price: '₱4,000.00/month',
    summary: 'Commercial internet plan for heavier business use.',
    details: [
      'Installation fee: ₱1,000.00.',
      'Service/Membership fee: ₱70.00.',
      'Passbook: ₱12.00.',
      'Additional security deposit for CATV: ₱30.00 for Standard HD package, ₱100.00 for Deluxe HD package, and ₱160.00 for Premium HD package.',
      '30 meters of wire is provided by the cooperative. Excess wire is charged at ₱35.00 per meter.',
    ],
  },
];

const defaultPlans = servicePlanCatalog.map((plan) => plan.name);

const excludedCustomerNames = new Set(['juanito alfonso', 'anton reyes']);

const seedCustomers = [
  {
    id: 'CUS-SEED-001',
    requestId: 'ACT-001',
    date: '2026-07-30',
    box: '001',
    name: 'Caleb Lovega',
    barangay: 'Baghari',
    address: branchAddress('Barbaza', 'Baghari'),
    branch: 'Barbaza',
    package: 'Fiber & Cable Bundle (Package 1) - ₱1,020/mo',
    status: 'Pending',
    remarks: 'Client suggested faster installation scheduling and a clearer update on approval.',
    remarksVersion: 0,
    remarksUpdatedBy: '',
    remarksUpdatedAt: '',
    history: [
      'Added by Branch User. Client suggested faster installation scheduling and a clearer update on approval.',
    ],
  },
  {
    id: 'CUS-SEED-002',
    requestId: 'ACT-002',
    date: '2026-07-30',
    box: '002',
    name: 'Jesally Tiad',
    barangay: 'Bahuyan',
    address: branchAddress('Barbaza', 'Bahuyan'),
    branch: 'Barbaza',
    package: 'Fiber & Cable Bundle (Package 1) - ₱1,020/mo',
    status: 'Activated',
    remarks: 'Client suggested a home bundle that matches basic streaming and work needs.',
    remarksVersion: 0,
    remarksUpdatedBy: '',
    remarksUpdatedAt: '',
    history: [
      'Added by Branch User. Client suggested a home bundle that matches basic streaming and work needs.',
      'Super Admin approved the request on 2026-07-30.',
    ],
  },
  {
    id: 'CUS-SEED-003',
    requestId: 'ACT-003',
    date: '2026-07-30',
    box: '003',
    name: 'Behryl Jean',
    barangay: 'Beri',
    address: branchAddress('Barbaza', 'Beri'),
    branch: 'Barbaza',
    package: 'Fiber & Cable Business Plan - up to 40Mbps',
    status: 'Activated',
    remarks: 'Client suggested faster internet for household use and smoother streaming.',
    remarksVersion: 0,
    remarksUpdatedBy: '',
    remarksUpdatedAt: '',
    history: [
      'Added by Juan Dela Cruz (Admin). Client suggested faster internet for household use and smoother streaming.',
      'Juan Dela Cruz approved the request on 2026-07-30.',
      'Juan Dela Cruz scheduled the request on 2026-07-30.',
      'Juan Dela Cruz confirmed the request as approved on 2026-07-30.',
    ],
  },
];

const seedRequests = seedCustomers.map((customer) => ({
  id: customer.requestId,
  date: customer.date,
  box: customer.box,
  name: customer.name,
  address: customer.address,
  branch: customer.branch,
  package: customer.package,
  status: customer.status,
  remarks: customer.remarks,
  requestId: customer.requestId,
  remarksVersion: customer.remarksVersion || 0,
  remarksUpdatedBy: customer.remarksUpdatedBy || '',
  remarksUpdatedAt: customer.remarksUpdatedAt || '',
  history: customer.history,
}));

const seedUsers = [
  {
    name: 'Super Admin',
    position: 'Super Admin',
    branch: 'All branches',
    email: 'superadmin@barbazacoop.com',
    password: 'super123',
  },
  {
    name: 'Admin',
    position: 'Admin',
    branch: 'All branches',
    email: 'admin@barbazacoop.com',
    password: 'admin123',
  },
];

function inferServicePlanCategory(planName) {
  const normalized = String(planName || '').toLowerCase();
  if (normalized.includes('business')) return 'Business';
  if (normalized.includes('extension')) return 'TV Extension';
  if (normalized.includes('cable')) return 'Cable TV';
  if (normalized.includes('bundle')) return 'Bundle';
  return 'Internet';
}

function toDatabaseStatus(status) {
  const normalized = normalizeRequestStatus(status).toLowerCase();
  if (normalized === 'activated') return 'activated';
  if (normalized === 'disconnected') return 'disconnected';
  if (normalized === 'subscribe') return 'subscribe';
  return 'pending';
}

function safeHistory(value) {
  return Array.isArray(value) ? value : [];
}

function mergeHistory(...groups) {
  return Array.from(
    new Set(
      groups
        .flatMap((group) => (Array.isArray(group) ? group : group ? [group] : []))
        .filter(Boolean),
    ),
  );
}

function toIsoTimestamp(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return null;
  }

  const parsed = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function buildBranchLookup(branchRows) {
  return new Map(
    (Array.isArray(branchRows) ? branchRows : []).map((row) => [
      normalizeCustomerName(row.name),
      row.id,
    ]),
  );
}

function buildPlanLookup(planRows) {
  return new Map(
    (Array.isArray(planRows) ? planRows : []).map((row) => [
      normalizeCustomerName(row.name),
      row.id,
    ]),
  );
}

function createCustomerRow(row, branchLookup, planLookup) {
  const branchId =
    branchLookup.get(normalizeCustomerName(row.branch)) ||
    branchLookup.get(normalizeCustomerName('Barbaza')) ||
    null;

  return {
    box_number: String(row.box || '').trim(),
    full_name: String(row.name || '').trim(),
    barangay: String(row.barangay || '').trim(),
    address: String(row.address || '').trim(),
    branch_id: branchId,
    plan_id: planLookup.get(normalizeCustomerName(row.package)) || null,
    status: toDatabaseStatus(row.status),
    remarks: String(row.remarks || '').trim(),
    remarks_recipient: String(row.remarksRecipient || '').trim() || null,
    remarks_version: Number(row.remarksVersion || 0),
    remarks_updated_by: String(row.remarksUpdatedBy || '').trim() || null,
    remarks_updated_at: toIsoTimestamp(row.remarksUpdatedAt),
    history: safeHistory(row.history),
  };
}

function createRequestRow(row, branchLookup, planLookup, customerId) {
  const branchId =
    branchLookup.get(normalizeCustomerName(row.branch)) ||
    branchLookup.get(normalizeCustomerName('Barbaza')) ||
    null;

  return {
    request_number: String(row.id || '').trim(),
    customer_id: customerId || null,
    applicant_name: String(row.name || '').trim(),
    barangay: String(row.barangay || '').trim(),
    address: String(row.address || '').trim(),
    branch_id: branchId,
    plan_id: planLookup.get(normalizeCustomerName(row.package)) || null,
    status: toDatabaseStatus(row.status),
    remarks: String(row.remarks || '').trim(),
    remarks_recipient: String(row.remarksRecipient || '').trim() || null,
    remarks_version: Number(row.remarksVersion || 0),
    remarks_updated_by: String(row.remarksUpdatedBy || '').trim() || null,
    remarks_updated_at: toIsoTimestamp(row.remarksUpdatedAt),
    schedule_date: String(row.schedule || '').trim() || null,
    history: safeHistory(row.history),
  };
}

function createLinemanRow(row, branchLookup) {
  const branchId =
    branchLookup.get(normalizeCustomerName(row.branch)) ||
    branchLookup.get(normalizeCustomerName('Barbaza')) ||
    null;

  return {
    lineman_number: String(row.id || '').trim(),
    full_name: String(row.name || '').trim(),
    branch_id: branchId,
    status: String(row.status || 'Active').toLowerCase() === 'active' ? 'active' : 'unavailable',
  };
}

function createAppUserRow(row) {
  return {
    name: String(row?.name || '').trim(),
    position: String(row?.position || 'Branch User').trim(),
    branch: String(row?.branch || 'All branches').trim(),
    email: String(row?.email || '').trim(),
    password: String(row?.password || '').trim(),
    status: String(row?.status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active',
  };
}

function mapAppUserRowToApp(row) {
  const position = String(row?.position || 'Branch User').trim();
  return {
    name: String(row?.name || '').trim(),
    position,
    role: position,
    branch: String(row?.branch || 'All branches').trim(),
    email: String(row?.email || '').trim(),
    password: String(row?.password || '').trim(),
    status: String(row?.status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active',
  };
}

function createLookup(rows, keySelector, valueSelector) {
  return new Map((Array.isArray(rows) ? rows : []).map((row) => [keySelector(row), valueSelector(row)]));
}

function mapBranchRowToApp(row) {
  return String(row?.name || '').trim();
}

function mapServicePlanRowToApp(row) {
  return String(row?.name || '').trim();
}

function mapLinemanRowToApp(row, branchLookup) {
  return {
    id: String(row?.lineman_number || row?.id || '').trim(),
    name: String(row?.full_name || '').trim(),
    branch: branchLookup.get(String(row?.branch_id || '')) || 'All branches',
    status: String(row?.status || 'active').toLowerCase() === 'active' ? 'Active' : 'Not Active',
  };
}

function mapRequestRowToApp(row, branchLookup, planLookup, customerLookup) {
  const branch = branchLookup.get(String(row?.branch_id || '')) || 'Barbaza';
  const packageName = planLookup.get(String(row?.plan_id || '')) || defaultPlans[0];
  const requestNumber = String(row?.request_number || row?.id || '').trim();
  const linkedCustomer = customerLookup.get(String(row?.customer_id || '')) || null;
  const clientName = String(linkedCustomer?.name || row?.applicant_name || '').trim();

  return {
    id: requestNumber,
    date: String(row?.schedule_date || row?.created_at || today()).slice(0, 10),
    box: linkedCustomer?.box || String(row?.request_number || '').replace(/[^\d]/g, ''),
    name: clientName,
    address: String(row?.address || linkedCustomer?.address || '').trim(),
    branch,
    package: packageName,
    status: normalizeRequestStatus(row?.status || 'Pending'),
    remarks: String(row?.remarks || '').trim(),
    requestId: requestNumber,
    remarksVersion: Number(row?.remarks_version || 0),
    remarksUpdatedBy: String(row?.remarks_updated_by || '').trim(),
    remarksUpdatedAt: String(row?.remarks_updated_at || '').trim(),
    history: Array.isArray(row?.history) ? row.history : [],
    barangay: String(row?.barangay || linkedCustomer?.barangay || '').trim(),
  };
}

function mapCustomerRowToApp(row, branchLookup, planLookup, requestRecordLookup) {
  const branch = branchLookup.get(String(row?.branch_id || '')) || 'Barbaza';
  const planName = planLookup.get(String(row?.plan_id || '')) || defaultPlans[0];
  const latestRequest = requestRecordLookup.get(String(row?.latest_request_id || '')) || null;
  const requestId = String(latestRequest?.request_number || latestRequest?.id || '').trim();
  const clientName = String(latestRequest?.applicant_name || row?.full_name || '').trim();

  return {
    id: String(row?.id || '').trim(),
    date: String(row?.created_at || today()).slice(0, 10),
    box: String(row?.box_number || '').trim(),
    name: clientName,
    barangay: String(row?.barangay || '').trim(),
    address: String(row?.address || '').trim(),
    branch,
    package: planName,
    status: normalizeRequestStatus(row?.status || 'Pending'),
    remarks: String(row?.remarks || '').trim(),
    requestId,
    remarksVersion: Number(row?.remarks_version || 0),
    remarksUpdatedBy: String(row?.remarks_updated_by || '').trim(),
    remarksUpdatedAt: String(row?.remarks_updated_at || '').trim(),
    history: Array.isArray(row?.history) ? row.history : [],
  };
}

function loadSeededRows(storageKey, seedRows) {
  return seedRows;
}

function loadServicePlans(seedPlans = defaultPlans) {
  return normalizeServicePlans(seedPlans);
}

const navSectionsByRole = {
  'Branch User': [
    {
      items: [['Dashboard', 'dashboard']],
    },
    {
      items: [
        ['Activation Requests', 'clipboard-list'],
        ['Customers', 'users'],
      ],
    },
  ],
  Admin: [
    {
      items: [['Dashboard', 'dashboard']],
    },
    {
      items: [
        ['Activation Requests', 'clipboard-list'],
        ['Customers', 'users'],
      ],
    },
  ],
  'Super Admin': [
    {
      items: [['Dashboard', 'dashboard']],
    },
    {
      items: [
        ['Activation Requests', 'clipboard-list'],
        ['Customers', 'users'],
      ],
    },
    {
      items: [
        ['Linemans', 'wrench'],
        ['Service Plans', 'wifi'],
      ],
    },
    {
      items: [['Reports', 'chart']],
    },
    {
      items: [['Settings', 'settings']],
    },
  ],
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState(null);
  const [page, setPage] = useState('Dashboard');
  const [modal, setModal] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [requestFilter, setRequestFilter] = useState('All');
  const [requestSearch, setRequestSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All branches');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [requests, setRequests] = useState(() =>
    normalizeRequests(loadSeededRows('barbaza_requests', seedRequests)),
  );
  const [customers, setCustomers] = useState(() =>
    normalizeCustomers(loadSeededRows('barbaza_customers', seedCustomers), seedRequests),
  );
  const [users, setUsers] = useState(() =>
    normalizeUsers(seedUsers),
  );
  const [servicePlans, setServicePlans] = useState(() =>
    loadServicePlans(),
  );
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLineman, setSelectedLineman] = useState(null);
  const [linemen, setLinemen] = useState(() =>
    [
      { id: 'LM-001', name: 'Pedro Garcia', branch: 'Barbaza', status: 'Active' },
      { id: 'LM-002', name: 'Laua-an Field Tech', branch: 'Laua-an', status: 'Active' },
      { id: 'LM-003', name: 'Ramon Santos', branch: 'Bugasong', status: 'Not Active' },
      { id: 'LM-004', name: 'Leo Cruz', branch: 'Patnongon', status: 'Active' },
      { id: 'LM-005', name: 'Nestor Cruz', branch: 'Belison', status: 'Active' },
      { id: 'LM-006', name: 'Rico Santos', branch: 'Sibalom', status: 'Active' },
      { id: 'LM-007', name: 'Joel Garcia', branch: 'San Remigio', status: 'Active' },
      { id: 'LM-008', name: 'Carlo Reyes', branch: 'San Jose', status: 'Active' },
      { id: 'LM-009', name: 'Ben Dela Cruz', branch: 'Hamtic', status: 'Active' },
    ],
  );
  const [supabaseReady, setSupabaseReady] = useState(false);
  const supabaseSyncTimerRef = useRef(null);
  const supabaseHydratedRef = useRef(false);
  const appUsersSeededRef = useRef(false);
  const branchRowsRef = useRef([]);
  const planRowsRef = useRef([]);

  useEffect(() => {
    setCustomers((current) => normalizeCustomers(current, requests));
  }, [requests]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
  }, [theme]);

  const handleLogin = async (email, password) => {
    if (!supabase) {
      throw new Error('Database connection is not available yet.');
    }

    if (!supabaseReady) {
      throw new Error('Database is still loading. Please try again.');
    }

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();

    const buildAccount = (data) => ({
      name: String(data.name || '').trim(),
      role: String(data.position || 'Branch User').trim(),
      position: String(data.position || 'Branch User').trim(),
      branch: String(data.branch || 'All branches').trim(),
      email: String(data.email || '').trim(),
      password: String(data.password || '').trim(),
      status: String(data.status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active',
    });

    const localSeedMatch = normalizeUsers(seedUsers).find(
      (item) =>
        String(item.email || '').trim().toLowerCase() === normalizedEmail &&
        String(item.password || '').trim() === normalizedPassword,
    );

    if (localSeedMatch) {
      return buildAccount(localSeedMatch);
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { data, error } = await supabase
        .from('app_users')
        .select('name, position, branch, email, password, status')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data && String(data.password || '') === normalizedPassword) {
        if (String(data.status || 'active').toLowerCase() !== 'active') {
          throw new Error('This account is inactive.');
        }

        return buildAccount(data);
      }

      if (data && String(data.password || '') !== normalizedPassword) {
        throw new Error('Invalid email or password.');
      }

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    throw new Error('Invalid email or password.');
  };

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSupabase() {
      if (!supabase) {
        setSupabaseReady(true);
        return;
      }

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          await supabase.auth.signInAnonymously();
        }
      } catch (error) {
        console.warn('Supabase auth bootstrap skipped:', error);
      } finally {
        if (!cancelled) {
          setSupabaseReady(true);
        }
      }
    }

    bootstrapSupabase();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!supabase || !supabaseReady || supabaseHydratedRef.current) {
      return undefined;
    }

    let cancelled = false;

    async function hydrateFromSupabase() {
      const retryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for (let attempt = 0; attempt < 4 && !cancelled; attempt += 1) {
        try {
          const [branchesResult, plansResult, appUsersResult, customersResult, requestsResult, linemenResult] = await Promise.all([
            supabase.from('branches').select('id, name, municipality, province, is_active, created_at').order('name'),
            supabase.from('service_plans').select('id, name').order('name'),
            supabase
              .from('app_users')
              .select('id, name, position, branch, email, password, status, created_at')
              .order('name'),
            supabase
              .from('customers')
              .select('id, box_number, full_name, barangay, address, branch_id, plan_id, status, remarks, remarks_version, remarks_updated_by, remarks_updated_at, history, latest_request_id, created_at')
              .order('box_number'),
            supabase
              .from('activation_requests')
              .select('id, request_number, customer_id, applicant_name, barangay, address, branch_id, plan_id, status, remarks, remarks_version, remarks_updated_by, remarks_updated_at, schedule_date, history, created_at')
              .order('request_number'),
            supabase
              .from('linemans')
              .select('id, lineman_number, full_name, branch_id, status, created_at')
              .order('lineman_number'),
          ]);

          if (
            branchesResult.error ||
            plansResult.error ||
            appUsersResult.error ||
            customersResult.error ||
            requestsResult.error ||
            linemenResult.error
          ) {
            throw (
              branchesResult.error ||
              plansResult.error ||
              appUsersResult.error ||
              customersResult.error ||
              requestsResult.error ||
              linemenResult.error
            );
          }

          const branchRows = Array.isArray(branchesResult.data) ? branchesResult.data : [];
          const planRows = Array.isArray(plansResult.data) ? plansResult.data : [];
          let appUserRows = Array.isArray(appUsersResult.data) ? appUsersResult.data : [];
          const customerRows = Array.isArray(customersResult.data) ? customersResult.data : [];
          const requestRows = Array.isArray(requestsResult.data) ? requestsResult.data : [];
          const linemanRows = Array.isArray(linemenResult.data) ? linemenResult.data : [];

          const appUsersSeedKey = 'barbaza_app_users_seeded_v1';
          const hasSeededAppUsers =
            appUsersSeededRef.current ||
            (typeof window !== 'undefined' && window.localStorage.getItem(appUsersSeedKey) === 'true');

          if (!appUserRows.length && !hasSeededAppUsers) {
            const seedRows = normalizeUsers(seedUsers).map((row) => createAppUserRow(row));
            const { error: seedError } = await supabase
              .from('app_users')
              .upsert(seedRows, { onConflict: 'email' });

            if (seedError) {
              throw seedError;
            }

            const { data: refreshedAppUsers, error: refreshError } = await supabase
              .from('app_users')
              .select('id, name, position, branch, email, password, status, created_at')
              .order('name');

            if (refreshError) {
              throw refreshError;
            }

            appUserRows = Array.isArray(refreshedAppUsers) ? refreshedAppUsers : [];
            appUsersSeededRef.current = true;

            if (typeof window !== 'undefined') {
              window.localStorage.setItem(appUsersSeedKey, 'true');
            }
          }

          if (
            !branchRows.length &&
            !planRows.length &&
            !appUserRows.length &&
            !customerRows.length &&
            !requestRows.length &&
            !linemanRows.length
          ) {
            await retryDelay(600);
            continue;
          }

          const branchLookup = createLookup(branchRows, (row) => String(row.id || ''), mapBranchRowToApp);
          const planLookup = createLookup(planRows, (row) => String(row.id || ''), mapServicePlanRowToApp);
          branchRowsRef.current = branchRows;
          planRowsRef.current = planRows;
          const requestRecordLookup = new Map(
            requestRows.map((row) => [String(row.id || ''), row]),
          );

          const customerLookup = new Map(
            customerRows.map((row) => [
              String(row.id || ''),
              mapCustomerRowToApp(row, branchLookup, planLookup, requestRecordLookup),
            ]),
          );
          const nextUsers = normalizeUsers([
            ...seedUsers,
            ...appUserRows.map((row) => mapAppUserRowToApp(row)),
          ]);

          const nextRequests = normalizeRequests(
            requestRows.map((row) => mapRequestRowToApp(row, branchLookup, planLookup, customerLookup)),
          );
          const nextCustomers = normalizeCustomers(
            customerRows.map((row) => mapCustomerRowToApp(row, branchLookup, planLookup, requestRecordLookup)),
            nextRequests,
          );
          const nextPlans = normalizeServicePlans([
            ...defaultPlans,
            ...planRows.map((row) => mapServicePlanRowToApp(row)),
          ]);
          const nextLinemen = linemanRows.map((row) => mapLinemanRowToApp(row, branchLookup));

          if (nextRequests.length) {
            setRequests(nextRequests);
          }
          if (nextCustomers.length) {
            setCustomers(nextCustomers);
          }
          if (nextPlans.length) {
            setServicePlans(nextPlans);
          }
          if (nextLinemen.length) {
            setLinemen(nextLinemen);
          }
          if (nextUsers.length) {
            setUsers(nextUsers);
          }

          supabaseHydratedRef.current = true;
          return;
        } catch (error) {
          console.warn('Supabase hydration skipped:', error);
          await retryDelay(600);
        }
      }

      supabaseHydratedRef.current = true;
    }

    hydrateFromSupabase();

    return () => {
      cancelled = true;
    };
  }, [supabaseReady]);

  useEffect(() => {
    if (!supabase || !supabaseReady) {
      return undefined;
    }

    if (supabaseSyncTimerRef.current) {
      clearTimeout(supabaseSyncTimerRef.current);
    }

    supabaseSyncTimerRef.current = setTimeout(async () => {
      try {
        const userRows = users.map((row) => createAppUserRow(row));
        const { error: userError } = await supabase
          .from('app_users')
          .upsert(userRows, { onConflict: 'email' });

        if (userError) {
          throw userError;
        }

        if (!branchRowsRef.current.length || !planRowsRef.current.length) {
          const [branchesResult, plansResult] = await Promise.all([
            supabase.from('branches').select('id, name, municipality, province, is_active, created_at').order('name'),
            supabase.from('service_plans').select('id, name').order('name'),
          ]);

          if (branchesResult.error) {
            throw branchesResult.error;
          }
          if (plansResult.error) {
            throw plansResult.error;
          }

          branchRowsRef.current = Array.isArray(branchesResult.data) ? branchesResult.data : [];
          planRowsRef.current = Array.isArray(plansResult.data) ? plansResult.data : [];
        }

        const branchLookup = buildBranchLookup(branchRowsRef.current);
        const planLookup = buildPlanLookup(planRowsRef.current);

        const linemanRows = linemen.map((row) => createLinemanRow(row, branchLookup));
        const { error: linemanError } = await supabase
          .from('linemans')
          .upsert(linemanRows, { onConflict: 'lineman_number' });

        if (linemanError) {
          throw linemanError;
        }

        const customerRows = customers.map((row) => createCustomerRow(row, branchLookup, planLookup));
        const { data: savedCustomers, error: customerError } = await supabase
          .from('customers')
          .upsert(customerRows, { onConflict: 'box_number' })
          .select('id, box_number');

        if (customerError) {
          throw customerError;
        }

        const customerLookup = new Map(
          (Array.isArray(savedCustomers) ? savedCustomers : []).map((row) => [
            String(row.box_number || ''),
            row.id,
          ]),
        );

        const requestRows = requests.map((row) =>
          createRequestRow(row, branchLookup, planLookup, customerLookup.get(String(row.box || '').trim())),
        );
        const { data: savedRequests, error: requestError } = await supabase
          .from('activation_requests')
          .upsert(requestRows, { onConflict: 'request_number' })
          .select('id, request_number');

        if (requestError) {
          throw requestError;
        }

        const requestLookup = new Map(
          (Array.isArray(savedRequests) ? savedRequests : []).map((row) => [
            String(row.request_number || ''),
            row.id,
          ]),
        );

        await Promise.all(
          requests.map(async (row) => {
            const requestId = requestLookup.get(String(row.id || '').trim());
            const customerId = customerLookup.get(String(row.box || '').trim()) || null;

            if (!requestId || !customerId) {
              return;
            }

            await supabase
              .from('activation_requests')
              .update({ customer_id: customerId })
              .eq('request_number', String(row.id || '').trim());
          }),
        );

        await Promise.all(
          customers.map(async (row) => {
            const latestRequestId = requestLookup.get(String(row.requestId || '').trim()) || null;
            if (!latestRequestId) {
              return;
            }

            await supabase
              .from('customers')
              .update({ latest_request_id: latestRequestId })
              .eq('box_number', String(row.box || '').trim());
          }),
        );
      } catch (error) {
        console.warn('Supabase sync skipped:', error);
      }
    }, 400);

    return () => {
      if (supabaseSyncTimerRef.current) {
        clearTimeout(supabaseSyncTimerRef.current);
      }
    };
  }, [requests, customers, users, linemen, servicePlans, supabaseReady]);

  const activeAccount = account || {
    name: 'Guest',
    role: 'Branch User',
    branch: 'Barbaza',
  };
  const navSections = navSectionsByRole[activeAccount.role] || navSectionsByRole.Admin;
  const activePage =
    activeAccount.role === 'Admin' && (page === 'Reports' || page === 'Settings') ? 'Dashboard' : page;
  const visibleRequests = requests.filter(
    (request) => activeAccount.role !== 'Branch User' || request.branch === activeAccount.branch,
  );
  const visibleCustomers = customers.filter(
    (customer) => activeAccount.role !== 'Branch User' || customer.branch === activeAccount.branch,
  );
  const visibleBranches = activeAccount.role === 'Branch User' ? [activeAccount.branch] : branches.slice(1);
  const canCreateCustomers = activeAccount.role !== 'Admin';
  const selectedName = selectedCustomer?.name || '';
  const replyNotifications = requests.filter((request) => hasUnreadReply(request, activeAccount.name)).length;

  const goRequests = (filter) => {
    setRequestFilter(filter);
    setRequestSearch('');
    setSelectedCustomer(null);
    setPage('Activation Requests');
  };

  const syncCustomerRecord = (requestId, updates) => {
    const normalizedRequestId = String(requestId || '').trim();
    const relatedRequest = requests.find(
      (request) => String(request.id || request.requestId || '').trim() === normalizedRequestId,
    );
    setCustomers((current) =>
      normalizeCustomers(
        current.map((customer) => {
          const linkedByRequestId = String(customer.requestId || '').trim() === normalizedRequestId;
          const linkedByName =
            !linkedByRequestId &&
            normalizedRequestId &&
            normalizeCustomerName(customer.name) ===
              normalizeCustomerName(requests.find((request) => request.id === normalizedRequestId)?.name);

          if (!linkedByRequestId && !linkedByName) {
            return customer;
          }

          const nextStatus = normalizeRequestStatus(updates.status || customer.status || 'Pending');
          const nextHistoryEntry = relatedRequest
            ? `Request ${relatedRequest.id || normalizedRequestId} updated to ${nextStatus} on ${today()}.`
            : `Request ${normalizedRequestId} updated to ${nextStatus} on ${today()}.`;
          const nextHistory = mergeHistory(customer.history, relatedRequest?.history, [nextHistoryEntry]);

          return {
            ...customer,
            ...updates,
            requestId: normalizedRequestId,
            status: nextStatus,
            history: nextHistory,
          };
        }),
      ),
    );
  };

  const saveCustomer = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const branch = account.role === 'Branch User' ? account.branch : String(form.get('branch'));
    const name = String(form.get('name') || '').trim();
    const barangay = String(form.get('barangay') || getBranchBarangays(branch)[0] || '');
    const requestId = `ACT-${String(requests.length + 1).padStart(3, '0')}`;
    const existingCustomer = customers.find(
      (customer) => normalizeCustomerName(customer.name) === normalizeCustomerName(name),
    );
    const customerName = existingCustomer?.name || name;
    const customerBox = existingCustomer?.box || nextCustomerBox(customers);
    const customerId = existingCustomer?.id || `CUS-${String(Number(customerBox)).padStart(3, '0')}`;
    const plan = migratePackagePlan(form.get('package') || servicePlans[0]);
    const address = branchAddress(branch, barangay);

    const request = {
      id: requestId,
      date: today(),
      box: customerBox,
      name: customerName,
      barangay,
      address,
      branch,
      package: plan,
      status: 'Pending',
      remarks: defaultRemark('Pending'),
      remarksVersion: 0,
      remarksUpdatedBy: account.name,
      remarksUpdatedAt: nowStamp(),
      history: [
        `Added by ${account.name} (${account.role}).`,
        existingCustomer
          ? `Package change requested from ${existingCustomer.package} to ${plan}.`
          : 'Customer request created as Pending.',
      ],
    };

    const customer = {
      id: customerId,
      date: existingCustomer?.date || today(),
      box: customerBox,
      name: existingCustomer?.name || customerName,
      barangay,
      address,
      branch,
      package: plan,
      status: 'Pending',
      remarks: existingCustomer?.remarks || '',
      history: mergeHistory(
        existingCustomer?.history,
        request.history,
        existingCustomer
          ? `${account.name} submitted a new request for ${plan} on ${today()}. Waiting for admin activation.`
          : `Added by ${account.name} (${account.role}). Customer record created.`,
      ),
      requestId,
    };

    try {
      if (!supabase || !supabaseReady) {
        throw new Error('Database is not ready yet.');
      }

      if (!branchRowsRef.current.length || !planRowsRef.current.length) {
        const [branchesResult, plansResult] = await Promise.all([
          supabase.from('branches').select('id, name, municipality, province, is_active, created_at').order('name'),
          supabase.from('service_plans').select('id, name').order('name'),
        ]);

        if (branchesResult.error) {
          throw branchesResult.error;
        }
        if (plansResult.error) {
          throw plansResult.error;
        }

        branchRowsRef.current = Array.isArray(branchesResult.data) ? branchesResult.data : [];
        planRowsRef.current = Array.isArray(plansResult.data) ? plansResult.data : [];
      }

      const savedBranchResult = { data: branchRowsRef.current, error: null };
      const savedPlanResult = { data: planRowsRef.current, error: null };

      if (savedBranchResult.error) {
        throw savedBranchResult.error;
      }
      if (savedPlanResult.error) {
        throw savedPlanResult.error;
      }

      const branchLookup = buildBranchLookup(savedBranchResult.data);
      const planLookup = buildPlanLookup(savedPlanResult.data);
      const customerRow = createCustomerRow(customer, branchLookup, planLookup);
      const { data: savedCustomer, error: customerError } = await supabase
        .from('customers')
        .upsert(customerRow, { onConflict: 'box_number' })
        .select('id, box_number')
        .maybeSingle();

      if (customerError) {
        throw customerError;
      }

      const requestRow = createRequestRow(
        request,
        branchLookup,
        planLookup,
        savedCustomer?.id || null,
      );
      const { data: savedRequest, error: requestError } = await supabase
        .from('activation_requests')
        .upsert(requestRow, { onConflict: 'request_number' })
        .select('id, request_number')
        .maybeSingle();

      if (requestError) {
        throw requestError;
      }

      if (savedRequest?.id && savedCustomer?.id) {
        await supabase
          .from('customers')
          .update({ latest_request_id: savedRequest.id })
          .eq('box_number', String(customerBox).trim());
      }

      setCustomers((current) =>
        normalizeCustomers(
          existingCustomer
            ? current.map((item) => (item.id === existingCustomer.id ? customer : item))
            : [customer, ...current],
          [request, ...requests],
        ),
      );
      setRequests((current) => [request, ...current]);
      setModal('');
      setSelectedCustomer(customer);
      setRequestFilter('All');
      setCustomerSearch('');
      setPage('Customers');
    } catch (error) {
      console.warn('Customer save failed:', error);
      window.alert(`Could not save customer to Supabase: ${error.message || 'Unknown error'}`);
    }
  };

  const saveUser = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const birthday = String(form.get('birthday') || '').trim();
    const age = String(calculateAgeFromBirthday(birthday) || '').trim();
    const branch = String(form.get('branch') || 'All branches');
    const address = branchOfficeAddress(branch);
    const position = String(form.get('position') || 'Branch User');
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();
    const user = {
      name,
      age,
      birthday,
      address,
      position,
      branch,
      email,
      password,
      status: 'active',
    };

    try {
      if (supabase && supabaseReady) {
        const { error } = await supabase
          .from('app_users')
          .upsert(createAppUserRow(user), { onConflict: 'email' });

        if (error) {
          throw error;
        }
      }

      setUsers((current) => [...current, user]);
      setModal('');
    } catch (error) {
      console.warn('Branch user save failed:', error);
      window.alert(`Could not save branch user to Supabase: ${error.message || 'Unknown error'}`);
    }
  };

  const openUserProfile = (user) => {
    setSelectedUser(user);
    setModal('user-profile');
  };

  const deleteUser = async (user) => {
    const label = `${user.name || 'this user'}${user.branch ? ` (${user.branch})` : ''}`;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    try {
      if (supabase && supabaseReady && user.email) {
        const { error } = await supabase.from('app_users').delete().eq('email', user.email);
        if (error) {
          throw error;
        }
      }

      setUsers((current) =>
        current.filter(
          (item) =>
            String(item.email || '').trim().toLowerCase() !== String(user.email || '').trim().toLowerCase(),
        ),
      );

      if (
        selectedUser &&
        String(selectedUser.email || '').trim().toLowerCase() ===
          String(user.email || '').trim().toLowerCase()
      ) {
        setSelectedUser(null);
        setModal('');
      }
    } catch (error) {
      console.warn('Branch user delete failed:', error);
      window.alert(`Could not delete branch user: ${error.message || 'Unknown error'}`);
    }
  };

  const updateUserProfile = async (nextUser, originalEmail) => {
  const cleaned = {
      ...nextUser,
      name: String(nextUser.name || '').trim(),
      birthday: String(nextUser.birthday || '').trim(),
      address: branchOfficeAddress(String(nextUser.branch || 'All branches').trim()),
      position: String(nextUser.position || 'Branch User').trim(),
      branch: String(nextUser.branch || 'All branches').trim(),
      email: String(nextUser.email || '').trim(),
      password: String(nextUser.password || '').trim(),
      role: String(nextUser.role || nextUser.position || 'Branch User').trim(),
      status: String(nextUser.status || 'active').trim(),
      age: String(calculateAgeFromBirthday(nextUser.birthday) || nextUser.age || '').trim(),
    };
    const previousEmail = String(originalEmail || '').trim().toLowerCase();
    const nextEmail = String(cleaned.email || '').trim().toLowerCase();

    try {
      if (supabase && supabaseReady && previousEmail && previousEmail !== nextEmail) {
        const { error: deleteError } = await supabase.from('app_users').delete().eq('email', originalEmail);
        if (deleteError) {
          throw deleteError;
        }
      }

      if (supabase && supabaseReady) {
        const { error } = await supabase
          .from('app_users')
          .upsert(createAppUserRow(cleaned), { onConflict: 'email' });

        if (error) {
          throw error;
        }
      }

      setUsers((current) =>
        current.map((item) =>
          String(item.email || '').trim().toLowerCase() === previousEmail ? cleaned : item,
        ),
      );
      setSelectedUser(cleaned);
      return cleaned;
    } catch (error) {
      console.warn('Branch user update failed:', error);
      window.alert(`Could not update branch user: ${error.message || 'Unknown error'}`);
      throw error;
    }
  };

  const openLinemanProfile = (lineman) => {
    setSelectedLineman(lineman);
    setModal('lineman-profile');
  };

  const deleteLineman = async (lineman) => {
    const label = `${lineman.name || 'this lineman'}${lineman.branch ? ` (${lineman.branch})` : ''}`;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    try {
      if (supabase && supabaseReady && lineman.id) {
        const { error } = await supabase.from('linemans').delete().eq('lineman_number', lineman.id);
        if (error) {
          throw error;
        }
      }

      setLinemen((current) => current.filter((item) => String(item.id || '') !== String(lineman.id || '')));

      if (selectedLineman && String(selectedLineman.id || '') === String(lineman.id || '')) {
        setSelectedLineman(null);
        setModal('');
      }
    } catch (error) {
      console.warn('Lineman delete failed:', error);
      window.alert(`Could not delete lineman: ${error.message || 'Unknown error'}`);
    }
  };

  const updateLinemanProfile = async (nextLineman, originalId) => {
    const cleaned = {
      ...nextLineman,
      id: String(nextLineman.id || originalId || '').trim(),
      name: String(nextLineman.name || '').trim(),
      branch: String(nextLineman.branch || 'Barbaza').trim(),
      status: String(nextLineman.status || 'Active').trim(),
    };

    try {
      if (supabase && supabaseReady) {
        const { error } = await supabase
          .from('linemans')
          .upsert(createLinemanRow(cleaned), { onConflict: 'lineman_number' });

        if (error) {
          throw error;
        }
      }

      setLinemen((current) =>
        current.map((item) => (String(item.id || '') === String(originalId || '') ? cleaned : item)),
      );
      setSelectedLineman(cleaned);
      return cleaned;
    } catch (error) {
      console.warn('Lineman update failed:', error);
      window.alert(`Could not update lineman: ${error.message || 'Unknown error'}`);
      throw error;
    }
  };

  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));

  if (!loggedIn) {
    return (
      <LoginScreen
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogin={async (email, password) => {
          const nextAccount = await handleLogin(email, password);
          setAccount(nextAccount);
          setPage('Dashboard');
          setLoggedIn(true);
          return nextAccount;
        }}
      />
    );
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <img src="/barbaza-coop-logo.png" alt="Barbaza Cooperative logo" />
          </div>
          <div>
            <b>BARBAZA COOPERATIVE</b>
            <span>{activeAccount.role} workspace</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section, index) => (
            <div className="nav-section" key={index}>
              <div className="nav-section-items">
                {section.items.map(([name, icon]) => (
                  <button
                    key={name}
                    className={`nav-item ${page === name ? 'active' : ''}`}
                    onClick={() => {
                      setPage(name);
                      setSelectedCustomer(null);
                    }}
                  >
                    <Icon name={icon} className="nav-icon" />
                    <span>{name}</span>
                    {name === 'Activation Requests' && (
                      <b className="nav-count">
                        {visibleRequests.filter((request) => request.status === 'Pending').length}
                      </b>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="workspace-card">
            <strong>{activeAccount.name}</strong>
            <span>{activeAccount.branch}</span>
            <small>Signed in as {activeAccount.role}</small>
          </div>
          <button className="logout-btn" onClick={() => setLoggedIn(false)}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-meta">
            <span>{today()}</span>
            <strong>{activeAccount.name}</strong>
          </div>
          <div className="top-actions">
            {replyNotifications > 0 && (
              <span className="notification-chip" title="Requests with replies waiting for your review">
                <Icon name="bell" className="btn-icon" />
                {replyNotifications} reply{replyNotifications === 1 ? '' : 's'}
              </span>
            )}
            <button className="theme-toggle" onClick={toggleTheme}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="btn-icon" />
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <span className="role-chip">{account.role}</span>
          </div>
        </div>

        <div className="content">
          <div className={`page-heading ${activePage === 'Dashboard' ? 'dashboard-heading' : ''}`.trim()}>
            <div>
              <small>
                {today()} / {activeAccount.branch}
              </small>
              <h1>{activePage}</h1>
              <p>{headingCopy(activePage, activeAccount)}</p>
            </div>
          </div>

          {activePage === 'Dashboard' && (
            <Dashboard
              requests={visibleRequests}
              customers={visibleCustomers}
              allBranches={activeAccount.role !== 'Branch User'}
              openStatus={goRequests}
            />
          )}

          {activePage === 'Activation Requests' && (
            <Requests
              rows={visibleRequests}
              setRows={setRequests}
              syncCustomerRecord={syncCustomerRecord}
              role={activeAccount.role}
              actor={activeAccount.name}
              filter={requestFilter}
              setFilter={setRequestFilter}
              search={requestSearch}
              setSearch={setRequestSearch}
              selectedName={selectedName}
              clearSelected={() => setSelectedCustomer(null)}
            />
          )}

          {activePage === 'Customers' && (
            <Customers
              data={visibleCustomers}
              requests={requests}
              existingNames={customers.map((customer) => customer.name)}
              canAdd={canCreateCustomers}
              onAdd={() => setModal('customer')}
              role={activeAccount.role}
              search={customerSearch}
              setSearch={setCustomerSearch}
            />
          )}

          {activePage === 'Linemans' && (
          <Linemans
            role={activeAccount.role}
            branch={branchFilter}
            setBranch={setBranchFilter}
            linemen={linemen}
            setLinemen={setLinemen}
            add={() => setModal('lineman')}
            viewLineman={openLinemanProfile}
            deleteLineman={deleteLineman}
          />
        )}

          {activePage === 'Service Plans' && (
            <Plans
              role={activeAccount.role}
              plans={servicePlans}
              add={() => setModal('plan')}
            />
          )}

          {activePage === 'Reports' && activeAccount.role === 'Super Admin' && (
            <Reports requests={requests} customers={customers} query={query} setQuery={setQuery} />
          )}

          {activePage === 'Settings' && activeAccount.role === 'Super Admin' && (
            <Settings
              users={users}
              viewUser={openUserProfile}
              deleteUser={deleteUser}
              add={() => setModal('user')}
            />
          )}
        </div>

        {modal === 'customer' && (
          <CustomerModal
            account={account}
            branches={visibleBranches}
            box={nextCustomerBox(customers)}
            plans={servicePlans}
            save={saveCustomer}
            close={() => setModal('')}
            existingCustomers={customers}
          />
        )}

        {modal === 'user' && (
          <UserModal
            role={activeAccount.role}
            save={saveUser}
            close={() => setModal('')}
          />
        )}
        {modal === 'user-profile' && selectedUser && (
          <UserProfileModal
            user={selectedUser}
            customers={customers}
            requests={requests}
            save={updateUserProfile}
            close={() => {
              setSelectedUser(null);
              setModal('');
            }}
          />
        )}
        {modal === 'lineman' && (
          <LinemanModal
            role={account.role}
            branches={branches}
            save={(entry) => setLinemen((current) => [entry, ...current])}
            close={() => setModal('')}
          />
        )}
        {modal === 'lineman-profile' && selectedLineman && (
          <LinemanProfileModal
            lineman={selectedLineman}
            customers={customers}
            requests={requests}
            save={updateLinemanProfile}
            close={() => {
              setSelectedLineman(null);
              setModal('');
            }}
          />
        )}
        {modal === 'plan' && (
          <PlanModal
            existingPlans={servicePlans}
            save={(entry) => setServicePlans((current) => normalizeServicePlans([entry, ...current]))}
            close={() => setModal('')}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({ requests, customers, allBranches, openStatus }) {
  const counts = statusCounts(requests);
  const covered = new Set([...requests, ...customers].map((item) => item.branch)).size;

  return (
    <>
      <div className="stat-grid">
        <Stat tone="teal" label="Total customers" value={customers.length} />
        <Stat tone="amber" label="Pending requests" value={counts.Pending} />
        <Stat tone="blue" label="Activated requests" value={counts.Activated} />
        <Stat
          tone="slate"
          label={allBranches ? 'Branches reporting' : 'Activated'}
          value={allBranches ? covered : counts.Activated}
        />
      </div>

      <div className="overview-grid">
        <section className="panel">
          <Title t="Activation overview" s="Live branch totals from activation records" />
          <BranchBars requests={requests} />
        </section>

        <section className="panel status-panel">
          <Title t="Request status" s="Open a status queue to review work" />
          <div className="machine-status">
            <button onClick={() => openStatus('Pending')}>
              <b>{counts.Pending}</b>
              <span>Pending</span>
            </button>
            <button onClick={() => openStatus('Activated')}>
              <b>{counts.Activated}</b>
              <span>Activated</span>
            </button>
            <button onClick={() => openStatus('Subscribe')}>
              <b>{counts.Subscribe}</b>
              <span>Subscribe</span>
            </button>
            <button onClick={() => openStatus('Disconnected')}>
              <b>{counts.Disconnected}</b>
              <span>Disconnected</span>
            </button>
          </div>
          <div className="system-ready">
            <strong>{requests.length}</strong>
            <span>Total active request records</span>
          </div>
        </section>
      </div>
    </>
  );
}

function Requests({
  rows,
  setRows,
  syncCustomerRecord,
  role,
  actor,
  filter,
  setFilter,
  search,
  setSearch,
  selectedName,
  clearSelected,
}) {
  const list = [...rows]
    .sort((a, b) => Number(a.box || 0) - Number(b.box || 0))
    .filter((request) => {
      const haystack = [
        request.date,
        request.box,
        request.name,
        request.address,
        request.branch,
        request.package,
        request.status,
        request.remarks,
        ...(request.history || []),
      ]
        .join(' ')
        .toLowerCase();
      return !search || haystack.includes(search.toLowerCase());
    })
    .filter((request) => filter === 'All' || request.status === filter)
    .filter((request) => !selectedName || request.name === selectedName);
  const counts = statusCounts(rows);
  const canApprove = role === 'Admin' || role === 'Super Admin';

  const update = (id, changes = {}) => {
    const stamp = nowStamp();
    const existing = rows.find((request) => request.id === id);
    if (!existing) {
      return;
    }

    const hasRemarkChange = Object.prototype.hasOwnProperty.call(changes, 'remarks');
    const nextStatus = normalizeRequestStatus(changes.status ?? existing.status);
    const nextRemarks = hasRemarkChange
      ? String(changes.remarks || '').trim()
      : String(existing.remarks || '').trim();
    const currentRemarks = String(existing.remarks || '').trim();
    const remarkChanged = hasRemarkChange && nextRemarks !== currentRemarks;
    const statusChanged = nextStatus !== existing.status;
    const nextRecord = {
      ...existing,
      status: nextStatus,
      schedule:
        nextStatus === 'Subscribe' || nextStatus === 'Activated'
          ? existing.schedule || today()
          : existing.schedule,
      remarks: remarkChanged ? nextRemarks : existing.remarks,
      remarksVersion: remarkChanged ? (existing.remarksVersion || 0) + 1 : existing.remarksVersion || 0,
      remarksUpdatedBy: remarkChanged ? actor : existing.remarksUpdatedBy || '',
      remarksUpdatedAt: remarkChanged ? stamp : existing.remarksUpdatedAt || '',
      remarksRecipient: remarkChanged ? changes.remarksRecipient || existing.remarksRecipient || '' : existing.remarksRecipient || '',
      history: [...(existing.history || [])],
    };

    if (statusChanged) {
      nextRecord.history.push(`${actor} changed request to ${nextStatus} on ${today()}.`);
    }

    if (remarkChanged) {
      nextRecord.history.push(`${actor} replied in remarks on ${stamp}.`);
    }

    setRows((current) =>
      current.map((request) =>
        request.id === id ? nextRecord : request,
      ),
    );
    syncCustomerRecord(requestIdFromRow(rows, id), {
      status: nextRecord.status,
      schedule: nextRecord.schedule,
      remarks: nextRecord.remarks,
      remarksVersion: nextRecord.remarksVersion,
      remarksUpdatedBy: nextRecord.remarksUpdatedBy,
      remarksUpdatedAt: nextRecord.remarksUpdatedAt,
      remarksRecipient: nextRecord.remarksRecipient,
    });
  };

  return (
    <section className="panel requests-page">
      <div className="section-title">
        <Title
          t={selectedName ? `${selectedName} activation status` : 'Activation request'}
          s="Review pending work, update status, and track approvals"
        />
        <div className="request-header-actions">
          {selectedName && (
            <button className="secondary-btn" onClick={clearSelected}>
              Show all
            </button>
          )}
        </div>
      </div>

      <div className="request-summary">
        {statuses.filter((status) => status !== 'All').map((status) => (
          <button
            key={status}
            className={filter === status ? 'active' : ''}
            onClick={() => setFilter(status)}
          >
            <b>{counts[status]}</b>
            <span>{status}</span>
          </button>
        ))}
        <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>
          <b>{rows.length}</b>
          <span>All</span>
        </button>
      </div>

      <div className="request-toolbar request-toolbar-split">
        <label className="branch-filter">
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search requests by name, box, branch, package..."
          />
        </label>

        <label className="branch-filter">
          Filter
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      <ActivationTable
        rows={list}
        canApprove={canApprove}
        update={update}
        acknowledgeReply={() => {}}
        currentUser={actor}
        role={role}
      />
    </section>
  );
}

function ActivationTable({ rows, canApprove, update, acknowledgeReply, currentUser, role, viewMode = 'compact' }) {
  const [drafts, setDrafts] = useState({});
  const [recipients, setRecipients] = useState({});
  const [recipientOpen, setRecipientOpen] = useState({});
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    setDrafts((current) => {
      const next = {};
      rows.forEach((row) => {
        next[row.id] = Object.prototype.hasOwnProperty.call(current, row.id)
          ? current[row.id]
          : row.remarks || '';
      });
      return next;
    });
  }, [rows]);

  useEffect(() => {
    setRecipients((current) => {
      const next = {};
      rows.forEach((row) => {
        next[row.id] = current[row.id] || defaultRemarkRecipient(role);
      });
      return next;
    });
  }, [rows, role]);

  useEffect(() => {
    setRecipientOpen((current) => {
      const next = {};
      rows.forEach((row) => {
        next[row.id] = Boolean(current[row.id]);
      });
      return next;
    });
  }, [rows]);

  useEffect(() => {
    setExpandedIds((current) => {
      const next = {};
      rows.forEach((row) => {
        next[row.id] = Object.prototype.hasOwnProperty.call(current, row.id)
          ? current[row.id]
          : false;
      });
      return next;
    });
  }, [rows]);

  const renderRequestControls = (row) => (
    null
  );

  const renderStatusDropdown = (row, className = '') =>
    canApprove ? (
      <select
        className={`request-status-select ${className}`.trim()}
        value={row.status || 'Pending'}
        onChange={(event) => update(row.id, { status: event.target.value })}
        aria-label={`Update status for ${row.name}`}
      >
        {row.status === 'Pending' ? (
          <option value="Pending" disabled>
            Pending
          </option>
        ) : null}
        {requestStatusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    ) : (
      <span className={`status-pill ${statusClass(row.status)}`}>{row.status}</span>
    );

  const renderRemarkEditor = (row) => (
    <div className="remark-cell">
      {hasUnreadReply(row, currentUser) && <span className="reply-badge">New reply</span>}
      {row.remarksUpdatedBy && row.remarksVersion > 0 && (
        <small className="remark-meta">
          Last reply by {row.remarksUpdatedBy}
          {row.remarksUpdatedAt ? ` on ${row.remarksUpdatedAt}` : ''}
          {row.remarksRecipient ? ` to ${row.remarksRecipient}` : ''}
        </small>
      )}
      <textarea
        className="remark-editor"
        value={drafts[row.id] ?? row.remarks ?? ''}
        onFocus={() => acknowledgeReply(row.id)}
        onChange={(event) =>
          setDrafts((current) => ({
            ...current,
            [row.id]: event.target.value,
          }))
        }
        placeholder="Type a reply or update the remarks"
      />
      <div className="remark-actions">
        <div className="remark-send-stack">
          {recipientOpen[row.id] && (
            <select
              className="remark-target"
              value={recipients[row.id] || defaultRemarkRecipient(role)}
              onChange={(event) =>
                setRecipients((current) => ({
                  ...current,
                  [row.id]: event.target.value,
                }))
              }
            >
              {remarkRecipientOptions(role).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            className="primary-btn small-btn"
            onClick={() => {
              if (!recipientOpen[row.id]) {
                setRecipientOpen((current) => ({
                  ...current,
                  [row.id]: true,
                }));
                return;
              }

              const nextRemark = drafts[row.id] ?? row.remarks ?? '';
              const nextRecipient = recipients[row.id] || defaultRemarkRecipient(role);
              setDrafts((current) => ({
                ...current,
                [row.id]: nextRemark,
              }));
              update(row.id, {
                remarks: nextRemark,
                remarksRecipient: nextRecipient,
              });
              setRecipientOpen((current) => ({
                ...current,
                [row.id]: false,
              }));
            }}
          >
            {recipientOpen[row.id] ? 'Send Remarks' : 'Send Remarks to'}
          </button>
        </div>
      </div>
    </div>
  );

  if (viewMode === 'compact') {
    return (
      <div className="request-card-list">
        {rows.map((row) => (
          <article key={row.id} className={`request-card ${statusClass(row.status)}`}>
            <div
              className="request-card-summary"
              role="button"
              tabIndex={0}
              onClick={() =>
                setExpandedIds((current) => ({
                  ...current,
                  [row.id]: !current[row.id],
                }))
              }
            >
              <div className="request-card-heading">
                <div>
                  <b>{row.name}</b>
                  <span>{row.branch}</span>
                </div>
                <div className="request-card-chip-group">
                  <button
                    type="button"
                    className="request-card-chip request-card-view-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setExpandedIds((current) => ({
                        ...current,
                        [row.id]: !current[row.id],
                      }));
                    }}
                  >
                    View
                  </button>
                  {renderStatusDropdown(row, 'request-card-status-select')}
                </div>
              </div>
              <div className="request-card-meta">
                <span>{row.date}</span>
                <span>{row.package}</span>
                {row.schedule && <span>Schedule: {row.schedule}</span>}
              </div>
            </div>

            {expandedIds[row.id] && (
              <div className="request-card-body">
                <div className="request-card-details">
                  <div>
                    <span>Address</span>
                    <b>{row.address}</b>
                  </div>
                  <div>
                    <span>Branch</span>
                    <b>{row.branch}</b>
                  </div>
                  <div>
                    <span>Box Number</span>
                    <b>{row.box || '-'}</b>
                  </div>
                  <div>
                    <span>Package</span>
                    <b>{row.package}</b>
                  </div>
                  <div>
                    <span>Status</span>
                    <b>{row.status}</b>
                  </div>
                </div>
                <div className="request-card-actions">
                  {renderRequestControls(row)}
                  {renderRemarkEditor(row)}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Date Requested</th>
            <th>Box Number</th>
            <th>Client Name</th>
            <th>Address</th>
            <th>Branch</th>
            <th>Package</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`client-row ${statusClass(row.status)}`}>
              <td>{row.date}</td>
              <td>{row.box || '-'}</td>
              <td>
                <b>{row.name}</b>
              </td>
              <td>{row.address}</td>
              <td>{row.branch}</td>
              <td>{row.package}</td>
              <td>
                {renderStatusDropdown(row)}
                {row.schedule && <small className="row-history">Schedule: {row.schedule}</small>}
              </td>
              <td>
                <div className="remark-cell">
                  {hasUnreadReply(row, currentUser) && <span className="reply-badge">New reply</span>}
                  {row.remarksUpdatedBy && row.remarksVersion > 0 && (
                    <small className="remark-meta">
                      Last reply by {row.remarksUpdatedBy}
                      {row.remarksUpdatedAt ? ` on ${row.remarksUpdatedAt}` : ''}
                      {row.remarksRecipient ? ` to ${row.remarksRecipient}` : ''}
                    </small>
                  )}
                  <textarea
                    className="remark-editor"
                    value={drafts[row.id] ?? row.remarks ?? ''}
                    onFocus={() => acknowledgeReply(row.id)}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [row.id]: event.target.value,
                      }))
                    }
                    placeholder="Type a reply or update the remarks"
                  />
                  <div className="remark-actions">
                    <div className="remark-send-stack">
                      {recipientOpen[row.id] && (
                        <select
                          className="remark-target"
                          value={recipients[row.id] || defaultRemarkRecipient(role)}
                          onChange={(event) =>
                            setRecipients((current) => ({
                              ...current,
                              [row.id]: event.target.value,
                            }))
                          }
                        >
                          {remarkRecipientOptions(role).map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        className="primary-btn small-btn"
                        onClick={() => {
                          if (!recipientOpen[row.id]) {
                            setRecipientOpen((current) => ({
                              ...current,
                              [row.id]: true,
                            }));
                            return;
                          }

                          const nextRemark = drafts[row.id] ?? row.remarks ?? '';
                          const nextRecipient =
                            recipients[row.id] || defaultRemarkRecipient(role);
                          setDrafts((current) => ({
                            ...current,
                            [row.id]: nextRemark,
                          }));
                          update(row.id, {
                            remarks: nextRemark,
                            remarksRecipient: nextRecipient,
                          });
                          setRecipientOpen((current) => ({
                            ...current,
                            [row.id]: false,
                          }));
                        }}
                      >
                        {recipientOpen[row.id] ? 'Send Remarks' : 'Send Remarks to'}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Customers({ data, requests, canAdd, onAdd, role, search, setSearch }) {
  const filteredRows = data.filter((row) => {
    const haystack = [
      row.name,
      row.date,
      row.address,
      row.branch,
      row.box,
      row.package,
      row.status,
      row.remarks,
      ...(row.history || []),
    ]
      .join(' ')
      .toLowerCase();
    return !search || haystack.includes(search.toLowerCase());
  });

  return (
    <section className="panel customers-page">
      <div className="section-title">
        <Title
          t="Customer"
          s={
            canAdd
              ? 'Branch users submit customer requests that start as Pending'
              : 'Customer records are read-only for review and approval'
          }
        />
        {canAdd ? (
          <button className="primary-btn" onClick={onAdd}>
            <Icon name="plus" className="btn-icon" />
            New customer request
          </button>
        ) : null}
      </div>

      <div className="request-toolbar customer-toolbar">
        <label className="branch-filter">
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers by name, box, branch, package..."
          />
        </label>
      </div>

      {filteredRows.length ? (
        <CustomerTable
          rows={[...filteredRows].sort((a, b) => Number(a.box || 0) - Number(b.box || 0))}
          requests={requests}
        />
      ) : (
        <div className="customer-empty">
          <h3>No customer records yet</h3>
          <p>
            {canAdd
              ? 'Create a customer request to place it in Pending approval.'
              : 'Branch users will submit customer requests here for approval.'}
          </p>
        </div>
      )}
    </section>
  );
}

function CustomerTable({ rows, requests }) {
  const [expandedId, setExpandedId] = useState('');

  const requestById = new Map(requests.map((request) => [request.requestId || request.id, request]));

  const getHistory = (row) => {
    const linkedRequest = requestById.get(row.requestId);
    const normalizedName = normalizeCustomerName(row.name);
    const relatedRequests = requests
      .filter(
        (request) =>
          normalizeCustomerName(request.name) === normalizedName &&
          String(request.branch || '') === String(row.branch || ''),
      )
      .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
    const transaction = Array.from(
      new Set([
        ...(row.history || []),
        ...relatedRequests.flatMap((request) => [
          `Request ${request.id} - ${request.status} - ${request.package}`,
          ...(request.history || []),
        ]),
      ]),
    );

    return {
      linkedRequest,
      personal: [
        { label: 'Date added', value: row.date },
        { label: 'Branch', value: row.branch },
        { label: 'Address', value: row.address },
        { label: 'Box', value: row.box },
        { label: 'Package', value: row.package },
        { label: 'Status', value: row.status || 'Pending' },
      ],
      transaction,
      other: row.history || [],
    };
  };

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Date Added</th>
            <th>Client Name</th>
            <th>Address</th>
            <th>Branch</th>
            <th>Box</th>
            <th>Package</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr>
                <td>{String(index + 1).padStart(3, '0')}</td>
                <td>{row.date}</td>
                <td>
                  <div className="customer-name-row">
                    <b>{row.name}</b>
                  </div>
                </td>
                <td>{row.address}</td>
                <td>{row.branch}</td>
                <td>{row.box}</td>
                <td>{row.package}</td>
                <td>
                  <div className="customer-status-actions">
                    <span className={`status-pill ${statusClass(row.status)}`}>{row.status || 'Pending'}</span>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="secondary-btn customer-view-btn"
                    onClick={() => setExpandedId((current) => (current === row.id ? '' : row.id))}
                  >
                    {expandedId === row.id ? 'Hide' : 'View'}
                  </button>
                </td>
              </tr>
              {expandedId === row.id && (
                <tr className="customer-detail-row">
                  <td colSpan={9}>
                    <CustomerDetail row={row} histories={getHistory(row)} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomerDetail({ row, histories }) {
  const { linkedRequest, personal, transaction, other } = histories;

  return (
    <div className="customer-detail-panel">
      <div className="customer-detail-header">
        <h3>{row.name}</h3>
        <p>
          {row.branch} branch record
          {linkedRequest?.status ? ` - linked request ${linkedRequest.status}` : ''}
        </p>
      </div>

      <div className="customer-detail-grid">
        <div className="detail-card">
          <h4>Personal information</h4>
          <div className="detail-list">
            {personal.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-card">
          <h4>Transaction history</h4>
          <div className="detail-history">
            {transaction.length ? (
              transaction.map((entry, index) => <p key={`${entry}-${index}`}>{entry}</p>)
            ) : (
              <p>No transaction history yet.</p>
            )}
          </div>
        </div>

        <div className="detail-card">
          <h4>Other history</h4>
          <div className="detail-history">
            {other.length ? (
              other.map((entry, index) => <p key={`${entry}-${index}`}>{entry}</p>)
            ) : (
              <p>No other history yet.</p>
            )}
          </div>
        </div>

        <div className="detail-card">
          <h4>Remarks / notes</h4>
          <div className="detail-history">
            {linkedRequest?.remarks ? <p>{linkedRequest.remarks}</p> : <p>No remarks recorded.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerModal({ account, branches, box, plans: planOptions, save, close, existingCustomers }) {
  const selectableBranches = useMemo(
    () => (account.role === 'Branch User' ? [account.branch] : branches.filter((item) => item !== 'All branches')),
    [account.role, account.branch, branches],
  );
  const [branch, setBranch] = useState(selectableBranches[0] || branches[1] || 'Barbaza');
  const [barangay, setBarangay] = useState(getBranchBarangays(selectableBranches[0] || branches[1] || 'Barbaza')[0] || '');
  const [name, setName] = useState('');
  const [boxValue, setBoxValue] = useState(box);
  const [selectedPlan, setSelectedPlan] = useState(planOptions[0] || defaultPlans[0]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const planCatalogLookup = useMemo(
    () => new Map(servicePlanCatalog.map((plan) => [normalizeCustomerName(plan.name), plan])),
    [],
  );
  const visiblePlans = useMemo(
    () =>
      planOptions.map((item) => planCatalogLookup.get(normalizeCustomerName(item)) || { name: item }),
    [planCatalogLookup, planOptions],
  );
  const groupedPlans = useMemo(() => groupPlansByCategory(visiblePlans), [visiblePlans]);

  useEffect(() => {
    setBranch(selectableBranches[0] || branches[1] || 'Barbaza');
  }, [account.role, account.branch, branches, selectableBranches]);

  useEffect(() => {
    const availableBarangays = getBranchBarangays(branch);
    setBarangay((current) => (availableBarangays.includes(current) ? current : availableBarangays[0] || current));
  }, [branch]);

  useEffect(() => {
    setName('');
    setBoxValue(box);
    setSelectedPlan(planOptions[0] || defaultPlans[0]);
  }, [box, planOptions]);

  useEffect(() => {
    if (!groupedPlans.length) {
      return;
    }

    const currentCategory = groupedPlans.some((group) => group.category === selectedCategory)
      ? selectedCategory
      : groupedPlans[0].category;
    const nextGroup = groupedPlans.find((group) => group.category === currentCategory) || groupedPlans[0];
    const currentPlanIsValid = nextGroup.plans.some((plan) => plan.name === selectedPlan);

    setSelectedCategory(currentCategory);
    if (!currentPlanIsValid) {
      setSelectedPlan(nextGroup.plans[0]?.name || planOptions[0] || defaultPlans[0]);
    }
  }, [groupedPlans, planOptions, selectedCategory, selectedPlan]);

  const selectedCustomer = useMemo(
    () => existingCustomers.find((customer) => normalizeCustomerName(customer.name) === normalizeCustomerName(name)),
    [existingCustomers, name],
  );
  const address = branchAddress(branch, barangay);
  const selectedPlanData = visiblePlans.find((plan) => plan.name === selectedPlan) || visiblePlans[0] || null;
  const currentCategoryPlans =
    groupedPlans.find((group) => group.category === selectedCategory)?.plans || visiblePlans;

  useEffect(() => {
    if (!selectedCustomer) {
      setBoxValue(box);
      return;
    }

    setBoxValue(selectedCustomer.box || box);
    setSelectedPlan(selectedCustomer.package || planOptions[0] || defaultPlans[0]);
    if (account.role !== 'Branch User') {
      setBranch(selectedCustomer.branch || selectableBranches[0] || branches[1] || 'Barbaza');
    }
    setBarangay(selectedCustomer.barangay || getBranchBarangays(selectedCustomer.branch || branch)[0] || '');
  }, [account.role, branch, branches, box, planOptions, selectableBranches, selectedCustomer]);

  const handleSave = (event) => {
    event.preventDefault();
    save(event);
  };

  const registeredNames = existingCustomers.map((customer) => customer.name).filter(Boolean);

  return (
    <Modal title="New customer request" save={handleSave} close={close}>
      <label>
        Date
        <input value={today()} readOnly />
      </label>
      <label>
        Box Number
        <input value={boxValue} readOnly />
      </label>
      <label className="wide">
        Complete Name
        <input
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          list="registered-customer-names"
          required
        />
        <datalist id="registered-customer-names">
          {registeredNames.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </label>
      <label className="wide">
        Branch
        <select
          name="branch"
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
          disabled={account.role === 'Branch User'}
        >
          {selectableBranches.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="wide">
        Barangay
        <select name="barangay" value={barangay} onChange={(event) => setBarangay(event.target.value)}>
          {getBranchBarangays(branch).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="wide">
        Auto Address
        <input name="address" value={address} readOnly />
      </label>
      <div className="wide">
        <div className="field-label">Package</div>
        <div className="plan-select-grid">
          <label>
            Category
            <select
              value={selectedCategory}
              onChange={(event) => {
                const nextCategory = event.target.value;
                setSelectedCategory(nextCategory);
                const nextGroup = groupedPlans.find((group) => group.category === nextCategory);
                setSelectedPlan(nextGroup?.plans[0]?.name || selectedPlan);
              }}
            >
              {groupedPlans.map((group) => (
                <option key={group.category} value={group.category}>
                  {group.category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Package
            <select
              name="package"
              value={selectedPlan}
              onChange={(event) => setSelectedPlan(event.target.value)}
            >
              {currentCategoryPlans.map((plan) => (
                <option key={plan.name} value={plan.name}>
                  {plan.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {selectedPlanData && (
          <div className="plan-selected-summary">
            <span className="plan-badge">{selectedPlanData.category || selectedCategory || 'Plan'}</span>
            <h3>{selectedPlanData.name}</h3>
            <strong>{selectedPlanData.price || 'Custom package'}</strong>
            <p>{selectedPlanData.summary || 'Select this package for the customer request.'}</p>
            {!!selectedPlanData.details?.length && (
              <ul className="plan-details">
                {selectedPlanData.details.slice(0, 1).map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

function Settings({ users, add, viewUser, deleteUser }) {
  const [selected, setSelected] = useState('Branch Users');
  const systemUsers = useMemo(() => normalizeSystemUsers(users), [users]);
  const branchUsers = useMemo(
    () =>
      systemUsers.filter((user) => String(user.role || '').trim() === 'Branch User'),
    [systemUsers],
  );
  const tabs = [
    ['Branch Users', 'users'],
    ['Audit Logs', 'chart'],
  ];

  return (
    <section className="settings-layout">
      <div className="settings-nav">
        {tabs.map(([item, icon]) => (
          <button
            className={selected === item ? 'active' : ''}
            onClick={() => setSelected(item)}
            key={item}
          >
            <Icon name={icon} className="btn-icon" />
            {item}
          </button>
        ))}
      </div>

      <div className="panel settings-content">
        {selected === 'Branch Users' ? (
          <>
            <div className="settings-heading">
              <div>
                <h2>Branch Users</h2>
                <p>Super Admin can manage branch user accounts and view profile history.</p>
              </div>
            </div>
            <div className="add-user-box">
              <div>
                <h3>Add new Branch User</h3>
                <p>Create the branch login, email, password, and profile details in one form.</p>
              </div>
              <button className="primary-btn" onClick={add}>
                <Icon name="plus" className="btn-icon" />
                Add new Branch User
              </button>
            </div>
            {branchUsers.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Branch</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchUsers.map((user) => (
                      <tr key={`${user.email}-${user.role}`}>
                        <td>{user.name}</td>
                        <td>{user.role}</td>
                        <td>{user.branch}</td>
                        <td>
                          <div className="user-actions">
                            <button
                              type="button"
                              className="secondary-btn small-btn"
                              onClick={() => viewUser(user)}
                            >
                              <Icon name="eye" className="btn-icon" />
                              View
                            </button>
                            <button
                              type="button"
                              className="secondary-btn small-btn danger-btn"
                              onClick={() => deleteUser(user)}
                            >
                              <Icon name="trash" className="btn-icon" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <h3>No branch users yet</h3>
                <p>Add a new branch user above to start the list below.</p>
              </div>
            )}
          </>
        ) : (
          <AuditLogs />
        )}
      </div>
    </section>
  );
}

function UserModal({ role, save, close }) {
  const canAssignSuperAccess = role === 'Super Admin';
  const branchOptions = canAssignSuperAccess ? branches : branches.slice(1);
  const [birthday, setBirthday] = useState('');
  const [branch, setBranch] = useState(canAssignSuperAccess ? branches[0] : branches[1]);
  const age = calculateAgeFromBirthday(birthday);
  const address = branchOfficeAddress(branch);

  return (
    <Modal title="Add branch user" save={save} close={close}>
      <label className="wide">
        Complete Name
        <input name="name" required />
      </label>
      <label>
        Age
        <input name="age" type="number" min="1" value={age} readOnly placeholder="29" />
      </label>
      <label>
        Birthday
        <input
          name="birthday"
          type="date"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
          required
        />
      </label>
      <label>
        Position
        <select name="position" defaultValue="Branch User">
          <option>Branch User</option>
          <option>Admin</option>
          {canAssignSuperAccess && <option>Super Admin</option>}
        </select>
      </label>
      <label className="wide">
        Branch
        <select
          name="branch"
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
          required
        >
          {branchOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="wide">
        Address
        <input name="address" value={address} readOnly />
      </label>
      <label className="wide">
        Email
        <input name="email" type="email" placeholder="name.branch@barbazacoop.com" required />
      </label>
      <label className="wide">
        Password
        <input name="password" type="password" placeholder="Create a strong password" required />
      </label>
    </Modal>
  );
}

function UserProfileModal({ user, customers, requests, save, close }) {
  const activity = useMemo(() => collectUserHistory(user, customers, requests).slice(0, 2), [user, customers, requests]);
  const [draft, setDraft] = useState(() => ({
    originalEmail: String(user.email || ''),
    name: String(user.name || ''),
    age: String(user.age || ''),
    birthday: String(user.birthday || ''),
    address: branchOfficeAddress(String(user.branch || 'All branches').trim()),
    position: String(user.position || 'Branch User'),
    branch: String(user.branch || 'All branches'),
    email: String(user.email || ''),
    password: String(user.password || ''),
  }));

  useEffect(() => {
    setDraft({
      originalEmail: String(user.email || ''),
      name: String(user.name || ''),
      age: String(user.age || ''),
      birthday: String(user.birthday || ''),
      address: branchOfficeAddress(String(user.branch || 'All branches').trim()),
      position: String(user.position || 'Branch User'),
      branch: String(user.branch || 'All branches'),
      email: String(user.email || ''),
      password: String(user.password || ''),
    });
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    await save(draft, draft.originalEmail);
    close();
  };

  return (
    <div className="modal-backdrop">
      <form className="customer-form user-profile-modal compact-profile-modal" onSubmit={submit}>
        <div className="modal-head profile-head">
          <div className="profile-headline">
            <span className="profile-avatar" aria-hidden="true">
              <Icon name="user-circle" className="profile-avatar-icon" />
            </span>
            <div>
              <h2>{draft.name || 'Branch User Profile'}</h2>
              <p>{draft.position || 'Branch User'}{draft.branch ? ` - ${draft.branch}` : ''}</p>
            </div>
          </div>
          <button type="button" onClick={close}>
            x
          </button>
        </div>

        <div className="profile-edit-layout">
          <section className="profile-card profile-card--form">
            <h3>Personal information</h3>
            <div className="profile-form-grid">
              <label>
                Complete Name
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label>
                Age
                <input value={calculateAgeFromBirthday(draft.birthday) || draft.age || ''} readOnly />
              </label>
              <label>
                Birthday
                <input
                  type="date"
                  value={draft.birthday}
                  onChange={(event) => setDraft((current) => ({ ...current, birthday: event.target.value }))}
                />
              </label>
              <label>
                Position
                <input
                  value={draft.position}
                  onChange={(event) => setDraft((current) => ({ ...current, position: event.target.value }))}
                />
              </label>
              <label>
                Branch
                <input
                  value={draft.branch}
                  onChange={(event) => setDraft((current) => ({ ...current, branch: event.target.value }))}
                />
              </label>
              <label className="wide">
                Address
                <input value={branchOfficeAddress(draft.branch)} readOnly />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={draft.password}
                  onChange={(event) => setDraft((current) => ({ ...current, password: event.target.value }))}
                />
              </label>
            </div>
          </section>

          <section className="profile-card profile-activity-card">
            <h3>Added customers</h3>
            {activity.length ? (
              <div className="profile-activity-list compact">
                {activity.map((item) => (
                  <article key={item.id || `${item.name}-${item.address}`} className="profile-activity-item">
                    <div className="profile-activity-top">
                      <div>
                        <strong>{item.name || 'Customer'}</strong>
                        <span>{item.address || 'No address recorded'}</span>
                      </div>
                      <span className="profile-activity-chip">{item.branch || 'Branch'}</span>
                    </div>
                    <p>{item.history.length ? item.history.join(' ') : 'No history recorded.'}</p>
                    {(item.package || item.status) && (
                      <small>
                        {item.package ? `Package: ${item.package}` : ''}
                        {item.package && item.status ? ' - ' : ''}
                        {item.status ? `Status: ${item.status}` : ''}
                      </small>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state profile-empty">
                <h3>No added customers yet</h3>
                <p>This user has no recorded customer additions.</p>
              </div>
            )}
            {activity.length > 2 && <small className="profile-more">+ {activity.length - 2} more recent records</small>}
          </section>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={close}>
            Cancel
          </button>
          <button className="primary-btn">
            <Icon name="save" className="btn-icon" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function LinemanProfileModal({ lineman, customers, requests, save, close }) {
  const activity = useMemo(() => collectLinemanHistory(lineman, customers, requests).slice(0, 2), [lineman, customers, requests]);
  const [draft, setDraft] = useState(() => ({
    originalId: String(lineman.id || ''),
    name: String(lineman.name || ''),
    branch: String(lineman.branch || 'Barbaza'),
    status: String(lineman.status || 'Active'),
  }));

  useEffect(() => {
    setDraft({
      originalId: String(lineman.id || ''),
      name: String(lineman.name || ''),
      branch: String(lineman.branch || 'Barbaza'),
      status: String(lineman.status || 'Active'),
    });
  }, [lineman]);

  const positionLabel = `${draft.branch || 'Barbaza'} Main Branch Lineman`;

  const submit = async (event) => {
    event.preventDefault();
    await save(draft, draft.originalId);
    close();
  };

  return (
    <div className="modal-backdrop">
      <form className="customer-form user-profile-modal compact-profile-modal" onSubmit={submit}>
        <div className="modal-head profile-head">
          <div className="profile-headline">
            <span className="profile-avatar" aria-hidden="true">
              <Icon name="user-circle" className="profile-avatar-icon" />
            </span>
            <div>
              <h2>{draft.name || 'Lineman Profile'}</h2>
              <p>{positionLabel}</p>
            </div>
          </div>
          <button type="button" onClick={close}>
            x
          </button>
        </div>

        <div className="profile-edit-layout">
          <section className="profile-card profile-card--form">
            <h3>Personal information</h3>
            <div className="profile-form-grid">
              <label className="wide">
                Complete Name
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label>
                Branch
                <input
                  value={draft.branch}
                  onChange={(event) => setDraft((current) => ({ ...current, branch: event.target.value }))}
                />
              </label>
              <label>
                Status
                <input value={draft.status} readOnly />
              </label>
              <div className="profile-readonly wide">
                <span>Position</span>
                <strong>{positionLabel}</strong>
              </div>
            </div>
          </section>

          <section className="profile-card profile-activity-card">
            <h3>Branch activity</h3>
            {activity.length ? (
              <div className="profile-activity-list compact">
                {activity.map((item) => (
                  <article key={item.id || `${item.name}-${item.address}`} className="profile-activity-item">
                    <div className="profile-activity-top">
                      <div>
                        <strong>{item.name || 'Customer'}</strong>
                        <span>{item.address || 'No address recorded'}</span>
                      </div>
                      <span className="profile-activity-chip">{item.branch || 'Branch'}</span>
                    </div>
                    <p>{item.history.length ? item.history.join(' ') : 'No activity recorded.'}</p>
                    {(item.package || item.status) && (
                      <small>
                        {item.package ? `Package: ${item.package}` : ''}
                        {item.package && item.status ? ' - ' : ''}
                        {item.status ? `Status: ${item.status}` : ''}
                      </small>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state profile-empty">
                <h3>No branch activity yet</h3>
                <p>This lineman does not have linked customer or request history yet.</p>
              </div>
            )}
          </section>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={close}>
            Cancel
          </button>
          <button className="primary-btn">
            <Icon name="save" className="btn-icon" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function LinemanModal({ branches: branchOptions, save, close }) {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(branchOptions[0] || 'Barbaza');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const cleanName = String(name || '').trim();
    if (!cleanName) {
      setError('Please enter a lineman name.');
      return;
    }

    setError('');
    save({
      id: `LM-${String(Date.now()).slice(-6)}`,
      name: cleanName,
      branch,
      status: 'Active',
    });
    close();
  };

  return (
    <Modal title="Add lineman" save={submit} close={close}>
      <label className="wide">
        Name
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          required
        />
        {error && <small className="field-error">{error}</small>}
      </label>
      <label className="wide">
        Branch
        <select value={branch} onChange={(event) => setBranch(event.target.value)}>
          {branchOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Status
        <input value="Active" readOnly />
      </label>
    </Modal>
  );
}

function PlanModal({ existingPlans, save, close }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const existing = useMemo(
    () => new Set(existingPlans.map((item) => normalizeCustomerName(item))),
    [existingPlans],
  );

  const submit = (event) => {
    event.preventDefault();
    const cleanName = String(name || '').trim();
    if (!cleanName) {
      setError('Please enter a plan name.');
      return;
    }

    if (existing.has(normalizeCustomerName(cleanName))) {
      setError('That service plan already exists.');
      return;
    }

    save(cleanName);
    close();
  };

  return (
    <Modal title="Add service plan" save={submit} close={close}>
      <label className="wide">
        Plan name
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          required
        />
        {error && <small className="field-error">{error}</small>}
      </label>
    </Modal>
  );
}

function Linemans({ role, branch, setBranch, linemen, setLinemen, add, viewLineman, deleteLineman }) {
  const rows = linemen.filter((item) => branch === 'All branches' || item.branch === branch);
  const canAdd = role === 'Super Admin';

  return (
    <section className="panel">
      <div className="section-title">
        <Title t="Lineman roster" s="Super admin branch coverage report" />
        <div className="lineman-header-actions">
          {canAdd && (
            <button className="primary-btn" onClick={add}>
              <Icon name="plus" className="btn-icon" />
              Add lineman
            </button>
          )}
          <label className="branch-filter">
            Branch
            <select value={branch} onChange={(event) => setBranch(event.target.value)}>
              {branches.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className={`lineman-row ${item.status === 'Active' ? 'active' : 'inactive'}`}>
                <td>
                  <b>{item.name}</b>
                </td>
                <td>{item.branch}</td>
                <td>
                  <span className={`status-pill ${item.status === 'Active' ? 'approved' : 'rejected'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="user-actions">
                    <button
                      type="button"
                      className="secondary-btn small-btn"
                      onClick={() => viewLineman(item)}
                    >
                      <Icon name="eye" className="btn-icon" />
                      View
                    </button>
                    <button
                      type="button"
                      className="secondary-btn small-btn danger-btn"
                      onClick={() => deleteLineman(item)}
                    >
                      <Icon name="trash" className="btn-icon" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Plans({ role, plans, add }) {
  const canAdd = role === 'Super Admin';
  const normalizedPlans = normalizeServicePlans(plans);
  const catalogLookup = new Map(
    servicePlanCatalog.map((plan) => [normalizeCustomerName(plan.name), plan]),
  );
  const displayPlans = normalizedPlans.map((name) => catalogLookup.get(normalizeCustomerName(name)) || {
    name,
      category: 'Custom',
      price: 'Custom package',
      summary: 'Custom plan added by Super Admin.',
      details: [],
    });
  const groupedPlans = useMemo(() => groupPlansByCategory(displayPlans), [displayPlans]);

  return (
    <section className="panel plans-page">
      <div className="section-title">
        <Title t="Service plans" s="Cable TV, internet, TV extension, and bundle activation plans" />
        {canAdd && (
          <button className="primary-btn" onClick={add}>
            <Icon name="plus" className="btn-icon" />
            Add plan
          </button>
        )}
      </div>
      <div className="plan-intro">
        <strong>Coverage</strong>
        <p>
          Cable TV and internet cover Barbaza, Laua-an, Bugasong, Patnongon, Belison, Sibalom,
          San Remigio, San Jose, and Hamtic.
        </p>
      </div>
      <div className="plan-category-list">
        {groupedPlans.map((group) => (
          <details className="plan-category" key={group.category} open={group.category === 'Bundle'}>
            <summary>
              <div>
                <strong>{group.category}</strong>
                <span>{group.plans.length} package{group.plans.length === 1 ? '' : 's'}</span>
              </div>
              <b>View packages</b>
            </summary>
            <div className="plan-category-body">
              {group.plans.map((item) => (
                <article className="plan-card compact" key={item.name}>
                  <span className="plan-badge">{item.category}</span>
                  <h3>{item.name}</h3>
                  <strong>{item.price}</strong>
                  <p>{item.summary}</p>
                  {!!item.details?.length && (
                    <ul className="plan-details">
                      {item.details.slice(0, 2).map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function Reports({ requests, customers, query, setQuery }) {
  const rows = [
    ...requests.map((item) => ({ type: 'Activation', ...item })),
    ...customers.map((item) => ({
      type: 'Customer',
      status: item.status,
      remarks: 'Customer record',
      ...item,
    })),
  ].filter((item) => Object.values(item).join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="panel reports-page">
      <Title t="Branchwide reports" s="Search activation and customer records" />
      <div className="report-filter">
        <b>Search</b>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, branch, package, status..."
        />
        <button onClick={() => setQuery('')}>Clear</button>
      </div>
      <SimpleTable
        rows={rows.map((item) => ({
          type: item.type,
          date: item.date,
          name: item.name,
          branch: item.branch,
          package: item.package,
          status: item.status,
        }))}
      />
    </section>
  );
}

function SimpleTable({ rows }) {
  const keys = rows[0] ? Object.keys(rows[0]) : [];

  return rows.length ? (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {keys.map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="customer-empty">
      <h3>No records found</h3>
    </div>
  );
}

function BranchBars({ requests }) {
  const counts = branches.slice(1).map((branch) => ({
    branch,
    count: requests.filter((request) => request.branch === branch).length,
  }));
  const max = Math.max(1, ...counts.map((item) => item.count));

  return (
    <div className="branch-bars-live">
      {counts.map((item) => (
        <div key={item.branch} className="branch-bar-row">
          <span>{item.branch}</span>
          <div>
            <b style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }} />
          </div>
          <em>{item.count}</em>
        </div>
      ))}
    </div>
  );
}

function Modal({ title, save, close, children }) {
  return (
    <div className="modal-backdrop">
      <form className="customer-form" onSubmit={save}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            <p>Complete the request and keep the workflow consistent.</p>
          </div>
          <button type="button" onClick={close}>
            x
          </button>
        </div>

        <div className="form-grid">{children}</div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={close}>
            Cancel
          </button>
          <button className="primary-btn">
            <Icon name="save" className="btn-icon" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function LoginScreen({ onLogin, theme, onToggleTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`login-screen theme-${theme}`}>
      <div className="login-card">
        <div className="login-head">
          <img src="/barbaza-coop-logo.png" alt="Barbaza Cooperative" />
          <button className="theme-toggle" onClick={onToggleTheme}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="btn-icon" />
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
        <h1>BARBAZA COOPERATIVE</h1>
        <p>Cable and Internet Activation</p>
        <form onSubmit={submit} autoComplete="off">
          <label>
            Email
            <input
              type="text"
              inputMode="email"
              name="login-identity"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="new-password"
              spellCheck="false"
              autoCapitalize="none"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="login-secret"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              spellCheck="false"
              required
            />
          </label>
          {error && <p className="login-error">{error}</p>}
            <button className="primary-btn" disabled={submitting}>
              <Icon name="log-in" className="btn-icon" />
              {submitting ? 'Signing in...' : 'Log In'}
            </button>
          </form>
      </div>
    </div>
  );
}

function AuditLogs() {
  const logs = [
    ['2026-07-22 09:42', 'Super Admin', 'View', 'Viewed all branch reports', 'Viewed'],
    ['2026-07-22 09:35', 'Admin', 'Update', 'Approved activation request', 'Updated'],
    ['2026-07-22 09:18', 'Branch User', 'Create', 'Created auto-pending activation request', 'Created'],
  ];

  return (
    <>
      <h2>Audit Logs</h2>
      <p>Branch user and approval activity only.</p>
      <div className="audit-list">
        {logs.map((log, index) => (
          <div className="audit-item" key={index}>
            <div className="audit-time">{log[0]}</div>
            <div className="audit-main">
              <b>{log[2]}</b>
              <span>{log[3]}</span>
              <small>Performed by {log[1]}</small>
            </div>
            <em className={`audit-status ${log[4].toLowerCase()}`}>{log[4]}</em>
          </div>
        ))}
      </div>
    </>
  );
}

function Title({ t, s }) {
  return (
    <div className="title-block">
      <h2>{t}</h2>
      <p>{s}</p>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <span className="stat-kicker">{label}</span>
      <strong>{value}</strong>
      <small>Updated from current records</small>
    </div>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nowStamp() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

function calculateAgeFromBirthday(birthday) {
  const value = String(birthday || '').trim();
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const todayDate = new Date();
  let age = todayDate.getFullYear() - date.getFullYear();
  const monthDelta = todayDate.getMonth() - date.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && todayDate.getDate() < date.getDate())) {
    age -= 1;
  }

  return age >= 0 ? String(age) : '';
}

function branchOfficeAddress(branch) {
  const town = String(branch || '').trim();
  if (!town || town === 'All branches') {
    return 'BMPC Main Office, Antique';
  }

  return `BMPC ${town} Branch, ${town}, Antique`;
}

function branchAddress(branch, barangay = '') {
  if (barangay) {
    return `${barangay}, ${branch}, Antique`;
  }

  return branch ? `${branch}, Antique` : '';
}

function normalizeAddress(row) {
  const branch = String(row?.branch || '').trim();
  const barangay = String(row?.barangay || '').trim();
  const address = String(row?.address || '').trim();

  if (branch && barangay) {
    return branchAddress(branch, barangay);
  }

  if (branch === 'Barbaza') {
    if (address) {
      const cleaned = address
        .replace(/^Brgy\.\s*/i, '')
        .replace(/\s*Branch Service Area,\s*Antique$/i, '')
        .replace(/\s*,\s*Barbaza\s*,\s*Antique$/i, '')
        .replace(/\s*,\s*Antique$/i, '')
        .trim();

      return branchAddress(branch, cleaned || 'Jinalinan');
    }

    return branchAddress(branch, 'Jinalinan');
  }

  if (address) {
    return address;
  }

  return branch ? `${branch}, Antique` : '';
}

function normalizeRemark(row) {
  const remarks = String(row?.remarks || '').trim();
  if (!remarks) {
    return defaultRemark(row?.status);
  }

  const legacyRemarks = [
    'Pending approval from admin and super admin',
    'Pending approval from admin',
    'Approved by admin',
    'Installation scheduled by admin',
    'Activation completed',
    'Rejected by admin',
    'Request placed on hold',
    'Customer record',
  ];

  if (legacyRemarks.some((item) => item.toLowerCase() === remarks.toLowerCase())) {
    return defaultRemark(row?.status);
  }

  return remarks;
}

function normalizeCustomerName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeUsers(rows) {
  const normalized = [];

  rows
    .filter((row) => row)
    .forEach((row) => {
      const name = String(row.name || '').trim();
      const branch = String(row.branch || 'All branches').trim();
      const position = String(row.position || 'Branch User').trim();
      const role = String(row.role || position).trim();
      const existing = normalized.slice();
      const email = String(row.email || '').trim() || generateBranchUserEmail(name, branch, existing);
      const password = String(row.password || '').trim() || generateBranchUserPassword(name, branch, existing);
      const birthday = String(row.birthday || '').trim();
      const age = String(row.age || '').trim() || String(calculateAgeFromBirthday(birthday) || '').trim();
      const address = String(row.address || '').trim() || branchOfficeAddress(branch);

      normalized.push({
        ...row,
        name,
        age,
        birthday,
        address,
        position,
        role,
        branch,
        email,
        password,
      });
    });

  return normalized;
}

function normalizeSystemUsers(rows) {
  const combined = normalizeUsers(rows);
  const seen = new Set();

  return combined.filter((user) => {
    const key = String(user.email || '').toLowerCase();
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function collectUserHistory(user, customers = [], requests = []) {
  const needle = `added by ${normalizeCustomerName(user?.name || '')}`;
  const records = [
    ...(Array.isArray(customers) ? customers : []),
    ...(Array.isArray(requests) ? requests : []),
  ];

  return records
    .filter((record) =>
      Array.isArray(record?.history) &&
      record.history.some((entry) => String(entry || '').trim().toLowerCase().includes(needle)),
    )
    .map((record) => ({
      id: String(record.id || record.requestId || record.box || record.name || '').trim(),
      name: String(record.name || record.applicant_name || 'Customer').trim(),
      address: String(record.address || '').trim(),
      branch: String(record.branch || '').trim(),
      package: String(record.package || '').trim(),
      status: String(record.status || '').trim(),
      history: record.history.filter((entry) =>
        String(entry || '').trim().toLowerCase().includes(needle),
      ),
    }))
    .reduce((accumulator, item) => {
      const key = item.id || `${normalizeCustomerName(item.name)}|${normalizeCustomerName(item.address)}`;
      if (!accumulator.some((existing) => {
        const existingKey = existing.id || `${normalizeCustomerName(existing.name)}|${normalizeCustomerName(existing.address)}`;
        return existingKey === key;
      })) {
        accumulator.push(item);
      }
      return accumulator;
    }, []);
}

function collectLinemanHistory(lineman, customers = [], requests = []) {
  const branchKey = normalizeCustomerName(lineman?.branch || '');
  const records = [
    ...(Array.isArray(customers) ? customers : []),
    ...(Array.isArray(requests) ? requests : []),
  ];

  return records
    .filter((record) => normalizeCustomerName(record?.branch || '') === branchKey)
    .map((record) => ({
      id: String(record.id || record.requestId || record.box || record.name || '').trim(),
      name: String(record.name || record.applicant_name || 'Customer').trim(),
      address: String(record.address || '').trim(),
      branch: String(record.branch || '').trim(),
      package: String(record.package || '').trim(),
      status: String(record.status || '').trim(),
      history: Array.isArray(record?.history) ? record.history : [],
    }))
    .reduce((accumulator, item) => {
      const key = item.id || `${normalizeCustomerName(item.name)}|${normalizeCustomerName(item.address)}`;
      if (!accumulator.some((existing) => {
        const existingKey = existing.id || `${normalizeCustomerName(existing.name)}|${normalizeCustomerName(existing.address)}`;
        return existingKey === key;
      })) {
        accumulator.push(item);
      }
      return accumulator;
    }, [])
    .slice(0, 8);
}

function hasUnreadReply(row, accountName) {
  const version = Number(row?.remarksVersion || 0);
  const updater = String(row?.remarksUpdatedBy || '').trim();
  if (!version || !updater) {
    return false;
  }

  return updater !== accountName;
}

function headingCopy(page, account) {
  if (page === 'Dashboard') {
    return account.role === 'Super Admin'
      ? 'All Barbaza Cooperative branch reports and requests.'
      : 'Workspace summary for your assigned records.';
  }

  if (page === 'Activation Requests') {
    return account.role === 'Branch User'
      ? 'Requests submitted by branch users stay Pending until reviewed.'
      : 'Review request details, remarks, and approval status.';
  }

  if (page === 'Customers') {
    return 'Customer records are created by branch users and approved by admins.';
  }

  if (page === 'Reports') {
    return 'Review customer and activation activity across branches.';
  }

  return 'Professional operations workspace for daily branch work.';
}

function statusClass(value) {
  const status = String(value || '').toLowerCase();
  if (status === 'pending') return 'pending';
  if (status === 'activated') return 'activated';
  if (status === 'disconnected') return 'disconnected';
  if (status === 'subscribe') return 'subscribe';
  return 'default-status';
}

function normalizeRequestStatus(value) {
  const status = String(value || '').trim();
  const normalized = status.toLowerCase();

  if (!normalized || normalized === 'pending') return 'Pending';
  if (normalized === 'activated' || normalized === 'approved' || normalized === 'completed') {
    return 'Activated';
  }
  if (normalized === 'disconnected' || normalized === 'rejected') {
    return 'Disconnected';
  }
  if (normalized === 'subscribe' || normalized === 'scheduled' || normalized === 'on hold') {
    return 'Subscribe';
  }

  return status;
}

function statusCounts(rows) {
  return statuses
    .filter((status) => status !== 'All')
    .reduce((acc, status) => {
      acc[status] = rows.filter((row) => row.status === status).length;
      return acc;
    }, {});
}

function defaultRemark(status) {
  if (status === 'Activated') return 'Client service has been activated and is now active.';
  if (status === 'Disconnected') return 'Client service has been disconnected.';
  if (status === 'Subscribe') return 'Client subscription is being processed for service activation.';
  return 'Client suggested a new service request for review.';
}

function remarkRecipientOptions(role) {
  if (role === 'Super Admin') {
    return ['Admin', 'Branch User'];
  }

  if (role === 'Admin') {
    return ['Branch User', 'Super Admin'];
  }

  if (role === 'Branch User') {
    return ['Admin', 'Super Admin'];
  }

  return ['Super Admin'];
}

function defaultRemarkRecipient(role) {
  return remarkRecipientOptions(role)[0];
}

function normalizeRequests(rows) {
  return rows
    .filter((row) => row)
    .filter((row) => !excludedCustomerNames.has(normalizeCustomerName(row.name)))
    .map((row) =>
      Array.isArray(row)
        ? {
            id: row[0] || '',
            date: today(),
            box: String(row[5] || row[0] || '').replace(/[^\d]/g, ''),
            name: row[1],
            address: row[2],
            branch: row[2],
            package: migratePackagePlan(row[3]),
            status: normalizeRequestStatus(row[4] || 'Pending'),
            remarks: defaultRemark(normalizeRequestStatus(row[4] || 'Pending')),
            remarksVersion: 0,
            remarksUpdatedBy: '',
            remarksUpdatedAt: '',
            history: ['Imported request record.'],
          }
        : {
            ...row,
            box: String(row.box || '').replace(/[^\d]/g, ''),
            address: normalizeAddress(row),
            remarks: normalizeRemark(row),
            package: migratePackagePlan(row.package),
            status: normalizeRequestStatus(row.status || 'Pending'),
            remarksVersion: Number(row.remarksVersion || 0),
            remarksUpdatedBy: String(row.remarksUpdatedBy || ''),
            remarksUpdatedAt: String(row.remarksUpdatedAt || ''),
          },
    )
    .sort((a, b) => Number(a.box || 0) - Number(b.box || 0))
    .map((row, index) => ({
      ...row,
      box: String(index + 1).padStart(3, '0'),
      id: row.id || `ACT-${String(index + 1).padStart(3, '0')}`,
      remarksVersion: Number(row.remarksVersion || 0),
      remarksUpdatedBy: String(row.remarksUpdatedBy || ''),
      remarksUpdatedAt: String(row.remarksUpdatedAt || ''),
    }));
}

function requestIdFromRow(rows, id) {
  const match = rows.find((row) => row.id === id);
  return match?.requestId || id;
}

function normalizeCustomers(rows, requests = []) {
  return rows
    .filter((row) => row)
    .filter((row) => !excludedCustomerNames.has(normalizeCustomerName(row.name)))
    .map((row) => ({
      ...row,
      box: String(row.box || '').replace(/[^\d]/g, ''),
      address: normalizeAddress(row),
      remarks: normalizeRemark(row),
      package: migratePackagePlan(row.package),
      status: normalizeRequestStatus(row.status || 'Pending'),
      remarksVersion: Number(row.remarksVersion || 0),
      remarksUpdatedBy: String(row.remarksUpdatedBy || ''),
      remarksUpdatedAt: String(row.remarksUpdatedAt || ''),
    }))
    .reduce((accumulator, row) => {
      // Keep customer records aligned with requests by preserving stable IDs first.
      // Name-only deduping can collapse legitimate separate activation records.
      const key =
        String(row.requestId || '').trim() ||
        String(row.id || '').trim() ||
        normalizeCustomerName(row.name);
      const existingIndex = accumulator.findIndex((item) => {
        const itemKey =
          String(item.requestId || '').trim() ||
          String(item.id || '').trim() ||
          normalizeCustomerName(item.name);
        return itemKey === key;
      });

      if (existingIndex === -1) {
        accumulator.push(row);
        return accumulator;
      }

      const existing = accumulator[existingIndex];
      const existingHistory = Array.isArray(existing.history) ? existing.history : [];
      const incomingHistory = Array.isArray(row.history) ? row.history : [];
      const mergedHistory = Array.from(new Set([...existingHistory, ...incomingHistory]));
      const preservedDate = existing.date || row.date || today();
      const preservedBox = existing.box || row.box || '';
      const preservedRequestId = existing.requestId || row.requestId || '';
      const mergedStatus = normalizeRequestStatus(row.status || existing.status || 'Pending');

      accumulator[existingIndex] = {
        ...row,
        id: existing.id || row.id,
        date: preservedDate,
        box: preservedBox,
        name: existing.name || row.name,
        branch: existing.branch || row.branch,
        requestId: preservedRequestId,
        package: row.package || existing.package || defaultPlans[0],
        status: mergedStatus,
        history: mergedHistory,
        remarks: row.remarks || existing.remarks || '',
        remarksVersion: Math.max(Number(existing.remarksVersion || 0), Number(row.remarksVersion || 0)),
        remarksUpdatedBy: row.remarksUpdatedBy || existing.remarksUpdatedBy || '',
        remarksUpdatedAt: row.remarksUpdatedAt || existing.remarksUpdatedAt || '',
      };

      return accumulator;
    }, [])
    .sort((a, b) => Number(a.box || 0) - Number(b.box || 0))
    .map((row, index) => ({
      ...row,
      box: String(index + 1).padStart(3, '0'),
      id: row.id || `CUS-${String(index + 1).padStart(3, '0')}`,
      remarksVersion: Number(row.remarksVersion || 0),
      remarksUpdatedBy: String(row.remarksUpdatedBy || ''),
      remarksUpdatedAt: String(row.remarksUpdatedAt || ''),
    }));
}

function nextCustomerBox(rows) {
  const highest = rows.reduce((max, row) => {
    const value = Number(String(row?.box || '').replace(/[^\d]/g, ''));
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);
  return String(highest + 1).padStart(3, '0');
}

function normalizeServicePlans(rows) {
  return Array.from(
    new Set(
      (Array.isArray(rows) ? rows : [rows])
        .map((item) => migratePackagePlan(item))
        .filter(Boolean),
    ),
  );
}

function groupPlansByCategory(rows) {
  const groups = new Map();
  const categoryOrder = ['Bundle', 'Internet', 'Cable TV', 'TV Extension', 'Business', 'Custom'];

  (Array.isArray(rows) ? rows : []).forEach((plan) => {
    const category = String(plan?.category || inferServicePlanCategory(plan?.name) || 'Custom').trim() || 'Custom';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(plan);
  });

  return Array.from(groups.entries())
    .sort(([leftCategory], [rightCategory]) => {
      const leftIndex = categoryOrder.indexOf(leftCategory);
      const rightIndex = categoryOrder.indexOf(rightCategory);
      if (leftIndex !== -1 || rightIndex !== -1) {
        return (leftIndex === -1 ? categoryOrder.length : leftIndex) -
          (rightIndex === -1 ? categoryOrder.length : rightIndex);
      }
      return leftCategory.localeCompare(rightCategory);
    })
    .map(([category, plans]) => ({
      category,
      plans: plans
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''))),
    }));
}

function migratePackagePlan(value) {
  const plan = String(value || '').trim();
  if (!plan) {
    return defaultPlans[0];
  }

  const exactMatch = defaultPlans.find(
    (item) => normalizeCustomerName(item) === normalizeCustomerName(plan),
  );
  if (exactMatch) {
    return exactMatch;
  }

  const normalized = plan.toLowerCase();
  if (
    normalized.includes('cable') ||
    normalized.includes('home bundle') ||
    normalized.includes('basic') ||
    normalized.includes('premium') ||
    normalized.includes('standard')
  ) {
    return defaultPlans[0];
  }

  const businessPlan = defaultPlans.find((item) => item.toLowerCase().includes('business'));
  if (normalized.includes('business') && businessPlan) {
    return businessPlan;
  }

  if (normalized.includes('fiber')) {
    return businessPlan || defaultPlans[1] || defaultPlans[0];
  }

  return plan;
}

function generateBranchUserEmail(name, branch, users) {
  const baseName = slugify(name) || 'branch.user';
  const baseBranch = slugify(branch) || 'branch';
  const candidateBase = `${baseName}.${baseBranch}`;
  const existing = new Set(users.map((user) => String(user.email || '').toLowerCase()));
  let email = `${candidateBase}@barbazacoop.com`;
  let suffix = 2;

  while (existing.has(email.toLowerCase())) {
    email = `${candidateBase}${suffix}@barbazacoop.com`;
    suffix += 1;
  }

  return email;
}

function generateBranchUserPassword(name, branch, users) {
  const namePart = slugify(name).slice(0, 4) || 'user';
  const branchPart = slugify(branch).slice(0, 4) || 'coop';
  return `${namePart}${branchPart}${String(users.length + 1).padStart(2, '0')}!`;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .replace(/\.\.+/g, '.');
}

function Icon({ name, className = '' }) {
  const blue = '#153f9b';
  const red = '#ed1f24';
  const yellow = '#f5bf17';

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.8" fill={blue} />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" fill={red} />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" fill={blue} />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8" fill={blue} />
      </>
    ),
    'clipboard-list': (
      <>
        <rect x="6" y="4" width="12" height="16" rx="2.2" fill="none" stroke={blue} strokeWidth="1.8" />
        <rect x="9" y="2.5" width="6" height="4" rx="1.5" fill={red} />
        <rect x="10.5" y="1.5" width="3" height="3" rx="1.1" fill={red} />
        <path d="M9 10h6" stroke={blue} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M9 13h4.7" stroke={blue} strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="17.2" cy="17.2" r="2.4" fill={yellow} />
        <path d="m16.2 17.2.7.8 1.4-1.7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    users: (
      <>
        <circle cx="12" cy="12" r="5.1" fill={blue} />
        <circle cx="12" cy="7" r="2.6" fill={blue} />
        <path d="M7.3 20.2v-1a4.8 4.8 0 0 1 4.8-4.8h0.6a4.8 4.8 0 0 1 4.8 4.8v1" fill={blue} />
        <circle cx="5.2" cy="10" r="1.9" fill={red} />
        <path d="M3.7 20v-1.1a3.8 3.8 0 0 1 2.9-3.7" fill={red} />
        <circle cx="18.8" cy="10" r="1.9" fill={yellow} />
        <path d="M20.3 20v-1.1a3.8 3.8 0 0 0-2.9-3.7" fill={yellow} />
      </>
    ),
    wrench: (
      <>
        <path d="M13.5 3.7a4.8 4.8 0 0 0-5.7 6.2L3.8 14v2.2h2.2l4.1-4.1a4.8 4.8 0 0 0 6.2-5.7l-2.4.8-1.7-1.7.8-1.8Z" fill={blue} />
        <circle cx="15.8" cy="8.2" r="1.2" fill={yellow} />
        <path d="M14.8 14.2l4.8 4.8" stroke={red} strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    wifi: (
      <>
        <path d="M3.1 8.5a14 14 0 0 1 17.8 0" stroke={blue} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M5.9 11.8a10.2 10.2 0 0 1 12.2 0" stroke={blue} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M9.1 15.2a5.6 5.6 0 0 1 5.8 0" stroke={blue} strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="12" cy="19" r="1.6" fill={red} />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" stroke={blue} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M4 19h16" stroke={blue} strokeWidth="1.9" strokeLinecap="round" />
        <rect x="5.8" y="13.2" width="2.3" height="5.8" rx="0.9" fill={blue} />
        <rect x="10.4" y="9.5" width="2.3" height="9.5" rx="0.9" fill={blue} />
        <rect x="15" y="6.7" width="2.3" height="12.3" rx="0.9" fill={blue} />
        <path d="M5.6 9.2 10.4 7l4.6 2.1 4.4-4.4" stroke={red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5.6" cy="9.2" r="1.1" fill={red} />
        <circle cx="10.4" cy="7" r="1.1" fill={red} />
        <circle cx="15" cy="9.1" r="1.1" fill={red} />
        <circle cx="19.4" cy="2.7" r="1.1" fill={red} />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="4.4" fill={blue} />
        <circle cx="12" cy="12" r="2" fill="white" />
        <circle cx="12" cy="12" r="1.1" fill={red} />
        <path d="M12 3.1v2.2" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 18.7v2.2" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M3.1 12h2.2" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M18.7 12h2.2" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M5.3 5.3l1.6 1.6" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17.1 17.1l1.6 1.6" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M18.7 5.3l-1.6 1.6" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M6.9 17.1l-1.6 1.6" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    plus: (
      <>
        <circle cx="12" cy="12" r="7.2" fill={yellow} />
        <path d="M12 7.3v9.4" stroke={blue} strokeWidth="2.1" strokeLinecap="round" />
        <path d="M7.3 12h9.4" stroke={red} strokeWidth="2.1" strokeLinecap="round" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke={blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.8" fill={red} />
      </>
    ),
    trash: (
      <>
        <path d="M4.5 6.8h15" stroke={blue} strokeWidth="1.8" strokeLinecap="round" />
        <rect x="8.4" y="4" width="7.2" height="2.7" rx="1.1" fill={red} />
        <rect x="6.8" y="7" width="10.4" height="13" rx="1.8" fill={blue} />
        <path d="M10 10.5v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 10.5v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    'user-circle': (
      <>
        <circle cx="12" cy="12" r="9" fill={blue} />
        <circle cx="12" cy="10" r="3" fill="white" />
        <path d="M6.8 18.2A7.5 7.5 0 0 1 12 16a7.5 7.5 0 0 1 5.2 2.2" fill="white" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="4" width="10.5" height="14.5" rx="2" fill="white" stroke={blue} strokeWidth="1.8" />
        <path d="M7 15H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke={red} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 8h5" stroke={blue} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 11h5" stroke={blue} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 14h3.7" stroke={blue} strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    moon: (
      <>
        <path d="M21 12.7A8.5 8.5 0 1 1 11.3 3a7 7 0 0 0 9.7 9.7Z" fill={blue} />
        <circle cx="14.8" cy="7" r="1.3" fill={yellow} />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4.2" fill={yellow} />
        <path d="M12 2v2.4" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 19.6V22" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4.9 4.9l1.7 1.7" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17.4 17.4l1.7 1.7" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M2 12h2.4" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M19.6 12H22" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4.9 19.1l1.7-1.7" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17.4 6.6l1.7-1.7" stroke={blue} strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    bell: (
      <>
        <path d="M8.3 17.2h7.4c-1.1-.9-1.8-2.5-1.8-4.1v-3.2a3.9 3.9 0 1 0-7.8 0v3.2c0 1.6-.7 3.2-1.8 4.1h4Z" fill={blue} />
        <circle cx="17.1" cy="6.5" r="2" fill={yellow} />
        <circle cx="12" cy="19" r="1.3" fill={red} />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 19 6v5c0 5-3.5 8.7-7 10-3.5-1.3-7-5-7-10V6l7-3Z" fill={blue} />
        <path d="M9.5 12.6 11.1 14l2.9-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    save: (
      <>
        <path d="M5 4h11l3 3v13H5z" fill={blue} />
        <path d="M8 4v6h8V4" fill="white" />
        <path d="M8 20v-6h8v6" fill="white" />
        <rect x="8.3" y="15.7" width="7.4" height="3.1" rx="0.9" fill={yellow} />
      </>
    ),
    'log-in': (
      <>
        <path d="M3.8 4.3h9.8a2 2 0 0 1 2 2v11.4a2 2 0 0 1-2 2H3.8" fill={blue} />
        <path d="M11.5 12H3" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9.8 8.3 13.4 12l-3.6 3.7" fill="none" stroke={red} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.4 6.2v11.6" stroke={yellow} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M16.2 12h4.2" stroke={yellow} strokeWidth="1.9" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg
      className={`app-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      role="img"
    >
      {icons[name] || icons.dashboard}
    </svg>
  );
}

export default App;


