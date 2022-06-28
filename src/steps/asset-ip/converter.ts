import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Ip } from '../../types';
import { parseCommonAssetProperties } from '../utils';

export function generateIpIdFromAddress(ipAddress: string) {
  return 'ip/' + ipAddress;
}

export function createIpAssetEntity(asset: Ip): Entity {
  const { tags, ...other } = asset;
  const sourceObject = { ...other, tagList: tags };

  return createIntegrationEntity({
    entityData: {
      source: sourceObject,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET_IP._type,
        _class: Entities.ASSET_IP._class,
        ...parseCommonAssetProperties(asset),
        ipAddress: asset.ip,
        name: asset.ip,
        alive: asset.alive,
        domainNames: asset.domain_names,
        locations: asset.locations.filter((loc) => loc !== null),
        'openPorts.portNumbers': asset.open_ports.map((p) => p.port),
        'openPorts.protocols': asset.open_ports.map((p) => p.protocol),
        'closedPorts.portNumbers': asset.closed_ports.map((p) => p.port),
        'closedPorts.protocols': asset.closed_ports.map((p) => p.protocol),
      },
    },
  });
}
