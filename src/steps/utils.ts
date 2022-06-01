import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { Asset } from '../types';

export function createGenericAssetSchema() {
  return {
    id: { type: 'string' },
    ownedBy: { type: 'string' },
    owners: { type: 'array', items: { type: 'string' } },
    tagList: { type: 'array', items: { type: 'string' } },
    hostingType: { type: 'string' },
    investigationStatus: { type: 'string' },
    scanStatus: { type: 'string' },
    securityRating: { type: 'string' },
    issuesCount: { type: 'number' },
    severeIssuesCount: { type: 'number' },
    firstSeen: { type: 'number' },
    lastSeen: { type: 'number' },
  };
}

export function parseAssetProperties<T extends Asset>(asset: T) {
  return {
    id: asset.id,
    ownedBy: asset.owned_by,
    owners: asset.owners,
    tagList: asset.tags,
    hostingType: asset.hosting_type,
    investigationStatus: asset.investigation_status,
    scanStatus: asset.scan_status,
    securityRating: asset.security_rating,
    issuesCount: asset.issues_count,
    severeIssuesCount: asset.severe_issues_count,
    firstSeen: parseTimePropertyValue(asset.first_seen),
    lastSeen: parseTimePropertyValue(asset.last_seen),
  };
}
