import { Category, Issue, IssueStatus, TimelineEvent } from '../types';

interface SLAConfig {
  acknowledgement: number; // in hours
  resolution: Record<Category, number>; // in hours
}

const DEFAULT_SLA: SLAConfig = {
  acknowledgement: 24,
  resolution: {
    road_damage: 72,
    garbage: 48,
    water_leak: 24,
    broken_infra: 96,
    other: 72,
  },
};

interface WardMapping {
  id: string;
  name: string;
  departmentMappings: Record<Category, { department: string; contractorId: string }>;
}

const MOCK_WARDS: WardMapping[] = [
  {
    id: 'ward_001',
    name: 'Downtown Central',
    departmentMappings: {
      road_damage: { department: 'Public Works', contractorId: 'cont_road_01' },
      garbage: { department: 'Sanitation', contractorId: 'cont_waste_01' },
      water_leak: { department: 'Water Supply', contractorId: 'cont_water_01' },
      broken_infra: { department: 'Urban Development', contractorId: 'cont_infra_01' },
      other: { department: 'General Maintenance', contractorId: 'cont_gen_01' },
    },
  },
  {
    id: 'ward_002',
    name: 'Suburban North',
    departmentMappings: {
      road_damage: { department: 'Public Works', contractorId: 'cont_road_02' },
      garbage: { department: 'Sanitation', contractorId: 'cont_waste_02' },
      water_leak: { department: 'Water Supply', contractorId: 'cont_water_02' },
      broken_infra: { department: 'Urban Development', contractorId: 'cont_infra_02' },
      other: { department: 'General Maintenance', contractorId: 'cont_gen_02' },
    },
  },
];

/**
 * Maps an issue to a ward based on its coordinates.
 * In a real app, this would use spatial queries (GIS).
 * For now, we'll use a simple mock based on latitude.
 */
export function getWardFromLocation(lat: number, lng: number): string {
  // Simple mock: North of 0.5 is Ward 002, South is Ward 001
  // In a real scenario, this would check GeoJSON boundaries
  return lat > 0 ? 'ward_002' : 'ward_001';
}

export function getWardName(wardId: string): string {
  const ward = MOCK_WARDS.find(w => w.id === wardId);
  return ward ? ward.name : 'Unknown Ward';
}

/**
 * Maps an issue to a department and contractor based on ward and category.
 */
export function getResponsibility(wardId: string, category: Category) {
  const ward = MOCK_WARDS.find(w => w.id === wardId);
  if (!ward) return { department: 'General Services', contractorId: 'default_contractor' };

  return ward.departmentMappings[category] || { department: 'General Services', contractorId: 'default_contractor' };
}

/**
 * Calculates the SLA deadline based on the issue category and creation time.
 */
export function calculateSLADeadline(category: Category, timestamp: number): number {
  const resolutionHours = DEFAULT_SLA.resolution[category] || DEFAULT_SLA.resolution.other;
  return timestamp + resolutionHours * 60 * 60 * 1000;
}

/**
 * Enriches an issue with responsibility and SLA data.
 */
export function enrichIssue(issue: Partial<Issue>): Partial<Issue> {
  if (!issue.latitude || !issue.longitude || !issue.category) return issue;

  const wardId = getWardFromLocation(issue.latitude, issue.longitude);
  const { department, contractorId } = getResponsibility(wardId, issue.category);
  const slaDeadline = calculateSLADeadline(issue.category, issue.timestamp || Date.now());

  const initialTimeline: TimelineEvent[] = [
    {
      id: `evt_${Date.now()}`,
      status: 'open',
      timestamp: issue.timestamp || Date.now(),
      description: 'Issue reported and filed.',
      updatedBy: 'system',
    },
  ];

  return {
    ...issue,
    status: 'open',
    ward: wardId,
    department,
    contractorId,
    slaDeadline,
    timeline: initialTimeline,
  };
}

/**
 * Checks if an issue is overdue based on current time.
 */
export function isOverdue(issue: Issue): boolean {
  if (issue.status === 'resolved') return false;
  return Date.now() > (issue.slaDeadline || 0);
}

export const MOCK_CONTRACTORS = [
  { id: 'cont_road_01', name: 'Metro Paving Co.' },
  { id: 'cont_waste_01', name: 'CleanCity Solutions' },
  { id: 'cont_water_01', name: 'AquaFlow Utilities' },
  { id: 'cont_infra_01', name: 'Urban Build Ltd.' },
  { id: 'cont_gen_01', name: 'CityCare Services' },
  { id: 'cont_road_02', name: 'North Road Maintenance' },
  { id: 'cont_waste_02', name: 'GreenWaste Management' },
  { id: 'cont_water_02', name: 'PureWater Systems' },
  { id: 'cont_infra_02', name: 'Skyline Construction' },
  { id: 'cont_gen_02', name: 'Regional Maintenance' },
];

export function getContractorName(id: string): string {
  return MOCK_CONTRACTORS.find(c => c.id === id)?.name || 'Unknown Contractor';
}
