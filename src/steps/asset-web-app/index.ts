import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { AssetType, WebApp } from '../../types';
import {
  ACCOUNT_ENTITY_KEY,
  IntegrationSteps,
  Entities,
  Relationships,
} from '../constants';
import { createWebAppAssetEntity } from './converter';

export async function fetchWebAppAssetDetails({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateAssets<WebApp>(AssetType.WEB_APP, async (asset) => {
    const accountEntity = (await jobState.getData(
      ACCOUNT_ENTITY_KEY,
    )) as Entity;
    const assetEntity = createWebAppAssetEntity(asset);

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

export const webAppAssetSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ASSET_wEB_APPS,
    name: 'Fetch Web App Asset Details',
    entities: [Entities.ASSET_WEB_APP],
    relationships: [Relationships.ACCOUNT_HAS_ASSET_WEB_APP],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchWebAppAssetDetails,
  },
];
