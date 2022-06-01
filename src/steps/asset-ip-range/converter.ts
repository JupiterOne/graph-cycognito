import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { IpRange } from '../../types';
import { computeCIDRFromRangeV4 } from '../utils';

export function createIpRangeAssetEntity(asset: IpRange): Entity {
  const { tags, ...other } = asset;
  const sourceObject = { ...other, tagList: tags };

  const ipRange = asset.id.split('/')[1];
  const [fromAddr, toAddr] = ipRange.split('-');

  return createIntegrationEntity({
    entityData: {
      source: sourceObject,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET_IP_RANGE._type,
        _class: Entities.ASSET_IP_RANGE._class,
        id: asset.id,
        ownedBy: asset.owned_by,
        owners: asset.owners,
        tagList: asset.tags,
        hostingType: asset.hosting_type,
        investigationStatus: asset.investigation_status,
        status: asset.status,
        scanStatus: asset.scan_status,
        alive: asset.alive,
        ipRange,
        name: ipRange,
        CIDR: computeCIDRFromRangeV4(fromAddr, toAddr),
        // TODO: Replace with appropriate values if they can be derived
        public: false,
        internal: true,
      },
    },
  });
}
