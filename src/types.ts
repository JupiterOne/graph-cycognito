export enum SecurityRating {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
}

export enum IssueSeverity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface ReportId {
  report_id: string;
}

interface Port {
  status: string;
  port: number;
  protocol: string;
}

export enum AssetType {
  IP = 'ip',
  DOMAIN = 'domain',
  CERTIFICATE = 'cert',
  WEB_APP = 'webapp',
  IP_RANGE = 'iprange',
}

export interface Asset {
  id: string;
  owned_by: string | null;
  owners: string[];
  tags: string[];
  hosting_type: string;
  investigation_status: string;
  scan_status: string;
  security_rating: SecurityRating | null;
  issues_count: number;
  severe_issues_count: number;
  first_seen: string;
  last_seen: string;
  comment: string | null;
}

export interface Ip extends Asset {
  alive: boolean;
  domains: string[];
  ip: string;
  from_rotating: string;
  open_ports: Port[];
  closed_ports: Port[];
  locations: string[];
  type: AssetType.IP;
}

export interface Domain extends Asset {
  ip_names: string[];
  sub_domains: string[];
  domain: string;
  type: AssetType.DOMAIN;
}

export interface Certificate extends Asset {
  subject_alt_names: string[];
  domains: string[];
  creation_time: string | null;
  ip_names: string[];
  subject_organization: string;
  issuer_state: string;
  subject_country: string;
  issuer_country: string;
  subject_common_name: string;
  issuer_locality: string;
  subject_organization_unit: string;
  issuer_alt_names: string[];
  signature_algorithm: string;
  subject_locality: string;
  issuer_organization_unit: string;
  expiration_time: string;
  issuer_organization: string;
  issuer_common_name: string;
  subject_state: string;
  locations: string[];
  type: AssetType.CERTIFICATE;
}

export interface WebApp extends Asset {
  type: AssetType.WEB_APP;
}

export interface IpRange
  extends Omit<
    Asset,
    | 'security_rating'
    | 'issues_count'
    | 'severe_issues_count'
    | 'first_seen'
    | 'last_seen'
  > {
  alive: boolean;
  type: AssetType.IP_RANGE;
  status: string;
}

export type AssetData = Ip | Domain | Certificate | WebApp | IpRange;

export interface Issue {
  affected_asset: string;
  owned_by: string | null;
  last_detected: string;
  references: string[];
  threat: string;
  tags: string[];
  id: string;
  owners: string[];
  issue_status: string;
  issue_id: string;
  first_detected: string;
  summary: string;
  resolved_at: string | null;
  investigation_status: string;
  severity_score: number;
  locations: string[];
  detection_complexity: string;
  exploitation_method: string;
  title: string;
  exploitation_score: number;
  issue_type: string;
  comment: string | null;
  severity: IssueSeverity;
  remediation_steps: string[];
  potential_impact: string[];
}
