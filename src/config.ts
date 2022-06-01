import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessToken: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider Access Token
   */
  accessToken: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.accessToken) {
    throw new IntegrationValidationError(
      'Config requires all of {accessToken}, you can request one from your provider.',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
