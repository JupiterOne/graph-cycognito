import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { IpRange } from '../../types';

export function createIpRangeAssetEntity(asset: IpRange): Entity {
  const { tags, ...other } = asset;
  // Reusing this somehow leads to type problems when assigning to source
  const sourceObject = { ...other, tagList: tags };
  const ipRange = asset.id.split('/')[1];

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
        scanStatus: asset.scan_status,
        alive: asset.alive,
        ipRange,
        name: ipRange,
      },
    },
  });
}
