import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const certificateSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/cert
     * PATTERN: Fetch Entities
     */
    id: 'fetch-certificate-assets',
    name: 'Fetch Certificate Asset Details',
    entities: [
      {
        resourceName: 'Certificate',
        _type: 'cycognito_asset_certificate',
        _class: ['Certificate'],
      },
    ],
    relationships: [
      {
        _type: 'cycognito_account_has_asset_certificate',
        sourceType: 'cycognito_account',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_certificate',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/cert
     * PATTERN: Build Child Relationships
     */
    id: 'build-certificate-has-ip-relationships',
    name: 'Build Certificate Has IP Relationships',
    entities: [],
    relationships: [
      {
        _type: 'cycognito_asset_certificate_has_ip',
        sourceType: 'cycognito_asset_certificate',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_ip',
      },
    ],
    dependsOn: ['fetch-certificate-assets', 'fetch-ip-assets'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/assets/cert
     * PATTERN: Build Child Relationships
     */
    id: 'build-certificate-has-domain-relationships',
    name: 'Build Certificate Has Domain Relationships',
    entities: [],
    relationships: [
      {
        _type: 'cycognito_asset_certificate_has_domain',
        sourceType: 'cycognito_asset_certificate',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_asset_domain',
      },
    ],
    dependsOn: ['fetch-certificate-assets', 'fetch-domain-assets'],
    implemented: true,
  },
];
