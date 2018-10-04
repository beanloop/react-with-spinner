# react-with-spinner

[![Build Status](https://travis-ci.org/beanloop/react-with-spinner.svg?branch=master)](https://travis-ci.org/beanloop/react-with-spinner)
[![npm version](https://badge.fury.io/js/react-with-spinner.svg)](https://badge.fury.io/js/react-with-spinner)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

React HOC for displaying a Spinner component while loading.

## Install

```shell
yarn add react-with-spinner
npm install --save react-with-spinner
```

## Usage

By default withSpinner will look for the property `data` and if
that property contains an loading property that is true then
it will render a `Spinner`.

```typescript
import compose from 'recompose/compose'
import {withSpinner} from 'react-with-spinner'

const Component = compose(
  WrappedComponent => props => <WrappedComponent {...props} data={{loading: true}} />,
  withSpinner({spinnerComponent: SomeCustomSpinnerConponent}),
)(() => <div></div>)

```

You can override which property withSpinner should look for:

```typescript
import compose from 'recompose/compose'
import {withSpinner} from 'react-with-spinner'

const Component = compose(
  WrappedComponent => props => <WrappedComponent {...props} result={{loading: true}} />,
  withSpinner({prop: 'result'}),
)(() => <div></div>)

```

For more usages, check out the [tests](https://github.com/beanloop/react-with-spinner/blob/master/src/index.test.tsx)

## License

react-with-spinner is dual-licensed under Apache 2.0 and MIT
terms.
