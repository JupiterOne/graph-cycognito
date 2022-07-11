import { accountSteps } from './account';
import { issueSteps } from './issue';
import { ipAssetSteps } from './asset-ip';
import { domainAssetSteps } from './asset-domain';
import { certificateAssetSteps } from './asset-certificate';
import { webAppAssetSteps } from './asset-web-app';
// import { IpRangeAssetSteps } from './asset-ip-range';

const integrationSteps = [
  ...accountSteps,
  ...issueSteps,
  ...ipAssetSteps,
  ...domainAssetSteps,
  ...certificateAssetSteps,
  ...webAppAssetSteps,
  // ...IpRangeAssetSteps,
];

export { integrationSteps };
