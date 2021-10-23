import { LitElement, html, css } from "lit";
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-icons';

class EMOPRules extends LitElement {
  constructor() {
    super();
    this.countries = [];
    this.values = ['Mexico', 'España', 'Colombia'];
  }

  static get properties() {
    return {
      countries: { type: Array },
      values: { type: Array }
    };
  }

  static get styles() {
    return css`
      :host {
        color: white !important;
      }
      .nav-menu {
        height: 100px
      }
    `;
  }

  render() {
    return html`
      <vaadin-combo-box label="Paises" placeholder="Selecciona" value="Mexico" .items=${this.values}></vaadin-combo-box>
      <vaadin-button>
        <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon>
        Add
      </vaadin-button>
      <vaadin-combo-box label="Categorias" placeholder="Selecciona" value="Value" .items=${this.values}></vaadin-combo-box>
      
      <vaadin-combo-box label="Clientes" placeholder="Selecciona" value="Value" .items=${this.values}></vaadin-combo-box>
    `
  }
}

customElements.define("emop-rules", EMOPRules);