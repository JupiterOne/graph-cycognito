import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const domainSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/domain
     * PATTERN: Fetch Entities
     */
    id: 'fetch-domain-assets',
    name: 'Fetch Domain Asset Details',
    entities: [
      {
        resourceName: 'Domain',
        _type: 'cycognito_asset_domain',
        _class: ['Domain'],
      },
    ],
    relationships: [
      {
        _type: 'cycognito_account_has_asset_domain',
        sourceType: 'cycognito_account',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_domain',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/domain
     * PATTERN: Build Child Relationships
     */
    id: 'build-domain-has-ip-relationships',
    name: 'Build Domain Has IP Relationships',
    entities: [],
    relationships: [
      {
        _type: 'cycognito_asset_domain_has_ip',
        sourceType: 'cycognito_asset_domain',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_ip',
      },
    ],
    dependsOn: ['fetch-domain-assets', 'fetch-ip-assets'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/domain
     * PATTERN: Build Child Relationships
     */
    id: 'build-domain-contains-domain-relationships',
    name: 'Build Domain Contains Sub-domain Relationships',
    entities: [],
    relationships: [
      {
        _type: 'cycognito_asset_domain_contains_domain',
        sourceType: 'cycognito_asset_domain',
        _class: RelationshipClass.CONTAINS,
        targetType: 'cycognito_asset_domain',
      },
    ],
    dependsOn: ['fetch-domain-assets'],
    implemented: true,
  },
];
