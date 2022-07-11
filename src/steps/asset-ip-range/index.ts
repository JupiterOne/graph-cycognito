// import {
//   createDirectRelationship,
//   Entity,
//   IntegrationStep,
//   IntegrationStepExecutionContext,
//   RelationshipClass,
// } from '@jupiterone/integration-sdk-core';

// import { createAPIClient } from '../../client';
// import { IntegrationConfig } from '../../config';
// import { AssetType, IpRange } from '../../types';
// import {
//   ACCOUNT_ENTITY_KEY,
//   IntegrationSteps,
//   Entities,
//   Relationships,
// } from '../constants';
// import { createIpRangeAssetEntity } from './converter';

// export async function fetchIpRangeAssetDetails({
//   jobState,
//   instance,
// }: IntegrationStepExecutionContext<IntegrationConfig>) {
//   const apiClient = createAPIClient(instance.config);

//   const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

//   await apiClient.iterateAssets<IpRange>(AssetType.IP_RANGE, async (asset) => {
//     const assetEntity = createIpRangeAssetEntity(asset);

//     await jobState.addEntity(assetEntity);
//     if (accountEntity && assetEntity) {
//       await jobState.addRelationship(
//         createDirectRelationship({
//           _class: RelationshipClass.HAS,
//           from: accountEntity,
//           to: assetEntity,
//         }),
//       );
//     }
//   });
// }

// export const IpRangeAssetSteps: IntegrationStep<IntegrationConfig>[] = [
//   {
//     id: IntegrationSteps.ASSET_IP_RANGES,
//     name: 'Fetch IP Range Asset Details',
//     entities: [Entities.ASSET_IP_RANGE],
//     relationships: [Relationships.ACCOUNT_HAS_ASSET_IP_RANGE],
//     dependsOn: [IntegrationSteps.ACCOUNT],
//     executionHandler: fetchIpRangeAssetDetails,
//   },
// ];
