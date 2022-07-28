# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.0.3 - 2022-07-28

### Changed

- Changed how Certificate and IP assets domain names are collected. The endpoint
  is no longer returning them under the field of `domain_names` but instead
  under `domains`.

## 1.0.2 - 2022-07-11

### Changed

- Temporary disabled/commented out "IP Range Assets" step until it's fixed on
  the API side. It is a known bug and the fix is coming.

## 1.0.1 - 2022-07-08

### Changed

- Modified domain and certificate assets logic in case ipNames property is
  missing.

## 1.0.0 - 2022-06-29

### Added

- Ingest new entities
  - `cycognito_account`
  - `cycognito_issue`
  - `cycognito_asset_ip`
  - `cycognito_asset_domain`
  - `cycognito_asset_certificate`
  - `cycognito_asset_web_app`
  - `cycognito_asset_ip_range`
- Build new relationships
  - `cycognito_account_has_issue`
  - `cycognito_account_has_asset_ip`
  - `cycognito_account_has_asset_domain`
  - `cycognito_account_has_asset_certificate`
  - `cycognito_account_has_asset_web_app`
  - `cycognito_account_has_asset_ip_range`
  - `cycognito_asset_ip_has_issue`
  - `cycognito_asset_domain_has_issue`
  - `cycognito_asset_certificate_has_issue`
  - `cycognito_asset_web_app_has_issue`
  - `cycognito_asset_certificate_has_ip`
  - `cycognito_asset_certificate_has_domain`
  - `cycognito_asset_ip_has_domain`
  - `cycognito_asset_domain_contains_domain`
