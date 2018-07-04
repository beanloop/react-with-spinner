import path from 'ramda/src/path'
import * as React from 'react'
import {Component, ReactType} from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'

export type Properties = {
  /**
   * Property to look for, if prop.loading is true then the [spinnerComponent]
   * will get rendered.
   * Defaults to 'data'.
   */
  prop?: string|Array<string>
  /**
   * Timeout in milliseconds, the [spinnerComponent] wont get rendered
   * before the timeout.
   * Defaults to 100.
   */
  timeout?: number
  /**
   * If the HOC should handle errors, if true the [errorComponent] will be rendered.
   * Defaults to true.
   */
  handleError?: boolean
  /**
   * Component to be rendered if an error occurs.
   * Defaults to null.
   */
  errorComponent?: ReactType
  /**
   * If the HOC should take partial data into account.
   * Defaults to false.
   */
  partial?: boolean
  /**
   * Component that should be rendered while loading.
   * Defaults to a React Toolbox ProgressBar component.
   */
  spinnerComponent: ReactType
  /**
   * Extra props that should be passed to the [spinnerComponent].
   */
  spinnerProps?: Object
  /**
   * Function that can be used to skip rendering the [errorComponent].
   * If it returns true the [errorComponent] will not get rendered.
   * This can for example be used to skip rendering the [errorComponent]
   * for validation errors.
   */
  skipErrors?: (data: any) => boolean

  emptyComponent?: ReactType
}

function getDataProperty(propName: string|Array<string>, props: Properties) {
  return Array.isArray(propName)
        ? path(propName, props)
        : props[propName]
}

export const withSpinner = ({
  prop = 'data', timeout = 100,
  handleError = true, partial = false,
  skipErrors, spinnerProps,
  errorComponent: ErrorComponent = null,
  spinnerComponent: Spinner,
  emptyComponent: EmptyComponent = null,
}: Properties): any => WrappedComponent =>
  class extends Component<Properties, {showSpinner: boolean}> {
    static displayName = wrapDisplayName(WrappedComponent, 'withSpinner')

    state = {showSpinner: false}
    timeout: number|null = null

    componentWillReceiveProps(nextProps) {
      const dataProp = this.props.prop || prop
      const data = getDataProperty(dataProp, this.props)

      if (!getDataProperty(dataProp, nextProps) && data && (partial || !data.loading)) {
        this.timeout = null
        if (this.state.showSpinner) {
          this.setState({showSpinner: false})
        }
      }
    }

    render() {
      const dataProp = this.props.prop || prop
      const data = getDataProperty(dataProp, this.props)

      if (data && (partial || !data.loading)) {
        if ((Array.isArray(data) && !data.length && EmptyComponent) || !Object.keys(data).length && EmptyComponent) {
          return EmptyComponent && <EmptyComponent {...this.props} />
        }
        else if (!handleError || !data.error ||
            !!(typeof skipErrors === 'function' && skipErrors(data))) {
          return <WrappedComponent {...this.props} />
        }
        return ErrorComponent && <ErrorComponent {...this.props} />
      }

      if (this.state.showSpinner) return <Spinner {...spinnerProps} {...this.props} />

      if (this.timeout === null) {
        this.timeout = setTimeout(() => {
          this.setState({showSpinner: true})
        }, timeout)
      }
      return null
    }
  }
