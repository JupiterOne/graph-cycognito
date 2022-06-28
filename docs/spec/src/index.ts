import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { ipSpec } from './asset-ip';
import { domainSpec } from './asset-domain';
import { certificateSpec } from './asset-certificate';
import { webAppSpec } from './asset-web-app';
import { ipRangeSpec } from './asset-ip-range';
import { issueSpec } from './issue';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...ipSpec,
    ...domainSpec,
    ...certificateSpec,
    ...webAppSpec,
    ...ipRangeSpec,
    ...issueSpec,
  ],
};
