import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const webAppSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/webapp
     * PATTERN: Fetch Entities
     */
    id: 'fetch-web-app-assets',
    name: 'Fetch Web App Asset Details',
    entities: [
      {
        resourceName: 'Web App',
        _type: 'cycognito_asset_web_app',
        _class: ['ApplicationEndpoint'],
      },
    ],
    relationships: [
      {
        _type: 'cycognito_account_has_asset_web_app',
        sourceType: 'cycognito_account',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_web_app',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
