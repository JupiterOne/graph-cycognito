import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { createGenericAssetSchema } from './utils';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export enum IntegrationSteps {
  ACCOUNT = 'fetch-account',
  ISSUES = 'fetch-issues',
  ASSET_IPS = 'fetch-ip-assets',
  ASSET_DOMAINS = 'fetch-domain-assets',
  ASSET_CERTIFICATES = 'fetch-certificate-assets',
  ASSET_wEB_APPS = 'fetch-web-app-assets',
  ASSET_IP_RANGES = 'fetch-ip-range-assets',
  BUILD_ASSET_ISSUE_RELATIONSHIPS = 'build-asset-has-issue-relationships',
  BUILD_CERTIFICATE_IP_RELATIONSHIPS = 'build-certificate-has-ip-relationships',
  BUILD_CERTIFICATE_DOMAIN_RELATIONSHIPS = 'build-certificate-has-domain-relationships',
  BUILD_IP_DOMAIN_RELATIONSHIPS = 'build-ip-has-domain-relationships',
  BUILD_DOMAIN_IP_RELATIONSHIPS = 'build-domain-has-ip-relationships',
  BUILD_DOMAIN_DOMAIN_RELATIONSHIPS = 'build-domain-contains-domain-relationships',
}

export const Entities: Record<
  | 'ACCOUNT'
  | 'ISSUE'
  | 'ASSET_IP'
  | 'ASSET_DOMAIN'
  | 'ASSET_CERTIFICATE'
  | 'ASSET_WEB_APP'
  | 'ASSET_IP_RANGE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'cycognito_account',
    _class: ['Account'],
  },
  ISSUE: {
    resourceName: 'Issue',
    _type: 'cycognito_issue',
    _class: ['Finding'],
    schema: {
      properties: {
        id: { type: 'string' },
        affectedAsset: { type: 'string' },
        ownedBy: { type: 'string' },
        owners: { type: 'array', items: { type: 'string' } },
        tagList: { type: 'array', items: { type: 'string' } },
        locations: { type: 'array', items: { type: 'string' } },
        name: { type: 'string' },
        issueId: { type: 'string' },
        threat: { type: 'string' },
        firstDetected: { type: 'number' },
        lastDetected: { type: 'number' },
        resolvedAt: { type: 'number' },
        references: { type: 'array', items: { type: 'string' } },
        issueStatus: { type: 'string' },
        investigationStatus: { type: 'string' },
        detectionComplexity: { type: 'string' },
        exploitationMethod: { type: 'string' },
        remediationSteps: { type: 'array', items: { type: 'string' } },
        potentialImpact: { type: 'array', items: { type: 'string' } },
        category: { type: 'string' },
        severity: { type: 'string' },
        numericSeverity: { type: 'number' },
        open: { type: 'boolean' },
      },
      required: ['id', 'category', 'severity', 'numericSeverity', 'open'],
    },
  },
  ASSET_IP: {
    resourceName: 'IP',
    _type: 'cycognito_asset_ip',
    _class: ['IpAddress'],
    schema: {
      properties: {
        ...createGenericAssetSchema(),
        ipAddress: { type: 'string' },
        name: { type: 'string' },
        alive: { type: 'boolean' },
        domainNames: { type: 'array', items: { type: 'string' } },
        locations: { type: 'array', items: { type: 'string' } },
        'openPorts.portNumber': { type: 'array', items: { type: 'number' } },
        'openPorts.protocol': { type: 'array', items: { type: 'string' } },
        'closedPorts.portNumber': { type: 'array', items: { type: 'number' } },
        'closedPorts.protocol': { type: 'array', items: { type: 'string' } },
      },
      required: ['id', 'ipAddress'],
    },
  },
  ASSET_DOMAIN: {
    resourceName: 'Domain',
    _type: 'cycognito_asset_domain',
    _class: ['Domain'],
    schema: {
      properties: {
        ...createGenericAssetSchema(),
        domainName: { type: 'string' },
        name: { type: 'string' },
        subDomains: { type: 'array', items: { type: 'string' } },
        ipNames: { type: 'array', items: { type: 'string' } },
      },
      required: ['id', 'domainName'],
    },
  },
  ASSET_CERTIFICATE: {
    resourceName: 'Certificate',
    _type: 'cycognito_asset_certificate',
    _class: ['Certificate'],
    schema: {
      properties: {
        ...createGenericAssetSchema(),
        name: { type: 'string' },
        domainNames: { type: 'array', items: { type: 'string' } },
        ipNames: { type: 'array', items: { type: 'string' } },
        locations: { type: 'array', items: { type: 'string' } },
        signatureAlgorithm: { type: 'string' },
        creationTime: { type: 'number' },
        expirationTime: { type: 'number' },
        'subject.organization': { type: 'string' },
        'subject.organizationUnit': { type: 'string' },
        'subject.commonName': { type: 'string' },
        'subject.altNames': { type: 'array', items: { type: 'string' } },
        'subject.country': { type: 'string' },
        'subject.state': { type: 'string' },
        'subject.locality': { type: 'string' },
        'issuer.organization': { type: 'string' },
        'issuer.organizationUnit': { type: 'string' },
        'issuer.commonName': { type: 'string' },
        'issuer.altNames': { type: 'array', items: { type: 'string' } },
        'issuer.country': { type: 'string' },
        'issuer.state': { type: 'string' },
        'issuer.locality': { type: 'string' },
      },
      required: ['id'],
    },
  },
  ASSET_WEB_APP: {
    resourceName: 'Web App',
    _type: 'cycognito_asset_web_app',
    _class: ['ApplicationEndpoint'],
    schema: {
      properties: {
        ...createGenericAssetSchema(),
        name: { type: 'string' },
        address: { type: 'string' },
      },
      required: ['id', 'address'],
    },
  },
  ASSET_IP_RANGE: {
    resourceName: 'IP Range',
    _type: 'cycognito_asset_ip_range',
    _class: [],
    schema: {
      properties: {
        id: { type: 'string' },
        ownedBy: { type: 'string' },
        owners: { type: 'array', items: { type: 'string' } },
        tagList: { type: 'array', items: { type: 'string' } },
        hostingType: { type: 'string' },
        investigationStatus: { type: 'string' },
        scanStatus: { type: 'string' },
        alive: { type: 'boolean' },
        ipRange: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id'],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_ISSUE'
  | 'ACCOUNT_HAS_ASSET_IP'
  | 'ACCOUNT_HAS_ASSET_DOMAIN'
  | 'ACCOUNT_HAS_ASSET_CERTIFICATE'
  | 'ACCOUNT_HAS_ASSET_WEB_APP'
  | 'ACCOUNT_HAS_ASSET_IP_RANGE'
  | 'ASSET_IP_HAS_ISSUE'
  | 'ASSET_DOMAIN_HAS_ISSUE'
  | 'ASSET_CERTIFICATE_HAS_ISSUE'
  | 'ASSET_WEB_APP_HAS_ISSUE'
  | 'ASSET_IP_RANGE_HAS_ISSUE'
  | 'ASSET_CERTIFICATE_HAS_IP'
  | 'ASSET_CERTIFICATE_HAS_DOMAIN'
  | 'ASSET_IP_HAS_DOMAIN'
  | 'ASSET_DOMAIN_HAS_IP'
  | 'ASSET_DOMAIN_CONTAINS_DOMAIN',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_ISSUE: {
    _type: 'cycognito_account_has_issue',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ISSUE._type,
  },
  ACCOUNT_HAS_ASSET_IP: {
    _type: 'cycognito_account_has_asset_ip',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_IP._type,
  },
  ACCOUNT_HAS_ASSET_DOMAIN: {
    _type: 'cycognito_account_has_asset_domain',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_DOMAIN._type,
  },
  ACCOUNT_HAS_ASSET_CERTIFICATE: {
    _type: 'cycognito_account_has_asset_certificate',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_CERTIFICATE._type,
  },
  ACCOUNT_HAS_ASSET_WEB_APP: {
    _type: 'cycognito_account_has_asset_web_app',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_WEB_APP._type,
  },
  ACCOUNT_HAS_ASSET_IP_RANGE: {
    _type: 'cycognito_account_has_asset_ip_range',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_IP_RANGE._type,
  },
  ASSET_IP_HAS_ISSUE: {
    _type: 'cycognito_asset_ip_has_issue',
    sourceType: Entities.ASSET_IP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ISSUE._type,
  },
  ASSET_DOMAIN_HAS_ISSUE: {
    _type: 'cycognito_asset_domain_has_issue',
    sourceType: Entities.ASSET_DOMAIN._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ISSUE._type,
  },
  ASSET_CERTIFICATE_HAS_ISSUE: {
    _type: 'cycognito_asset_certificate_has_issue',
    sourceType: Entities.ASSET_CERTIFICATE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ISSUE._type,
  },
  ASSET_WEB_APP_HAS_ISSUE: {
    _type: 'cycognito_asset_web_app_has_issue',
    sourceType: Entities.ASSET_WEB_APP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ISSUE._type,
  },
  ASSET_IP_RANGE_HAS_ISSUE: {
    _type: 'cycognito_asset_ip_range_has_issue',
    sourceType: Entities.ASSET_IP_RANGE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ISSUE._type,
  },
  ASSET_CERTIFICATE_HAS_IP: {
    _type: 'cycognito_asset_certificate_has_ip',
    sourceType: Entities.ASSET_CERTIFICATE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_IP._type,
  },
  ASSET_CERTIFICATE_HAS_DOMAIN: {
    _type: 'cycognito_asset_certificate_has_domain',
    sourceType: Entities.ASSET_CERTIFICATE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_DOMAIN._type,
  },
  ASSET_IP_HAS_DOMAIN: {
    _type: 'cycognito_asset_ip_has_domain',
    sourceType: Entities.ASSET_IP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_DOMAIN._type,
  },
  ASSET_DOMAIN_HAS_IP: {
    _type: 'cycognito_asset_domain_has_ip',
    sourceType: Entities.ASSET_DOMAIN._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSET_IP._type,
  },
  ASSET_DOMAIN_CONTAINS_DOMAIN: {
    _type: 'cycognito_asset_domain_contains_domain',
    sourceType: Entities.ASSET_DOMAIN._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.ASSET_DOMAIN._type,
  },
};
