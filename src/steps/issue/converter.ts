import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Issue } from '../../types';

export function createIssueEntity(issue: Issue): Entity {
  const { tags, ...other } = issue;
  const sourceObject = { ...other, tagList: tags };

  return createIntegrationEntity({
    entityData: {
      source: sourceObject,
      assign: {
        _key: issue.id,
        _type: Entities.ISSUE._type,
        _class: Entities.ISSUE._class,
        id: issue.id,
        affectedAsset: issue.affected_asset,
        ownedBy: issue.owned_by,
        owners: issue.owners,
        tagList: issue.tags,
        locations: issue.locations,
        name: issue.title,
        issueId: issue.issue_id,
        threat: issue.threat,
        firstDetected: parseTimePropertyValue(issue.first_detected),
        lastDetected: parseTimePropertyValue(issue.last_detected),
        resolvedAt: parseTimePropertyValue(issue.resolved_at),
        references: issue.references,
        issueStatus: issue.issue_status,
        investigationStatus: issue.investigation_status,
        detectionComplexity: issue.detection_complexity,
        exploitationMethod: issue.exploitation_method,
        exploitationScore: issue.exploitation_score,
        remediationSteps: issue.remediation_steps,
        potentialImpact: issue.potential_impact,
        category: issue.issue_type,
        severity: issue.severity,
        numericSeverity: issue.severity_score,
        open: issue.investigation_status === 'uninvestigated',
      },
    },
  });
}
