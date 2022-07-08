import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { AssetType, Certificate } from '../../types';
import { generateDomainIdFromName } from '../asset-domain/converter';
import { generateIpIdFromAddress } from '../asset-ip/converter';
import {
  ACCOUNT_ENTITY_KEY,
  IntegrationSteps,
  Entities,
  Relationships,
} from '../constants';
import { createCertificateAssetEntity } from './converter';

export async function fetchCertificateAssetDetails({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateAssets<Certificate>(
    AssetType.CERTIFICATE,
    async (asset) => {
      const assetEntity = createCertificateAssetEntity(asset);

      await jobState.addEntity(assetEntity);
      if (accountEntity && assetEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: assetEntity,
          }),
        );
      }
    },
  );
}

export async function buildCertificateHasIpRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSET_CERTIFICATE._type },
    async (certificateEntity) => {
      const { ipNames } = certificateEntity;
      for (const ipAddress of (ipNames as string[]) || []) {
        const id = generateIpIdFromAddress(ipAddress);
        const ipEntity = await jobState.findEntity(id);
        if (ipEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: certificateEntity,
              to: ipEntity,
            }),
          );
        }
      }
    },
  );
}

export async function buildCertificateHasDomainRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSET_CERTIFICATE._type },
    async (certificateEntity) => {
      const { domainNames } = certificateEntity;
      for (const name of domainNames as string[]) {
        const id = generateDomainIdFromName(name);
        const domainEntity = await jobState.findEntity(id);
        if (domainEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: certificateEntity,
              to: domainEntity,
            }),
          );
        }
      }
    },
  );
}

export const certificateAssetSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ASSET_CERTIFICATES,
    name: 'Fetch Certificate Asset Details',
    entities: [Entities.ASSET_CERTIFICATE],
    relationships: [Relationships.ACCOUNT_HAS_ASSET_CERTIFICATE],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchCertificateAssetDetails,
  },
  {
    id: IntegrationSteps.BUILD_CERTIFICATE_IP_RELATIONSHIPS,
    name: 'Build Certificate Has IP Relationships',
    entities: [],
    relationships: [Relationships.ASSET_CERTIFICATE_HAS_IP],
    dependsOn: [
      IntegrationSteps.ASSET_CERTIFICATES,
      IntegrationSteps.ASSET_IPS,
    ],
    executionHandler: buildCertificateHasIpRelationship,
  },
  {
    id: IntegrationSteps.BUILD_CERTIFICATE_DOMAIN_RELATIONSHIPS,
    name: 'Build Certificate Has Domain Relationships',
    entities: [],
    relationships: [Relationships.ASSET_CERTIFICATE_HAS_DOMAIN],
    dependsOn: [
      IntegrationSteps.ASSET_CERTIFICATES,
      IntegrationSteps.ASSET_DOMAINS,
    ],
    executionHandler: buildCertificateHasDomainRelationship,
  },
];
