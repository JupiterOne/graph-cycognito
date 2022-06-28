import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-ip-assets', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-ip-assets',
  });

  const stepConfig = buildStepTestConfigForStep(IntegrationSteps.ASSET_IPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-ip-has-domain-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-ip-has-domain-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_IP_DOMAIN_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
