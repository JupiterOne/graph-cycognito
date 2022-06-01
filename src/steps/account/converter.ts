import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(): Entity {
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
