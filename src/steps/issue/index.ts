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
  MappedRelationships,
} from '../constants';
import {
  createAccountIssueRelationship,
  createIssueCveRelationship,
  createIssueCycRelationship,
  createIssueEntity,
} from './converter';

function getIssueType(issueId: string): undefined | 'CVE' | 'CYC' {
  const parts = issueId.split('-');
  if (!parts || parts.length <= 0) {
    return undefined;
  }

  if (parts[0] === 'CVE') {
    return 'CVE';
  } else if (parts[0] === 'CYC') {
    return 'CYC';
  }

  return undefined;
}

export async function fetchIssueDetails({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateIssues(async (issue) => {
    const issueEntity = createIssueEntity(issue);
    await jobState.addEntity(issueEntity);

    if (accountEntity && issueEntity) {
      // Account -HAS-> Issue
      await jobState.addRelationship(
        createAccountIssueRelationship(accountEntity, issueEntity),
      );

      const issueType = getIssueType(issue.issue_id);
      if (issueType) {
        if (issueType === 'CVE') {
          // Issue -IS-> CVE (mapped)
          await jobState.addRelationship(
            createIssueCveRelationship(issueEntity, issue),
          );
        } else if (issueType === 'CYC') {
          // Issue -IS-> CYC (mapped)
          await jobState.addRelationship(
            createIssueCycRelationship(issueEntity, issue),
          );
        }
      }
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
    relationships: [
      Relationships.ACCOUNT_HAS_ISSUE,
      MappedRelationships.ISSUE_IS_CVE,
      MappedRelationships.ISSUE_IS_CYC,
    ],
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
    ],
    dependsOn: [
      IntegrationSteps.ISSUES,
      IntegrationSteps.ASSET_IPS,
      IntegrationSteps.ASSET_DOMAINS,
      IntegrationSteps.ASSET_CERTIFICATES,
      IntegrationSteps.ASSET_WEB_APPS,
    ],
    executionHandler: buildAssetHasIssueRelationship,
  },
];
