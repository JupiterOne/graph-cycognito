import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import {
  Entities,
  IntegrationSteps,
  MappedRelationships,
  Relationships,
} from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-issues', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-issues',
  });

  const stepConfig = buildStepTestConfigForStep(IntegrationSteps.ISSUES);

  const { collectedEntities, collectedRelationships, encounteredTypes } =
    await executeStepWithDependencies(stepConfig);

  expect(encounteredTypes).toMatchSnapshot();

  expect(
    collectedEntities.some((e) => e._type === Entities.ISSUE._type),
  ).toBeTruthy();

  expect(
    collectedRelationships.some(
      (e) => e._type === Relationships.ACCOUNT_HAS_ISSUE._type,
    ),
  ).toBeTruthy();

  expect(
    collectedRelationships.some(
      (e) => e._type === MappedRelationships.ISSUE_IS_CVE._type,
    ),
  ).toBeTruthy();

  expect(
    collectedRelationships.some(
      (e) => e._type === MappedRelationships.ISSUE_IS_CYC._type,
    ),
  ).toBeTruthy();
});

test('build-asset-has-issue-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-asset-has-issue-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_ASSET_ISSUE_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
