import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { Certificate } from '../../types';
import { parseAssetProperties } from '../utils';

export function createCertificateAssetEntity(asset: Certificate): Entity {
  const { tags, ...other } = asset;
  // Reusing this somehow leads to type problems when assigning to source
  const sourceObject = { ...other, tagList: tags };

  return createIntegrationEntity({
    entityData: {
      source: sourceObject,
      assign: {
        _key: asset.id,
        _type: Entities.ASSET_CERTIFICATE._type,
        _class: Entities.ASSET_CERTIFICATE._class,
        ...parseAssetProperties(asset),
        name: `Subject:${asset.subject_organization}\nIssuer:${asset.issuer_organization}\nalgorithm:${asset.signature_algorithm}`,
        domainNames: asset.domain_names,
        ipNames: asset.ip_names,
        locations: asset.locations,
        // Stats
        signatureAlgorithm: asset.signature_algorithm,
        creationTime: parseTimePropertyValue(asset.creation_time),
        expirationTime: parseTimePropertyValue(asset.expiration_time),
        'subject.organization': asset.subject_organization,
        'subject.organizationUnit': asset.subject_organization_unit,
        'subject.commonName': asset.subject_common_name,
        'subject.altNames': asset.subject_alt_names,
        'subject.country': asset.subject_country,
        'subject.state': asset.subject_state,
        'subject.locality': asset.subject_locality,
        'issuer.organization': asset.issuer_organization,
        'issuer.organizationUnit': asset.issuer_organization_unit,
        'issuer.commonName': asset.issuer_common_name,
        'issuer.altNames': asset.issuer_alt_names,
        'issuer.country': asset.issuer_country,
        'issuer.state': asset.issuer_state,
        'issuer.locality': asset.issuer_locality,
      },
    },
  });
}
