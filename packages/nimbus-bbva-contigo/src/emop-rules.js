import { LitElement, html, css } from "lit";
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-accordion';

class EMOPRules extends LitElement {
  constructor() {
    super();
    this.countries = ['Mexico', 'España', 'Colombia'];
    this.categories = ['Cat1', 'Cat2', 'Cat3'];
    this.clients = ['Personal', 'Empresarial'];
    this.rules = []
  }

  static get properties() {
    return {
      countries: { type: Array },
      clients: { type: Array },
      categories: { type: Array }
    };
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        justify-content: center;
        align-content: center;
        grid-gap: 10px;
        --lumo-secondary-text-color: #a0a0a0;
        --lumo-primary-text-color: white;
        --lumo-body-text-color: white;
        --lumo-contrast-10pct: rgba(255, 255, 255, 0.3);
      }
      .crud-form {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr;
      }
      .nav-menu {
        display: flex;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap;
      }
      .nav-element {
        flex: 1 auto
      }
      .content {
        padding: 10px;
      }
      .quick-forms {
        position: relative;
        display: block;
        max-height: 0;
        height: 0;
        overflow: hidden;
        transition: max-height 0.5s, padding 0.5s;
        background-color: rgba(255,255,255, 0.15);
        box-size: border-box;
      }
      .quick-forms.open {
        padding: 10px;
        max-height: 300px;
        height: auto;
      }
      #country-form, #category-form, #client-form {
        display:none;
      }
      #country-form.open, #category-form.open, #client-form.open {
        display:block;
      }
      .close-quick-forms {
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 5px;
        --_lumo-button-color: white;
      }
    `;
  }

  firstUpdated() {
    this.forms = this.shadowRoot.querySelectorAll('.quick-forms > div');
  }

  showQuickForms(e) {
    const form = e.target.getAttribute('var');
    this.shadowRoot.querySelector('.quick-forms').classList.add('open');
    this.forms.forEach(form => {
      form.classList.remove('open');
    });
    this.shadowRoot.querySelector(`#${form}-form`).classList.toggle('open');
  }

  closeQuickForms(e) {
    this.shadowRoot.querySelector('.quick-forms').classList.remove('open');
  }

  render() {
    return html`
      <div class="nav-menu">
        <div class="nav-element">
          <vaadin-combo-box label="Paises" placeholder="Selecciona" value="Mexico" .items=${this.countries}></vaadin-combo-box>
        <vaadin-button @click=${this.showQuickForms} var="country" theme="primary">
          <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon>
          Add
        </vaadin-button>
        </div>
        <div class="nav-element">
          <vaadin-combo-box label="Categorias" placeholder="Selecciona" value="Value" .items=${this.categories}></vaadin-combo-box>
        <vaadin-button @click=${this.showQuickForms} var="category" theme="primary">
          <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon>
          Add
        </vaadin-button>
        </div>
        <div class="nav-element">
          <vaadin-combo-box label="Clientes" placeholder="Selecciona" value="Value" .items=${this.clients}></vaadin-combo-box>
        <vaadin-button @click=${this.showQuickForms} var="client" theme="primary">
          <iron-icon icon="vaadin:plus" slot="prefix"></iron-icon>
          Add
        </vaadin-button>
        </div>
      </div>
      <div class="quick-forms">
        <vaadin-button class="close-quick-forms" @click=${this.closeQuickForms} theme="tertiary-inline">
          <iron-icon icon="vaadin:close" slot="prefix"></iron-icon>
        </vaadin-button>
        <div id="country-form">
          <vaadin-text-field label="Código"></vaadin-text-field>
          <vaadin-text-field label="Pais"></vaadin-text-field>
          <vaadin-text-field label="Palabras clave por país"></vaadin-text-field>
          <vaadin-text-field label="Lenguaje"></vaadin-text-field>
          <vaadin-button @click=${this.showQuickForms} theme="primary">
            <iron-icon icon="vaadin:paperplane" slot="prefix"></iron-icon>
            Enviar
          </vaadin-button>
        </div>
        <div id="category-form">
          <vaadin-text-field label="Categoría"></vaadin-text-field>
          <vaadin-text-field label="Etiqueta"></vaadin-text-field>
          <vaadin-button @click=${this.showQuickForms} theme="primary">
            <iron-icon icon="vaadin:paperplane" slot="prefix"></iron-icon>
            Enviar
          </vaadin-button>
        </div>
        <div id="client-form">
          <vaadin-text-field label="Cliente"></vaadin-text-field>
          <vaadin-button @click=${this.showQuickForms} theme="primary">
            <iron-icon icon="vaadin:paperplane" slot="prefix"></iron-icon>
            Enviar
          </vaadin-button>
        </div>
      </div>
      <div class="content">
        <h3>Registrar Regla</h3>
        <div class="crud-form">
          <vaadin-text-field placeholder="Palabras clave"></vaadin-text-field>
          <vaadin-button @click=${this.showQuickForms} theme="primary">
            <iron-icon icon="vaadin:paperplane" slot="prefix"></iron-icon>
            Registrar
          </vaadin-button>
        </div>
        <div class="rules-container">
        <h3>Reglas</h3>
        <vaadin-accordion opened="false">
          <vaadin-accordion-panel>
            <div slot="summary">Regla 1</div>
            <vaadin-vertical-layout>
              Contenido de la regla 1
            </vaadin-vertical-layout>
          </vaadin-accordion-panel>
          <vaadin-accordion-panel>
            <div slot="summary">Regla 2</div>
            <vaadin-vertical-layout>
              Contenido de la regla 2
            </vaadin-vertical-layout>
          </vaadin-accordion-panel>
        </vaadin-accordion>
        </div>
      </div>
    `
  }
}

customElements.define("emop-rules", EMOPRules);