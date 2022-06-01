import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const issueSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/issues
     * PATTERN: Fetch Entities
     */
    id: 'fetch-issues',
    name: 'Fetch Issue Details',
    entities: [
      {
        resourceName: 'Issue',
        _type: 'cycognito_issue',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'cycognito_account_has_issue',
        sourceType: 'cycognito_account',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_issue',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://api.platform.cycognito.com/v1/issues
     * PATTERN: Build Child Relationships
     */
    id: 'build-asset-has-issue-relationships',
    name: 'Build Asset Has Issue Relationships',
    entities: [],
    relationships: [
      {
        _type: 'cycognito_asset_ip_has_issue',
        sourceType: 'cycognito_asset_ip',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_issue',
      },
      {
        _type: 'cycognito_asset_domain_has_issue',
        sourceType: 'cycognito_asset_domain',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_issue',
      },
      {
        _type: 'cycognito_asset_certificate_has_issue',
        sourceType: 'cycognito_asset_certificate',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_issue',
      },
      {
        _type: 'cycognito_asset_web_app_has_issue',
        sourceType: 'cycognito_asset_web_app',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_issue',
      },
      {
        _type: 'cycognito_asset_ip_range_has_issue',
        sourceType: 'cycognito_asset_ip_range',
        _class: RelationshipClass.HAS,
        targetType: 'cycognito_issue',
      },
    ],
    dependsOn: [
      'fetch-issues',
      'fetch-ip-assets',
      'fetch-domain-assets',
      'fetch-certificate-assets',
      'fetch-web-app-assets',
      'fetch-ip-range-assets',
    ],
    implemented: true,
  },
];
