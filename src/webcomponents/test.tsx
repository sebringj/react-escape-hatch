import { defineWebComponent } from '../lib/defineWebComponent';

/**
 * IMPORTANT
 *
 * The goal of this is to decouple the react components from web components.
 *
 * Placing web component logic inside your react component will defeat this purpose
 */

// import the react component
import { TestRef, Test } from '../components/Test'

export const defineTest = () => {
    // wrap the react component with a web component
    defineWebComponent({
        // the web component tag name
        tagName: 'test-component',

        // declare webcomponent value-based attributes that correspond to react component (omit callbacks)
        // note that all inputs are strings by limitation of web components
        attributes: [
            // example of simple string input
            'name',

            // can optionally convert string input to whatever you like for the react component
            {
                name: 'user',
                convert: (strObj?: string) => strObj ? JSON.parse(strObj) : undefined
            }
        ],

        // if your react component uses callbacks, list them here and they will be emitted as events
        // with the given payload returned from your callback in your react component
        // it is not possible to directly bind callbacks with web components
        events: [
            // simple string assumes name of event and callback are the same
            'counterChange',

            // or... fine grain naming of event and callback
            {
                eventName: 'counterClick',
                callbackName: 'onCounterClick'
            }
        ],

        reactComponent: TestRef
    })
}
