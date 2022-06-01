import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Domain } from '../../types';
import { parseCommonAssetProperties } from '../utils';

export function generateDomainIdFromName(domainName: string) {
  return 'domain/' + domainName;
}

export function createDomainAssetEntity(asset: Domain): Entity {
  const { tags, ...other } = asset;
  const sourceObject = { ...other, tagList: tags };

  return createIntegrationEntity({
    entityData: {
      source: sourceObject,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET_DOMAIN._type,
        _class: Entities.ASSET_DOMAIN._class,
        ...parseCommonAssetProperties(asset),
        domainName: asset.domain,
        name: asset.domain,
        subDomains: asset.sub_domains,
        ipNames: asset.ip_names,
      },
    },
  });
}
