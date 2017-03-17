// jsdom, needs to be imported first
import './test-setup'

import {mount, shallow} from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import compose from 'recompose/compose'
import {withSpinner} from './index'

jest.useFakeTimers()

describe('withSpinner', () => {
  it('should render spinner if loading is true', () => {
    const Component = compose(
      WrappedComponent => props => <WrappedComponent {...props} data={{loading: true}} />,
      withSpinner(),
    )(() => <div></div>)

    const wrapper = shallow(<Component />).first().shallow()

    expect(wrapper.type()).toBeNull()

    // Run timer so it passes withSpinner timeout
    jest.runTimersToTime(100)
    wrapper.update()

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should not render spinner if loading is false', () => {
    const Component = compose(
      WrappedComponent => props => <WrappedComponent {...props} data={{loading: false}} />,
      withSpinner(),
    )(({data}) => <div>loading: {data.loading.toString()}</div>)

    const wrapper = shallow(<Component />).first().shallow().first().shallow()
    wrapper.update()

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should render spinner in 100 ms and after render component', () => {
    const DisplayComponent = ({data}) => <div>loading: {data.loading.toString()}, item: {data.item.id}</div>

    const Component = compose(
      WrappedComponent => class extends React.Component<any, any> {
        state = {loading: true, item: null}

        componentDidMount() {
          // Delay setting loading to false.
          setTimeout(() => {
            this.setState({loading: false, item: {id: 1}})
          }, 1000)
        }

        render() {
          return <WrappedComponent {...this.props} data={{loading: this.state.loading, item: this.state.item}} />
        }
      },
      withSpinner(),
    )(DisplayComponent)

    const wrapper = mount(<Component />)

    // Should not display a Spinner
    expect(wrapper.html()).toBeNull()

    // Run timer to 100 ms since withSpinner timeout defaults to 100 ms
    jest.runTimersToTime(100)
    // ProgressBar should now be found
    expect(wrapper.find(ProgressBar)).toHaveLength(1)
    expect(wrapper.find(DisplayComponent)).toHaveLength(0)

    // Run timer to 1000 ms for our own timeout
    jest.runTimersToTime(1000)
    // DisplayComponent should be found
    expect(wrapper.find(DisplayComponent)).toHaveLength(1)
    expect(wrapper.find(ProgressBar)).toHaveLength(0)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should render passed spinnerComponent', () => {
    const Loading = () => <span>Loading...</span>

    const Component = compose(
      WrappedComponent => props => <WrappedComponent {...props} data={{loading: true}} />,
      withSpinner({spinnerComponent: Loading}),
    )(null)

    const wrapper = shallow(<Component />).first().shallow()
    jest.runTimersToTime(100)
    wrapper.update()

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should ignore errors if handleError is false', () => {
    const DisplayComponent = ({data}) => <div>loading: {data.loading.toString()}, item: {data.item.id}</div>

    const Component = compose(
      WrappedComponent => props => <WrappedComponent {...props} data={{loading: false, error: true}} />,
      withSpinner({handleError: false}),
    )(DisplayComponent)

    const wrapper = shallow(<Component />).first().shallow()
    jest.runTimersToTime(100)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should render passed errorComponent if error exists', () => {
    const ErrorComponent = () => <span>An unknown error occured...</span>

    const Component = compose(
      WrappedComponent => props => <WrappedComponent {...props} data={{loading: false, error: true}} />,
      withSpinner({errorComponent: ErrorComponent}),
    )(null)

    const wrapper = shallow(<Component />).first().shallow()
    jest.runTimersToTime(100)

    expect(wrapper.find(ErrorComponent)).toHaveLength(1)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should delay rendering of spinnerComponent the timeout that is passed', () => {
    const DisplayComponent = ({data}) => <div>loading: {data.loading.toString()}, item: {data.item.id}</div>

    const Component = compose(
      WrappedComponent => props => <WrappedComponent {...props} data={{loading: true}} />,
      withSpinner({timeout: 500}),
    )(DisplayComponent)

    const wrapper = shallow(<Component />).first().shallow()

    // Run timer to a time before our timeout
    jest.runTimersToTime(400)
    expect(wrapper.type()).toBeNull()

    // Run timer over our timeout
    jest.runTimersToTime(600)
    expect(wrapper.first().shallow().type()).toBe(ProgressBar)
  })

  it('should not render errorComponent if skipErrors returns true', () => {
    const validationError = {validationError: {field: 'password', message: 'Wrong password'}}
    const ErrorComponent = () => <span>An unknown error occured...</span>
    const DisplayComponent = ({data: {error}}) => <div>
      Validation error occured on field: {error.validationError.field} with message: {error.validationError.message}
    </div>

    const Component = compose(
      WrappedComponent => props => <WrappedComponent {...props} data={{loading: false, error: validationError}} />,
      withSpinner(({
        errorComponent: ErrorComponent,
        skipErrors: data => data.error.validationError && data.error.validationError.field === 'password'
      })),
    )(DisplayComponent)

    const wrapper = shallow(<Component />).first().shallow()
    jest.runTimersToTime(100)

    expect(wrapper.find(ErrorComponent)).toHaveLength(0)
    expect(toJson(wrapper.first().shallow())).toMatchSnapshot()
  })
})
