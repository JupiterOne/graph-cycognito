import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Ip } from '../../types';
import { parseAssetProperties } from '../utils';

export function generateIpIdFromAddress(ipAddress: string) {
  return 'ip/' + ipAddress;
}

export function createIpAssetEntity(asset: Ip): Entity {
  const { tags, ...other } = asset;
  // Reusing this somehow leads to type problems when assigning to source
  const sourceObject = { ...other, tagList: tags };

  return createIntegrationEntity({
    entityData: {
      source: sourceObject,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET_IP._type,
        _class: Entities.ASSET_IP._class,
        ...parseAssetProperties(asset),
        ipAddress: asset.ip,
        name: asset.ip,
        alive: asset.alive,
        domainNames: asset.domain_names,
        locations: asset.locations,
        'openPorts.portNumber': asset.open_ports.map((p) => p.port),
        'openPorts.protocol': asset.open_ports.map((p) => p.protocol),
        'closedPorts.portNumber': asset.closed_ports.map((p) => p.port),
        'closedPorts.protocol': asset.closed_ports.map((p) => p.protocol),
      },
    },
  });
}
