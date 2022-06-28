import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const ipRangeSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/iprange
     * PATTERN: Fetch Entities
     */
    id: 'fetch-ip-range-assets',
    name: 'Fetch IP Range Asset Details',
    entities: [
      {
        resourceName: 'IP Range',
        _type: 'cycognito_asset_ip_range',
        _class: ['Network'],
      },
    ],
    relationships: [
      {
        _type: 'cycognito_account_has_asset_ip_range',
        sourceType: 'cycognito_account',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_ip_range',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
