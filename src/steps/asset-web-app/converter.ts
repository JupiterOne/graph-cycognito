import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import ip from 'ip';

import { Entities } from '../constants';
import { WebApp } from '../../types';
import { parseAssetProperties } from '../utils';

export function createWebAppAssetEntity(asset: WebApp): Entity {
  const { tags, ...other } = asset;
  // Reusing this somehow leads to type problems when assigning to source
  const sourceObject = { ...other, tagList: tags };
  const address = asset.id.split('/')[1];
  const addressType =
    ip.isV4Format(address) || ip.isV6Format(address) ? 'ip' : 'domain';

  return createIntegrationEntity({
    entityData: {
      source: sourceObject,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET_WEB_APP._type,
        _class: Entities.ASSET_WEB_APP._class,
        ...parseAssetProperties(asset),
        name: asset.id,
        address,
        addressType,
      },
    },
  });
}
