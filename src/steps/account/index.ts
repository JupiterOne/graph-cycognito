import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY, IntegrationSteps, Entities } from '../constants';
import { createAccountEntity } from './converter';

export async function fetchAccountDetails({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.addEntity(createAccountEntity());

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];
