# Change Log

All notable changes to the "apex-code-runner" extension will be documented in this file.

## 0.1.3

- Security Updates

## 0.1.2

### Added

- Added command for explicitly refreshing current access token

## 0.1.1

### Fixed

- Added support for getting latest accessToken for org. This should mitigate the need for running `sfdx force:org:open`

## 0.1.0

### Added

- Improved performance

## 0.0.9

### Added

- Updated system message when user gets an invalid session error
  - use `sfdx force:org:open` from the terminal to verify a valid connection and then reload project window

## 0.0.8

### Added

- Improved feedback indicators that code is executing
  - Added progress window to indicate that code is executing
  - Truncate the output windows when execution begins

## 0.0.7

### Added

- Improved user messages when a session id is invalid

### Fixed

- Handling of invalid session

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
