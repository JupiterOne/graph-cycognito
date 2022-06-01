import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(): Entity {
  // TODO: maybe add name to .env and put it as a field here
  return createIntegrationEntity({
    entityData: {
      source: {
        id: 'cycognito-account',
        name: 'CyCognito Account',
      },
      assign: {
        _key: 'cycognito-account',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: 'CyCognito Account',
      },
    },
  });
}
