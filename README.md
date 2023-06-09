# React Escape Hatch

This is a project-starter to develop react components from and then to expose them as web components.

<img src="https://media.gettyimages.com/id/sb10063651h-001/vector/ladder-through-escape-hatch.jpg?s=1024x1024&w=gi&k=20&c=lDFWFwkSPY8qqcUiqKSkguGKZsR5EnGNKEuZ0eDNwRw=" style="width:100px;height:auto;">
Project to create react components as Web Components to be compatible with different web frameworks.

Basic principles (AKA IMO why this is better than other approaches):

1. ensure your react component does not need to know anything about web components
2. ensure web components behave as if they were built around pure web programming, not react
3. expose react callbacks as web component events
4. allow only simple string attributes but can optionally provide a convert method per attribute
5. expose `myElement.ref.current` automatically via dom node access when your component is a `forward_ref` type

The design goal is to create a clean seperation between plain react components and then being able to wrap them as web components without compromising functionality.

The initial goal of this was to allow an old angular 1 app to use new react components and this currently supports react created as functional components only.

See index.html source for example usage.

## Usage with Vite
Vite is a modern way to package up your app and provides a clean way to build the project and produce a script file.

## Webcomponent Compatibility and React
- Suports arguments as strings but can optionally provide a conversion method for an attribute
- Supports callbacks as events
- Supports React "ref"
- See "index.html" as an example of using it on any web browser updated within the last 5 years.

## Style Caveats for web components
The unique nature of web components requires being compatible with shadow dom.

- "TestComponent" demonstrates how to use styles with web components that are encapulated by design.
- Caveat: Inline style tags or inline style attributes approach must be used to be compatible with shadow dom.

## Getting Started
1. ensure latest version of node
2. run `yarn`
3. run `yarn dev`

## To get build preview
1. run `yarn preview`

## Integrating with env
- In dev environment place on your consuming web page, add a script tag to your running server
```html
  <script type="module" src="http://localhost:5173/@vite/client"></script>
  <script type="module" src="http://localhost:5173/src/main.tsx"></script>
```
- In a production env place reference built script from  `/dist/assets`
  - run `yarn build`
  - deploy `/dist/assets/[builtscript filename].js` to a CDN somewhere i.e. `http://my-cdn/built-script.js`
  - reference that on your consuming web page
  ```html
    <script type="module" src="http://my-cdn/built-script.js"></script>
  ```
