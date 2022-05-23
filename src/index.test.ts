import { invocationConfig as implementedConfig } from '.';
import { invocationConfig as specConfig } from '../docs/spec/src';

test('implemented integration should match spec', () => {
  expect(implementedConfig).toImplementSpec(specConfig);
});
