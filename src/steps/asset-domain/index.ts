import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { AssetType, Domain } from '../../types';
import { generateIpIdFromAddress } from '../asset-ip/converter';
import {
  ACCOUNT_ENTITY_KEY,
  IntegrationSteps,
  Entities,
  Relationships,
} from '../constants';
import { createDomainAssetEntity } from './converter';

export async function fetchDomainAssetDetails({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateAssets<Domain>(AssetType.DOMAIN, async (asset) => {
    const accountEntity = (await jobState.getData(
      ACCOUNT_ENTITY_KEY,
    )) as Entity;
    const assetEntity = createDomainAssetEntity(asset);

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
  });
}

export async function buildDomainHasIpRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSET_DOMAIN._type },
    async (domainEntity) => {
      const { ipNames } = domainEntity;
      for (const ipAddress of ipNames as string[]) {
        const id = generateIpIdFromAddress(ipAddress);
        const ipEntity = await jobState.findEntity(id);
        if (ipEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: domainEntity,
              to: ipEntity,
            }),
          );
        }
      }
    },
  );
}

export async function buildDomainContainsDomainRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSET_DOMAIN._type },
    async (domainEntity) => {
      const { subDomains } = domainEntity;
      for (const domainId of subDomains as string[]) {
        const subDomainEntity = await jobState.findEntity(domainId);
        if (subDomainEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: domainEntity,
              to: subDomainEntity,
            }),
          );
        }
      }
    },
  );
}

export const domainAssetSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ASSET_DOMAINS,
    name: 'Fetch Domain Asset Details',
    entities: [Entities.ASSET_DOMAIN],
    relationships: [Relationships.ACCOUNT_HAS_ASSET_DOMAIN],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchDomainAssetDetails,
  },
  {
    id: IntegrationSteps.BUILD_DOMAIN_IP_RELATIONSHIPS,
    name: 'Build Domain Has IP Relationships',
    entities: [],
    relationships: [Relationships.ASSET_DOMAIN_HAS_IP],
    dependsOn: [IntegrationSteps.ASSET_DOMAINS, IntegrationSteps.ASSET_IPS],
    executionHandler: buildDomainHasIpRelationship,
  },
  {
    id: IntegrationSteps.BUILD_DOMAIN_DOMAIN_RELATIONSHIPS,
    name: 'Build Domain Contains Sub-domain Relationships',
    entities: [],
    relationships: [Relationships.ASSET_DOMAIN_CONTAINS_DOMAIN],
    dependsOn: [IntegrationSteps.ASSET_DOMAINS],
    executionHandler: buildDomainContainsDomainRelationship,
  },
];
