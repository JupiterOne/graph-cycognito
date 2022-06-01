import {
  createDirectRelationship,
  createIntegrationEntity,
  createMappedRelationship,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
  RelationshipDirection,
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

export function createAccountIssueRelationship(
  account: Entity,
  issue: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: issue,
  });
}

export function createIssueCveRelationship(
  issue: Entity,
  cve: Issue,
): Relationship {
  const cveIdDisplay = cve.issue_id.toUpperCase();

  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: 'cycognito_issue_is_cve',
    _mapping: {
      sourceEntityKey: issue._key,
      relationshipDirection: RelationshipDirection.FORWARD,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _key: cve.issue_id.toLowerCase(),
        _type: 'cve',
        id: cve.issue_id,
        score: cve.severity_score,
        category: cve.issue_type,
        name: cveIdDisplay,
        displayName: cveIdDisplay,
        severity: cve.severity,
        references: cve.references,
        webLink: `https://nvd.nist.gov/vuln/detail/${cve.issue_id}`,
      },
    },
  });
}

export function createIssueCycRelationship(
  issue: Entity,
  cyc: Issue,
): Relationship {
  const cycIdDisplay = cyc.issue_id.toUpperCase();

  return createMappedRelationship({
    _class: RelationshipClass.IS,
    _type: 'cycognito_issue_is_cyc',
    _mapping: {
      sourceEntityKey: issue._key,
      relationshipDirection: RelationshipDirection.FORWARD,
      skipTargetCreation: false,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _key: cyc.issue_id.toLowerCase(),
        _type: 'cyc',
        id: cyc.issue_id,
        score: cyc.severity_score,
        category: cyc.issue_type,
        name: cycIdDisplay,
        displayName: cycIdDisplay,
        severity: cyc.severity,
        references: cyc.references,
      },
    },
  });
}
