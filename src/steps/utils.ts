import ip from 'ip';
import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { Asset } from '../types';

export function createCommonAssetSchema() {
  return {
    id: { type: 'string' },
    ownedBy: { type: ['string', 'null'] },
    owners: { type: 'array', items: { type: 'string' } },
    tagList: { type: 'array', items: { type: 'string' } },
    hostingType: { type: 'string' },
    investigationStatus: { type: 'string' },
    scanStatus: { type: 'string' },
    securityRating: { type: ['string', 'null'] },
    issuesCount: { type: 'number' },
    severeIssuesCount: { type: 'number' },
    firstSeen: { type: 'number' },
    lastSeen: { type: 'number' },
  };
}

export function parseCommonAssetProperties<T extends Asset>(asset: T) {
  return {
    id: asset.id,
    ownedBy: asset.owned_by,
    owners: asset.owners,
    scanStatus: asset.scan_status,
    tagList: asset.tags,
    hostingType: asset.hosting_type,
    investigationStatus: asset.investigation_status,
    securityRating: asset.security_rating,
    issuesCount: asset.issues_count,
    severeIssuesCount: asset.severe_issues_count,
    firstSeen: parseTimePropertyValue(asset.first_seen),
    lastSeen: parseTimePropertyValue(asset.last_seen),
  };
}

export function computeCIDRFromRangeV4(
  fromAddress: string,
  toAddress: string,
): string {
  if (!ip.isV4Format(fromAddress) || !ip.isV4Format(toAddress)) return '';

  const fromArr = fromAddress.split('.');
  const toArr = toAddress.split('.');
  let bitIdx;
  let prefixLen = 32;

  for (let segmentIdx = 0; segmentIdx < fromArr.length; segmentIdx++) {
    let res = Number(fromArr[segmentIdx]) ^ Number(toArr[segmentIdx]);
    /*
      Find bit location of first change
      1111 0111 0100 0000
  XOR 1111 0111 0000 0000
    = 0000 0000 0100 0000
      We can obtain exact location
      by continuously shifting to the right
      until none are left
     */
    if (res !== 0) {
      bitIdx = 0;
      while (res > 0) {
        res = res >> 1;
        bitIdx += 1;
      }
      prefixLen = 8 * segmentIdx + (8 - bitIdx);
      break;
    }
  }

  return `${fromAddress}/${prefixLen}`;
}
