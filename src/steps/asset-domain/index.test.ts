import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-domain-assets', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-domain-assets',
  });

  const stepConfig = buildStepTestConfigForStep(IntegrationSteps.ASSET_DOMAINS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-domain-has-ip-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-domain-has-ip-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_DOMAIN_IP_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-domain-contains-domain-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-domain-contains-domain-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_DOMAIN_DOMAIN_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
