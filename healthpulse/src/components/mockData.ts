// Synthetic/mock data and generators for the prototype dashboard

export const getStatusCardsData = () => ([
  {
    title: 'Bed Occupancy',
    value: `${Math.floor(80 + Math.random() * 15)}%`,
    icon: '🛏️',
    color: '#2791D3',
    description: 'Current hospital bed utilization',
  },
  {
    title: 'Medication Stockouts',
    value: Math.floor(Math.random() * 3),
    icon: '💊',
    color: '#DC3545',
    description: 'Facilities with critical shortages',
  },
  {
    title: 'Carbon Emissions',
    value: `${(20 + Math.random() * 10).toFixed(1)} tCO₂e`,
    icon: '🌱',
    color: '#28A745',
    description: 'Monthly supply chain emissions',
  },
  {
    title: 'Patient Admissions (24h)',
    value: Math.floor(100 + Math.random() * 40),
    icon: '🏥',
    color: '#FFC107',
    description: 'New admissions in last 24h',
  },
]);

export type AlertCategory = 'clinical' | 'operational' | 'supply' | 'staffing' | 'sustainability' | 'it';
export type AlertStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved';
export interface AlertComment {
  user: string;
  time: string;
  comment: string;
}
export interface CriticalAlert {
  id: number;
  type: string;
  category: AlertCategory;
  message: string;
  severity: string;
  time: string;
  facility: string;
  district?: string;
  metric: string;
  value: number;
  threshold: number;
  context: string;
  suggestedAction: string;
  status: AlertStatus;
  assignedTo?: string;
  comments?: AlertComment[];
  trendCount?: number;
  rootCause?: string;
  impact?: string;
  archived?: boolean;
}

export const getCriticalAlerts = () => ([
  {
    id: 1,
    type: 'Supply Chain',
    category: 'supply' as AlertCategory,
    message: 'Urgent: Medication stockout at Al Noor Hospital',
    severity: 'critical',
    time: '2m ago',
    facility: 'Al Noor Hospital',
    district: 'Deira',
    metric: 'Medication Stock',
    value: 0,
    threshold: 5,
    suggestedAction: 'Dispatch emergency supply delivery',
    context: 'Stockout detected for Amoxicillin and Paracetamol. Last delivery: 5 days ago.',
    status: 'new' as AlertStatus,
    assignedTo: '',
    comments: [
      { user: 'Pharmacy', time: '1m ago', comment: 'Requisition sent.' }
    ],
    trendCount: 3,
    rootCause: 'Delayed vendor shipment.',
    impact: 'Risk of treatment interruption.',
    archived: false
  },
  {
    id: 2,
    type: 'Staffing',
    category: 'staffing' as AlertCategory,
    message: 'Staffing shortage in ER',
    severity: 'critical',
    time: '10m ago',
    facility: 'City Hospital',
    district: 'Bur Dubai',
    metric: 'Staffing Level',
    value: 8,
    threshold: 12,
    suggestedAction: 'Call in backup staff',
    context: 'ER nurse count below safe minimum. High patient inflow.',
    status: 'in_progress' as AlertStatus,
    assignedTo: 'HR',
    comments: [
      { user: 'HR', time: '5m ago', comment: 'Contacted temp agency.' }
    ],
    trendCount: 4,
    rootCause: 'Unexpected sick leaves.',
    impact: 'Patient wait times increased.',
    archived: false
  },
  {
    id: 3,
    type: 'Sustainability',
    category: 'sustainability' as AlertCategory,
    message: 'Cold chain inefficiency detected',
    severity: 'warning',
    time: '3h ago',
    facility: 'District 2',
    district: 'District 2',
    metric: 'Cold Chain Efficiency',
    value: 82,
    threshold: 90,
    suggestedAction: 'Inspect refrigeration units',
    context: 'Temperature excursions logged twice this week.',
    status: 'resolved' as AlertStatus,
    assignedTo: 'Facilities',
    comments: [
      { user: 'Facilities', time: '1h ago', comment: 'Units repaired.' }
    ],
    trendCount: 2,
    rootCause: 'Aging refrigeration equipment.',
    impact: 'Potential vaccine spoilage.',
    archived: true
  },
  {
    id: 4,
    type: 'IT',
    category: 'it' as AlertCategory,
    message: 'Pharmacy system outage',
    severity: 'critical',
    time: '1h ago',
    facility: 'Al Noor Hospital',
    district: 'Deira',
    metric: 'System Uptime',
    value: 0,
    threshold: 99,
    suggestedAction: 'Escalate to IT vendor',
    context: 'No access to e-prescribing. Manual process in place.',
    status: 'acknowledged' as AlertStatus,
    assignedTo: 'IT Lead',
    comments: [
      { user: 'IT Lead', time: '15m ago', comment: 'Vendor notified, awaiting response.' }
    ],
    trendCount: 1,
    rootCause: 'Database server failure.',
    impact: 'Delays in medication dispensing.',
    archived: false
  },
  {
    id: 5,
    type: 'Operations',
    category: 'operational' as AlertCategory,
    message: 'Bed occupancy exceeds 95% in District 3',
    severity: 'warning',
    time: '10m ago',
    facility: 'District 3',
    district: 'District 3',
    metric: 'Bed Occupancy',
    value: 97,
    threshold: 95,
    suggestedAction: 'Initiate discharge planning and open surge beds',
    context: 'Occupancy trending up for 3 days. Flu admissions increased by 18%.',
    status: 'in_progress' as AlertStatus,
    assignedTo: 'Bed Manager',
    comments: [
      { user: 'Bed Manager', time: 'just now', comment: 'Surge beds ready.' }
    ],
    trendCount: 3,
    rootCause: 'Flu surge and delayed discharges.',
    impact: 'Overflow risk to ER and ICU.',
    archived: false
  },
]);

export const getRecommendedActions = () => ([
  {
    id: 1,
    action: 'Reallocate 5 nurses to ER (District 3) to address surge',
  },
  {
    id: 2,
    action: 'Dispatch emergency supply delivery to Al Noor Hospital',
  },
  {
    id: 3,
    action: 'Activate cold chain optimization for vaccine delivery',
  },
]);

export const getPatientFlowData = () => ({
  admissions: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(),
    value: Math.floor(80 + Math.random() * 30),
  })),
  discharges: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(),
    value: Math.floor(60 + Math.random() * 20),
  })),
  bedUtilization: Math.floor(80 + Math.random() * 15),
});

export const getSustainabilityData = () => ({
  carbon: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(Date.now() - (11 - i) * 2628000000).toLocaleString('default', { month: 'short' }),
    value: +(18 + Math.random() * 8).toFixed(1),
  })),
  waste: +(Math.random() * 3).toFixed(2),
  coldChainEfficiency: +(85 + Math.random() * 10).toFixed(1),
});

export const getStaffingData = () => ({
  required: Math.floor(120 + Math.random() * 20),
  available: Math.floor(110 + Math.random() * 20),
  shortage: Math.floor(Math.random() * 10),
});
