import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-web-app-assets', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-web-app-assets',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.ASSET_WEB_APPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
