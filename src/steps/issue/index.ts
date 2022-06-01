import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import {
  ACCOUNT_ENTITY_KEY,
  IntegrationSteps,
  Entities,
  Relationships,
} from '../constants';
import { createIssueEntity } from './converter';

export async function fetchIssueDetails({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateIssues(async (issue) => {
    const accountEntity = (await jobState.getData(
      ACCOUNT_ENTITY_KEY,
    )) as Entity;
    const issueEntity = createIssueEntity(issue);

    await jobState.addEntity(issueEntity);
    if (accountEntity && issueEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: issueEntity,
        }),
      );
    }
  });
}

export async function buildAssetHasIssueRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ISSUE._type },
    async (issueEntity) => {
      const { affectedAsset } = issueEntity;
      const targetEntity = await jobState.findEntity(affectedAsset as string);
      if (targetEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: targetEntity,
            to: issueEntity,
          }),
        );
      }
    },
  );
}

export const issueSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ISSUES,
    name: 'Fetch Issue Details',
    entities: [Entities.ISSUE],
    relationships: [Relationships.ACCOUNT_HAS_ISSUE],
    dependsOn: [IntegrationSteps.ACCOUNT],
    executionHandler: fetchIssueDetails,
  },
  {
    id: IntegrationSteps.BUILD_ASSET_ISSUE_RELATIONSHIPS,
    name: 'Build Asset Has Issue Relationships',
    entities: [],
    relationships: [
      Relationships.ASSET_IP_HAS_ISSUE,
      Relationships.ASSET_DOMAIN_HAS_ISSUE,
      Relationships.ASSET_CERTIFICATE_HAS_ISSUE,
      Relationships.ASSET_WEB_APP_HAS_ISSUE,
      Relationships.ASSET_IP_RANGE_HAS_ISSUE,
    ],
    dependsOn: [
      IntegrationSteps.ISSUES,
      IntegrationSteps.ASSET_IPS,
      IntegrationSteps.ASSET_DOMAINS,
      IntegrationSteps.ASSET_CERTIFICATES,
      IntegrationSteps.ASSET_wEB_APPS,
      IntegrationSteps.ASSET_IP_RANGES,
    ],
    executionHandler: buildAssetHasIssueRelationship,
  },
];
