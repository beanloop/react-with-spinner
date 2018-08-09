# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2018-08-09
### Added
- Reference to index.d.ts file in package.json
### Changed
- Return type of `withSpinner` to `React.ComponentType`
- Type of `error/spinnerComponent` props to `React.ComponentType`
- Use `window.setTimeout` instead of `setTimeout` due to typing mismatch
- Move React/ReactDOM to peerDependencies
- Update enzyme, recompose and ramda packages

