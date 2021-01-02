import Vue, { VNode } from 'vue' // eslint-disable-line @typescript-eslint/no-unused-vars

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
