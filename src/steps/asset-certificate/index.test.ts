import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-certificate-assets', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-certificate-assets',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.ASSET_CERTIFICATES,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-certificate-has-ip-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-certificate-has-ip-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_CERTIFICATE_IP_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-certificate-has-domain-relationship', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-certificate-has-domain-relationship',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BUILD_CERTIFICATE_DOMAIN_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
