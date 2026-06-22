export type Role = 'founder' | 'designer' | 'client';
export type AssetStatus =
  | 'brief_received'
  | 'generating'
  | 'internal_review'
  | 'revision_required'
  | 'client_review'
  | 'approved'
  | 'published';
export type AssetType = 'image' | 'video' | 'copy' | 'motion';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type FeedbackIssueType =
  | 'objective_error'
  | 'compliance_issue'
  | 'brand_issue'
  | 'conversion_issue'
  | 'design_improvement'
  | 'new_requirement'
  | 'question';
export type FeedbackPriority = 'critical' | 'required' | 'suggested';

export interface Contact {
  name: string;
  role: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  color: string;
  industry: string;
  contacts: Contact[];
  activeCampaigns: number;
  activeAssets: number;
  approvalRate: number;
  avgRevisions: number;
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  totalAssets: number;
  completedAssets: number;
  description: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  clientId: string;
  campaignId: string;
  designerId: string;
  status: AssetStatus;
  priority: Priority;
  currentVersion: number;
  dueDate: string;
  createdAt: string;
  revisionCount: number;
  previewUrl: string;
  description: string;
}

export interface FeedbackPin {
  id: string;
  assetId: string;
  number: number;
  x: number;
  y: number;
  issueType: FeedbackIssueType;
  priority: FeedbackPriority;
  category: string;
  description: string;
  suggestedFix: string;
  author: string;
  createdAt: string;
  resolved: boolean;
}

export interface Version {
  id: string;
  assetId: string;
  version: number;
  uploadDate: string;
  creator: string;
  notes: string;
  previewUrl: string;
  status: 'approved' | 'rejected' | 'in_review' | 'draft';
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  assetId?: string;
  assetName?: string;
}

export interface Designer {
  id: string;
  name: string;
  initials: string;
  activeAssets: number;
  completedThisMonth: number;
}

// ─── Clients ───────────────────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'Luminary Brands',
    initials: 'LB',
    color: '#7c3aed',
    industry: 'Fashion & Lifestyle',
    contacts: [
      { name: 'Elena Vasquez', role: 'Marketing Director', email: 'elena@luminary.co' },
      { name: 'James Park', role: 'Creative Lead', email: 'james@luminary.co' },
    ],
    activeCampaigns: 3,
    activeAssets: 14,
    approvalRate: 87,
    avgRevisions: 2.3,
  },
  {
    id: 'c2',
    name: 'Nexus Technology',
    initials: 'NT',
    color: '#2563eb',
    industry: 'B2B SaaS',
    contacts: [
      { name: 'Rohan Mehta', role: 'Head of Growth', email: 'rohan@nexustech.io' },
      { name: 'Claire Song', role: 'Brand Manager', email: 'claire@nexustech.io' },
    ],
    activeCampaigns: 2,
    activeAssets: 9,
    approvalRate: 92,
    avgRevisions: 1.8,
  },
  {
    id: 'c3',
    name: 'Verde Organics',
    initials: 'VO',
    color: '#059669',
    industry: 'Food & Wellness',
    contacts: [
      { name: 'Sasha Bloom', role: 'CMO', email: 'sasha@verde.co' },
    ],
    activeCampaigns: 1,
    activeAssets: 6,
    approvalRate: 78,
    avgRevisions: 3.1,
  },
  {
    id: 'c4',
    name: 'Frost & Co',
    initials: 'FC',
    color: '#0891b2',
    industry: 'Financial Services',
    contacts: [
      { name: 'David Frost', role: 'CEO', email: 'david@frostandco.com' },
      { name: 'Mia Torres', role: 'Comms Manager', email: 'mia@frostandco.com' },
    ],
    activeCampaigns: 2,
    activeAssets: 11,
    approvalRate: 95,
    avgRevisions: 1.4,
  },
];

// ─── Campaigns ─────────────────────────────────────────────────────────────

export const campaigns: Campaign[] = [
  {
    id: 'camp1',
    clientId: 'c1',
    name: 'SS25 Editorial Campaign',
    status: 'active',
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    totalAssets: 18,
    completedAssets: 11,
    description: 'Spring/Summer 2025 hero campaign across Instagram, OOH, and lookbook.',
  },
  {
    id: 'camp2',
    clientId: 'c1',
    name: 'Brand Refresh Q3',
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    totalAssets: 9,
    completedAssets: 2,
    description: 'Full visual identity refresh — logo, typography, color system update.',
  },
  {
    id: 'camp3',
    clientId: 'c2',
    name: 'Product Launch — Nexus AI',
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2025-06-15',
    totalAssets: 12,
    completedAssets: 8,
    description: 'Go-to-market assets for the Nexus AI platform launch.',
  },
  {
    id: 'camp4',
    clientId: 'c2',
    name: 'DevConf 2025 Sponsorship',
    status: 'active',
    startDate: '2025-05-15',
    endDate: '2025-07-01',
    totalAssets: 7,
    completedAssets: 4,
    description: 'Conference booth, swag, and digital presence for DevConf.',
  },
  {
    id: 'camp5',
    clientId: 'c3',
    name: 'Summer Harvest Series',
    status: 'active',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    totalAssets: 10,
    completedAssets: 3,
    description: 'Seasonal product launch — print, digital, and in-store displays.',
  },
  {
    id: 'camp6',
    clientId: 'c4',
    name: 'Wealth Management Series',
    status: 'active',
    startDate: '2025-04-15',
    endDate: '2025-09-30',
    totalAssets: 8,
    completedAssets: 6,
    description: 'Premium print and digital campaign targeting HNI investors.',
  },
  {
    id: 'camp7',
    clientId: 'c4',
    name: 'Q4 Client Acquisition',
    status: 'paused',
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    totalAssets: 6,
    completedAssets: 0,
    description: 'End-of-year acquisition push across search, display, and email.',
  },
];

// ─── Designers ─────────────────────────────────────────────────────────────

export const designers: Designer[] = [
  { id: 'd1', name: 'Alex Kim', initials: 'AK', activeAssets: 8, completedThisMonth: 12 },
  { id: 'd2', name: 'Priya Sharma', initials: 'PS', activeAssets: 6, completedThisMonth: 9 },
  { id: 'd3', name: 'Tomás Rivera', initials: 'TR', activeAssets: 5, completedThisMonth: 7 },
];

// ─── Assets ────────────────────────────────────────────────────────────────

export const assets: Asset[] = [
  {
    id: 'a1',
    name: 'SS25 Hero Banner — Instagram',
    type: 'image',
    clientId: 'c1',
    campaignId: 'camp1',
    designerId: 'd1',
    status: 'client_review',
    priority: 'critical',
    currentVersion: 3,
    dueDate: '2025-05-20',
    createdAt: '2025-04-01',
    revisionCount: 3,
    previewUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=800&fit=crop&auto=format',
    description: 'Primary hero banner for the SS25 Instagram launch. 1:1 format, story-ready.',
  },
  {
    id: 'a2',
    name: 'SS25 Campaign Video — 30s',
    type: 'video',
    clientId: 'c1',
    campaignId: 'camp1',
    designerId: 'd2',
    status: 'internal_review',
    priority: 'critical',
    currentVersion: 2,
    dueDate: '2025-05-18',
    createdAt: '2025-04-05',
    revisionCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=600&fit=crop&auto=format',
    description: '30-second brand video for Instagram Reels and paid social.',
  },
  {
    id: 'a3',
    name: 'Lookbook Spread — Page 1',
    type: 'image',
    clientId: 'c1',
    campaignId: 'camp1',
    designerId: 'd1',
    status: 'approved',
    priority: 'high',
    currentVersion: 4,
    dueDate: '2025-05-10',
    createdAt: '2025-03-20',
    revisionCount: 4,
    previewUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop&auto=format',
    description: 'Opening spread for the SS25 print lookbook.',
  },
  {
    id: 'a4',
    name: 'Nexus AI — Product Hero',
    type: 'image',
    clientId: 'c2',
    campaignId: 'camp3',
    designerId: 'd1',
    status: 'revision_required',
    priority: 'critical',
    currentVersion: 2,
    dueDate: '2025-05-22',
    createdAt: '2025-04-10',
    revisionCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=600&fit=crop&auto=format',
    description: 'Hero image for the Nexus AI launch homepage.',
  },
  {
    id: 'a5',
    name: 'Nexus AI — Feature Explainer',
    type: 'motion',
    clientId: 'c2',
    campaignId: 'camp3',
    designerId: 'd3',
    status: 'generating',
    priority: 'high',
    currentVersion: 1,
    dueDate: '2025-05-28',
    createdAt: '2025-04-20',
    revisionCount: 0,
    previewUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&auto=format',
    description: 'Animated explainer for the 3 core AI features.',
  },
  {
    id: 'a6',
    name: 'Verde Summer — OOH Billboard',
    type: 'image',
    clientId: 'c3',
    campaignId: 'camp5',
    designerId: 'd2',
    status: 'brief_received',
    priority: 'medium',
    currentVersion: 0,
    dueDate: '2025-06-05',
    createdAt: '2025-05-01',
    revisionCount: 0,
    previewUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop&auto=format',
    description: 'Large-format outdoor billboard for summer produce launch.',
  },
  {
    id: 'a7',
    name: 'Frost — Wealth Series Print Ad',
    type: 'image',
    clientId: 'c4',
    campaignId: 'camp6',
    designerId: 'd1',
    status: 'approved',
    priority: 'high',
    currentVersion: 3,
    dueDate: '2025-05-15',
    createdAt: '2025-04-01',
    revisionCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&auto=format',
    description: 'Full-page print ad for Frost Wealth Management — WSJ placement.',
  },
  {
    id: 'a8',
    name: 'DevConf — Booth Backdrop',
    type: 'image',
    clientId: 'c2',
    campaignId: 'camp4',
    designerId: 'd2',
    status: 'published',
    priority: 'medium',
    currentVersion: 2,
    dueDate: '2025-05-05',
    createdAt: '2025-04-15',
    revisionCount: 1,
    previewUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&auto=format',
    description: '10x10ft conference booth backdrop with product messaging.',
  },
  {
    id: 'a9',
    name: 'Luminary — Brand Refresh Logo',
    type: 'image',
    clientId: 'c1',
    campaignId: 'camp2',
    designerId: 'd3',
    status: 'internal_review',
    priority: 'critical',
    currentVersion: 2,
    dueDate: '2025-06-10',
    createdAt: '2025-05-01',
    revisionCount: 1,
    previewUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=800&fit=crop&auto=format',
    description: 'Primary and secondary logo lockups for the brand refresh.',
  },
  {
    id: 'a10',
    name: 'Verde — Social Post Series (6pc)',
    type: 'image',
    clientId: 'c3',
    campaignId: 'camp5',
    designerId: 'd3',
    status: 'client_review',
    priority: 'high',
    currentVersion: 2,
    dueDate: '2025-05-30',
    createdAt: '2025-04-25',
    revisionCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=800&fit=crop&auto=format',
    description: 'Six-piece Instagram post series for the summer harvest launch.',
  },
  {
    id: 'a11',
    name: 'Nexus — Email Header Sequence',
    type: 'copy',
    clientId: 'c2',
    campaignId: 'camp3',
    designerId: 'd2',
    status: 'revision_required',
    priority: 'medium',
    currentVersion: 2,
    dueDate: '2025-06-01',
    createdAt: '2025-04-28',
    revisionCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop&auto=format',
    description: 'Three-email onboarding sequence headers for Nexus AI users.',
  },
  {
    id: 'a12',
    name: 'Frost — Digital Display Banner Set',
    type: 'image',
    clientId: 'c4',
    campaignId: 'camp6',
    designerId: 'd1',
    status: 'published',
    priority: 'low',
    currentVersion: 3,
    dueDate: '2025-05-01',
    createdAt: '2025-03-15',
    revisionCount: 3,
    previewUrl: 'https://images.unsplash.com/photo-1642543348745-03b1219733d9?w=800&h=600&fit=crop&auto=format',
    description: 'IAB display banner set — 5 sizes for programmatic.',
  },
];

// ─── Feedback Pins ─────────────────────────────────────────────────────────

export const feedbackPins: FeedbackPin[] = [
  {
    id: 'fp1',
    assetId: 'a1',
    number: 1,
    x: 22,
    y: 18,
    issueType: 'brand_issue',
    priority: 'critical',
    category: 'Logo Placement',
    description: 'Logo is too small and loses legibility at mobile sizes. Per brand guidelines, minimum size is 48px height on digital.',
    suggestedFix: 'Increase logo to minimum 64px height and reposition to top-left with 24px padding.',
    author: 'Elena Vasquez',
    createdAt: '2025-05-10T09:30:00Z',
    resolved: false,
  },
  {
    id: 'fp2',
    assetId: 'a1',
    number: 2,
    x: 55,
    y: 45,
    issueType: 'conversion_issue',
    priority: 'required',
    category: 'CTA Button',
    description: 'The "Shop Now" CTA is barely visible against the background. It needs to be the primary focal point after the model.',
    suggestedFix: 'Use brand primary purple for the CTA button with white text. Add a subtle drop shadow to lift it from the background.',
    author: 'Elena Vasquez',
    createdAt: '2025-05-10T09:45:00Z',
    resolved: false,
  },
  {
    id: 'fp3',
    assetId: 'a1',
    number: 3,
    x: 78,
    y: 25,
    issueType: 'design_improvement',
    priority: 'suggested',
    category: 'Typography',
    description: 'The headline font weight could be bolder — "SS25" should feel assertive, not delicate.',
    suggestedFix: 'Try Bricolage Grotesque 700 weight for the season callout.',
    author: 'James Park',
    createdAt: '2025-05-10T10:15:00Z',
    resolved: false,
  },
  {
    id: 'fp4',
    assetId: 'a1',
    number: 4,
    x: 38,
    y: 72,
    issueType: 'compliance_issue',
    priority: 'critical',
    category: 'Legal',
    description: 'Missing required disclaimer text for the promotional pricing shown. Legal has flagged this as a compliance risk.',
    suggestedFix: 'Add "T&Cs apply" in 8pt minimum below the price callout. Use the approved disclaimer copy from brand doc.',
    author: 'Elena Vasquez',
    createdAt: '2025-05-10T11:00:00Z',
    resolved: true,
  },
  {
    id: 'fp5',
    assetId: 'a1',
    number: 5,
    x: 65,
    y: 82,
    issueType: 'objective_error',
    priority: 'required',
    category: 'Messaging',
    description: 'The sub-headline says "New Collection" but the brief specifies "Summer Drop 2025" as the campaign tagline.',
    suggestedFix: 'Replace "New Collection" with "Summer Drop 2025" to align with campaign messaging across all channels.',
    author: 'James Park',
    createdAt: '2025-05-10T11:30:00Z',
    resolved: false,
  },
];

// ─── Versions ──────────────────────────────────────────────────────────────

export const versions: Version[] = [
  {
    id: 'v1',
    assetId: 'a1',
    version: 1,
    uploadDate: '2025-04-10',
    creator: 'Alex Kim',
    notes: 'Initial version based on brief. Explored 3 concepts, going with the editorial diagonal layout.',
    previewUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&auto=format',
    status: 'rejected',
  },
  {
    id: 'v2',
    assetId: 'a1',
    version: 2,
    uploadDate: '2025-04-22',
    creator: 'Alex Kim',
    notes: 'Revised following internal feedback. Updated typography hierarchy and color palette.',
    previewUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop&auto=format',
    status: 'rejected',
  },
  {
    id: 'v3',
    assetId: 'a1',
    version: 3,
    uploadDate: '2025-05-08',
    creator: 'Alex Kim',
    notes: 'Major revision — switched to full-bleed model photography with overlay treatment. Addressed all V2 feedback.',
    previewUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop&auto=format',
    status: 'in_review',
  },
];

// ─── Activity ──────────────────────────────────────────────────────────────

export const activityItems: ActivityItem[] = [
  { id: 'act1', type: 'version_upload', description: 'uploaded V3', user: 'Alex Kim', timestamp: '2025-05-08T14:30:00Z', assetId: 'a1', assetName: 'SS25 Hero Banner — Instagram' },
  { id: 'act2', type: 'feedback_submitted', description: 'submitted 5 feedback items', user: 'Elena Vasquez', timestamp: '2025-05-10T11:30:00Z', assetId: 'a1', assetName: 'SS25 Hero Banner — Instagram' },
  { id: 'act3', type: 'review_opened', description: 'opened client review cycle', user: 'Maya Chen', timestamp: '2025-05-09T09:00:00Z', assetId: 'a1', assetName: 'SS25 Hero Banner — Instagram' },
  { id: 'act4', type: 'asset_approved', description: 'approved asset', user: 'David Frost', timestamp: '2025-05-07T16:45:00Z', assetId: 'a7', assetName: 'Frost — Wealth Series Print Ad' },
  { id: 'act5', type: 'version_upload', description: 'uploaded V2', user: 'Priya Sharma', timestamp: '2025-05-06T11:00:00Z', assetId: 'a2', assetName: 'SS25 Campaign Video — 30s' },
  { id: 'act6', type: 'revision_approved', description: 'approved revision package', user: 'Maya Chen', timestamp: '2025-05-05T15:20:00Z', assetId: 'a4', assetName: 'Nexus AI — Product Hero' },
  { id: 'act7', type: 'asset_published', description: 'marked as published', user: 'Maya Chen', timestamp: '2025-05-04T10:00:00Z', assetId: 'a8', assetName: 'DevConf — Booth Backdrop' },
  { id: 'act8', type: 'feedback_submitted', description: 'submitted 3 feedback items', user: 'Rohan Mehta', timestamp: '2025-05-03T13:15:00Z', assetId: 'a4', assetName: 'Nexus AI — Product Hero' },
  { id: 'act9', type: 'brief_created', description: 'created brief', user: 'Maya Chen', timestamp: '2025-05-01T09:30:00Z', assetId: 'a6', assetName: 'Verde Summer — OOH Billboard' },
  { id: 'act10', type: 'review_closed', description: 'closed internal review', user: 'Maya Chen', timestamp: '2025-04-30T17:00:00Z', assetId: 'a3', assetName: 'Lookbook Spread — Page 1' },
  { id: 'act11', type: 'version_upload', description: 'uploaded V4', user: 'Alex Kim', timestamp: '2025-04-28T12:00:00Z', assetId: 'a3', assetName: 'Lookbook Spread — Page 1' },
  { id: 'act12', type: 'asset_approved', description: 'approved asset', user: 'Elena Vasquez', timestamp: '2025-04-27T14:30:00Z', assetId: 'a3', assetName: 'Lookbook Spread — Page 1' },
];

// ─── Analytics data ────────────────────────────────────────────────────────

export const approvalRateData = [
  { month: 'Jan', rate: 72 },
  { month: 'Feb', rate: 68 },
  { month: 'Mar', rate: 81 },
  { month: 'Apr', rate: 79 },
  { month: 'May', rate: 88 },
  { month: 'Jun', rate: 85 },
];

export const revisionCountData = [
  { client: 'Luminary', avg: 2.3 },
  { client: 'Nexus', avg: 1.8 },
  { client: 'Verde', avg: 3.1 },
  { client: 'Frost', avg: 1.4 },
];

export const reviewTimeData = [
  { week: 'W1', internal: 1.2, client: 3.4 },
  { week: 'W2', internal: 0.9, client: 2.8 },
  { week: 'W3', internal: 1.5, client: 4.1 },
  { week: 'W4', internal: 1.1, client: 3.0 },
  { week: 'W5', internal: 0.8, client: 2.5 },
  { week: 'W6', internal: 1.3, client: 3.7 },
];

export const feedbackTypeData = [
  { type: 'Brand Issue', count: 34, color: '#7c3aed' },
  { type: 'Design Improvement', count: 28, color: '#3b82f6' },
  { type: 'Objective Error', count: 19, color: '#ef4444' },
  { type: 'Conversion Issue', count: 15, color: '#f59e0b' },
  { type: 'Compliance', count: 9, color: '#06b6d4' },
  { type: 'Other', count: 11, color: '#6b7280' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

export const statusConfig: Record<AssetStatus, { label: string; color: string; bg: string }> = {
  brief_received: { label: 'Brief Received', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  generating: { label: 'Generating', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  internal_review: { label: 'Internal Review', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  revision_required: { label: 'Revision Required', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  client_review: { label: 'Client Review', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  published: { label: 'Published', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
};

export const priorityConfig: Record<Priority, { label: string; color: string }> = {
  critical: { label: 'Critical', color: '#ef4444' },
  high: { label: 'High', color: '#f59e0b' },
  medium: { label: 'Medium', color: '#3b82f6' },
  low: { label: 'Low', color: '#6b7280' },
};

export const issueTypeConfig: Record<FeedbackIssueType, { label: string; color: string }> = {
  objective_error: { label: 'Objective Error', color: '#ef4444' },
  compliance_issue: { label: 'Compliance Issue', color: '#f59e0b' },
  brand_issue: { label: 'Brand Issue', color: '#8b5cf6' },
  conversion_issue: { label: 'Conversion Issue', color: '#06b6d4' },
  design_improvement: { label: 'Design Improvement', color: '#3b82f6' },
  new_requirement: { label: 'New Requirement', color: '#10b981' },
  question: { label: 'Question', color: '#6b7280' },
};

export const feedbackPriorityConfig: Record<FeedbackPriority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  required: { label: 'Required', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  suggested: { label: 'Suggested', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
};

export function getClient(id: string) {
  return clients.find(c => c.id === id);
}

export function getCampaign(id: string) {
  return campaigns.find(c => c.id === id);
}

export function getAsset(id: string) {
  return assets.find(a => a.id === id);
}

export function getDesigner(id: string) {
  return designers.find(d => d.id === id);
}

export function getAssetsByStatus(status: AssetStatus) {
  return assets.filter(a => a.status === status);
}

export function getAssetFeedback(assetId: string) {
  return feedbackPins.filter(fp => fp.assetId === assetId);
}

export function getAssetVersions(assetId: string) {
  return versions.filter(v => v.assetId === assetId);
}
