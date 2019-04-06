import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {jsdom} from 'jsdom'

configure({adapter: new Adapter()})

declare const global: any

global.document = jsdom('')
global.window = document.defaultView

if (document.defaultView) {
  Object.keys(document.defaultView).forEach((property: any) => {
    if (typeof global[property] === 'undefined') {
      global[property] = global.window[property]
    }
  })
}

global.navigator = {
  userAgent: 'node.js',
}
