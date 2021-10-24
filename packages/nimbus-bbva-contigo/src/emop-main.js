import { LitElement, html } from 'lit';
import { outlet } from 'lit-element-router';

class EMOPMain extends outlet(LitElement) {
  render() {
    return html`
      <slot></slot>
    `;
  }
}
 
customElements.define('emop-main', EMOPMain);