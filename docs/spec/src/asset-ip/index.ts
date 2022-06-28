import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const ipSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/ip
     * PATTERN: Fetch Entities
     */
    id: 'fetch-ip-assets',
    name: 'Fetch IP Asset Details',
    entities: [
      {
        resourceName: 'IP',
        _type: 'cycognito_asset_ip',
        _class: ['IpAddress'],
      },
    ],
    relationships: [
      {
        _type: 'cycognito_account_has_asset_ip',
        sourceType: 'cycognito_account',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_ip',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/ip
     * PATTERN: Build Child Relationships
     */
    id: 'build-ip-has-domain-relationships',
    name: 'Build IP Has Domain Relationships',
    entities: [],
    relationships: [
      {
        _type: 'cycognito_asset_ip_has_domain',
        sourceType: 'cycognito_asset_ip',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_domain',
      },
    ],
    dependsOn: ['fetch-ip-assets', 'fetch-domain-assets'],
    implemented: true,
  },
];
