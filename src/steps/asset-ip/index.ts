import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { AssetType, Ip } from '../../types';
import { generateDomainIdFromName } from '../asset-domain/converter';
import {
  ACCOUNT_ENTITY_KEY,
  IntegrationSteps,
  Entities,
  Relationships,
} from '../constants';
import { createIpAssetEntity } from './converter';

export async function fetchIpAssetDetails({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateAssets<Ip>(AssetType.IP, async (asset) => {
    const assetEntity = createIpAssetEntity(asset);

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

export async function buildIpHasDomainRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSET_IP._type },
    async (ipEntity) => {
      const { domainNames } = ipEntity;
      for (const name of domainNames as string[]) {
        const id = generateDomainIdFromName(name);
        const domainEntity = await jobState.findEntity(id);
        if (domainEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: ipEntity,
              to: domainEntity,
            }),
          );
        }
      }
    },
  );
}

export const ipAssetSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ASSET_IPS,
    name: 'Fetch IP Asset Details',
    entities: [Entities.ASSET_IP],
    relationships: [Relationships.ACCOUNT_HAS_ASSET_IP],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchIpAssetDetails,
  },
  {
    id: IntegrationSteps.BUILD_IP_DOMAIN_RELATIONSHIPS,
    name: 'Build IP Has Domain Relationships',
    entities: [],
    relationships: [Relationships.ASSET_IP_HAS_DOMAIN],
    dependsOn: [IntegrationSteps.ASSET_IPS, IntegrationSteps.ASSET_DOMAINS],
    executionHandler: buildIpHasDomainRelationship,
  },
];
