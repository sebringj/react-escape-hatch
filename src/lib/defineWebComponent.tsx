import React, { FC } from 'react'
import ReactDOM from 'react-dom/client'
import { RefHarness } from './RefHarness'

/**
 * define attribute name and conversion method
 */
type MetaAttribute = {
  name: string;
  convert: (value?: string) => any
}

/**
 * defines mapping of eventName and callbackName
 */
type MetaEvent = {
  eventName: string;
  callbackName: string;
}

export type WebComponentParams<T = unknown> = {
  /**
   * The webcomponent tag name
   */
  tagName: string;
  /**
   * list react input props, not callbacks
   */
  attributes?: (string | MetaAttribute)[];
  /**
   * list react callback props which will emit events to listen to with callback payload
   */
  events?: (string | MetaEvent)[];
  /**
   * set to true if the react component supports "ref" attribute
   */
  hasRef?: boolean;
  /**
   * The react component
   */
  reactComponent: FC<any>;
}

type EventPairs = { [key: string]: (payload: any) => void };
type AttributeMap = { [key: string]: MetaAttribute };
type AttributePairs = { [key: string]: string };

/**
 * wraps react
 * @param params
 */
export function defineWebComponent(params: WebComponentParams) {
  class WebComponent extends HTMLElement {
    static get observedAttributes() {
      return params.attributes || [];
    }

    htmlTag = 'div'
    mountPoint = document.createElement(this.htmlTag)
    root = ReactDOM.createRoot(this.mountPoint)
    refObject = { current: {} }

    attributeMap: AttributeMap = (params.attributes || [])
      .map(item => typeof item === 'string' ? { name: item, convert: (value: any) => value } : item)
      .reduce(
        (obj: AttributeMap, attribute: MetaAttribute) => {
          obj[attribute.name] = attribute
          return obj
        }, {}
      )
    attributePairs: AttributePairs = {}

    // emits callbacks as events
    eventPairs: EventPairs = (params.events || [])?.map(item =>
      typeof item === 'string' ? {
        eventName: item,
        callbackName: item
      } : item).reduce(
      (obj: EventPairs, event: MetaEvent) => {
        obj[event.callbackName] = (payload: any) => {
          const eventObj = new CustomEvent(event.eventName, {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: payload
          });
          this.mountPoint.dispatchEvent(eventObj);
        }
        return obj;
      }, {}
    );

    connectedCallback() {
      this.attachShadow({ mode: 'open' }).appendChild(this.mountPoint);

      this.attributePairs = Object.keys(this.attributeMap)
        .reduce(
        (obj: AttributePairs, key: string) => {
          const value = this.getAttribute(key)
          obj[key] = this.attributeMap[key].convert(value === null ? undefined : value)
          return obj
        }, {})

      this.render()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      const attribute = params.attributes?.find(item => {
        return typeof item === 'string' ? name === item : name === item.name
      })
      if (attribute) {
        this.attributePairs[name] = this.attributeMap[name].convert(newValue === null ? undefined : newValue)
      }
      this.render()
    }

    disconnectedCallback() {
      // cleanup if needed
    }

    render() {
      const typeOf = String((params.reactComponent as unknown as { $$typeof: string }).$$typeof)
      if (typeOf.includes('forward_ref')) {
        this.root.render(<RefHarness {...{ ...this.attributePairs, ...this.eventPairs }}
          reactComponent={params.reactComponent} refObject={this.refObject} />);
      } else {
        this.root.render(<params.reactComponent {...{ ...this.attributePairs, ...this.eventPairs }} />);
      }
    }

    get ref() {
      return this.refObject
    }
  }

  customElements.define(params.tagName, WebComponent);
}
