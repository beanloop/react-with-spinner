import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16.3'
import {jsdom} from 'jsdom'

configure({adapter: new Adapter()})

declare const global

global.document = jsdom('')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}
