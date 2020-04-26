# Change Log

All notable changes to the "apex-code-runner" extension will be documented in this file.

## 0.0.6

### Added

- Support for Org switching

### Fixed

- Corrected issue where DefaultDevHubUsername was being used instead fo the current project user

## 0.0.5

### Added

- Much better load performance

### Fixed

- Changed dependencies from npm module `@salesforce/core` to  `extensionDependencies`: `salesforce.salesforcedx-vscode-core`
- Using the `extensionDependencies` significantly reduced the package size and load time
  - Package size reduced from 6MB to ~42kb, most of which are documentation

## 0.0.4

### Fixed

- Updated dependencies

## 0.0.3

### Added

- Removed file clutter from package

## 0.0.2

### Added

- Configuration Options
  - Preferred Window
  - Debug Levels and Options

## 0.0.1

- Beta release
