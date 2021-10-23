import { LitElement, html } from 'lit';
import { router } from 'lit-element-router';
import './emop-main';
import './emop-link';
import './nimbus-bbva-contigo';
import './emop-rules';

class EMOPApp extends router(LitElement){
  
  constructor() {
    super();
    this.route = '';
    this.params = {};
    this.query = {};
  }

  static get properties() {
    return {
      route: { type: String },
      params: { type: Object },
      query: { type: Object }
    };
  }

  static get routes() {
    return [
      {
        name: 'dashboard',
        pattern: '/',
      }, 
      {
        name: 'rules',
        pattern: '/rules'
      },
      {
        path: '(.*)',
        component: 'nimbus-bbva-contigo',
      }
    ];
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    console.log(route, params, query, data);
  }

  render() {
    return html`
      <emop-link href="/">Dashboard</emop-link>
      <emop-link href="/rules">CRUD</emop-link>
      <emop-main active-route=${this.route}>
        <nimbus-bbva-contigo route='rules'></nimbus-bbva-contigo>
        <emop-rules route='dashboard'></emop-rules>
      </emop-main>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('emop-app', EMOPApp);