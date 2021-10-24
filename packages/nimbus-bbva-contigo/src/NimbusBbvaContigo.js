import { html, css } from 'lit';
import { NimbusRequest } from './NimbusRequest';

export class NimbusBbvaContigo extends NimbusRequest {
  static get properties() {
    return {
      country: { type:String },
      socket:{ type:Object },
      countries: { type: Array},
      tweets:{type:Array},
      suggestions:{type:Array}
    };
  }

  static get styles() {
    return css`

    `;
  }

  constructor() {
    super();
    this.country = '';
    this.countries = [];
    this.tweets = [];
    this.suggestions = [];
    this.totalTweets = '';

    // this.socket = io('http://localhost:5000');
    this.socket = io('https://stream-twitter-hackathon.herokuapp.com');
    this.socket.on("connect", () => {
      console.log("client side socket connection established");
    });
    this.socket.on('tweet', data => {
      this.tweets = [...this.tweets,data];
    });
    this.socket.on('suggestions', data => {
      console.log(data);
      this.suggestions = [...this.suggestions,data.suggestions];
      this.totalTweets = data.counter;
      this.hideLoading();
    });
  }

  d3Init() {
    let width = 250,height = 250;
    let countries;

    const projection = d3.geo.orthographic()
      .scale(100)
      .rotate([0, 0])
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geo.path()
      .projection(projection);

    const svg = d3.select("#d3_globe").append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("path")
      .datum({type: "Sphere"})
      .attr("class", "water")
      .attr("d", path);

    queue()
      .defer(d3.json, "world.json")
      .defer(d3.tsv, "world-110m-country-names.tsv")
      .await(ready);

    function ready(error, world, countryData) {
      const countryById = {};
      countries = topojson.feature(world, world.objects.countries).features;
      var world = svg.selectAll("path.land")
        .data(countries)
        .enter().append("path")
        .attr("class", "land")
        .attr("d", path)
    }
  }

  d3ChangeCountry(id_country,color){
    const width = 250,height = 250;
    let focused;
    let countries;
    const projection = d3.geo.orthographic()
      .scale(100)
      .rotate([0, 0])
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geo.path()
                .projection(projection);
    document.getElementById('d3_globe').innerHTML = '';
    
    const svg = d3.select("#d3_globe").append("svg")
              .attr("width", width)
              .attr("height", height);
              
    svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "water")
            .attr("d", path);

    queue()
            .defer(d3.json, "world.json")
            .defer(d3.tsv, "world-110m-country-names.tsv")
            .await(ready);

      function ready(error, world, countryData) {
          countries = topojson.feature(world, world.objects.countries).features;
          var world = svg.selectAll("path.land")
                          .data(countries)
                          .enter().append("path")
                          .attr("class", "land")
                          .attr("d", path)

          var rotate = projection.rotate();
          let focusedCountry;
          for(let i=0;i<countries.length;i++){
            if(countries[i].id == id_country){
              focusedCountry = countries[i];
            }
          }

          let p = d3.geo.centroid(focusedCountry);
          svg.selectAll(".focused").classed("focused", focused = false);
    
          (function transition() {
            d3.transition()
              .duration(2500)
              .tween("rotate", function() {
                var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                return function(t) {
                  projection.rotate(r(t));
                  svg.selectAll("path").attr("d", path)
                    .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; })
                    .style("fill", function(d, i) { return d.id == focusedCountry.id ? "#004481" : false; });
                };
              })
          })();
      }
  }

  async firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.d3Init();
    const countries = await this.request({
      endpoint:'countries'
    });
    this.countries = countries.message === 'COUNTRY_FOUND' ? countries.data : [];
    countries.message === 'COUNTRY_FOUND' ? this.setRequestCountry(countries.data[0].code) : '';
    this.country = countries.message === 'COUNTRY_FOUND' ? countries.data[0].code : '';
  }

  setRequestCountry(code_country){
    this.country = code_country;
    this.d3ChangeCountry(this.country);
    this.updateDashboard(this.country);
  }

  showLoading(){document.getElementsByClassName('prioridadesContainer')[0].classList.add('loading');}
  hideLoading(){document.getElementsByClassName('prioridadesContainer')[0].classList.remove('loading');}

  updateDashboard(){
    this.tweets = [];
    this.suggestions = [];
    this.totalTweets = '';
    this.showLoading();
    this.socket.emit('request-suggestion',this.country);
  }

  changeCountry(){
      /*  ON CHANGE SELECT */
      const country = document.getElementById('paises').value;
      this.setRequestCountry(country);
  }

  refreshCountry(){
      /*  ON REFRESH BUTTON */
    console.log("refresh");
    this.updateDashboard();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <main>
        <section class="container header">
          <div class="blueBox" id="header">
              <h1>BBVA Contigo - EMOP</h1>
              <div class="diagonal">
                <select class="countriesSelect" id="paises" @change=${this.changeCountry}>
                  ${
                    this.countries.length>0 ?
                      this.countries.map( item => html `<option value="${item.code}">${item.name}</option>`) : ''
                  }
                </select>
              </div>
              <div>
                <button class="addCountry">
                  <svg viewBox="0 0 22 22" width="30" height="30">
                    <circle class="circle" cx="11" cy="11" r="10"/>
                    <polygon class="polygon" points="12 8 12 10 14 10 14 12 12 12 12 14 10 14 10 12 8 12 8 10 10 10 10 8 12 8"/>
                  </svg>
                  <span>Agregar País</span>
                </button>
              </div>
          </div>
        </section>
        <div class="containerSwitch">
          <section class="container" id="firstRow">
            <div class="blueBox twitterContainer">
              <div class="twitterGeneralContainer">
                  <div class="totalTweets">
                    <p id="totalTweets">
                    ${ this.totalTweets.length > 0 ? this.totalTweets : '' }
                    </p>
                    <span>Tweets <br>analizados</span>
                  </div>
                  <button id="refresh" @click="${this.refreshCountry}">
                    <svg viewBox="0 0 28.5 26.02" width="25" height="25"><path d="M2.26,11.86l7.89-3.37L6.63,6.78a9.7,9.7,0,0,1,17,4.63l3.11-1.33A13,13,0,0,0,3.52,5.3L0,3.59Z" style="fill:#2dcccd"/><path d="M26.28,13.27l-7.89,3.37L22,18.38a9.69,9.69,0,0,1-17.68-4.6L1.15,15.16A13.09,13.09,0,0,0,14,26a13,13,0,0,0,11-6.15l3.45,1.67Z"/></svg>
                  </button>
              </div>
              <div class="tweetsContainer" id="tweetsContainer">
                  ${
                    this.tweets.map(item =>{
                      let f = new Date(item.tweet.created_at);
                      return (
                        html ` <div class="tweet">
                            <div class="icon"></div>
                            <div class="tweetTexto">
                              <p class="texto">${item.tweet.text}</p>
                              <p class="fecha">${f.toLocaleDateString('en-US')} - ${f.toLocaleTimeString('en-US')} </p>
                            </div>
                          </div>
                        `
                      );
                    })
                  }
              </div>
            </div>
            <div class="staticContainer">
                <div class="blueBox mapContainer">
                  <div class="d3_globe" id="d3_globe"></div>
                </div>
                <div class="blueBox symbolContainer">
                  <div class="symbolsBox">
                    <p style="margin-top:0;">Simbología</p>
                    <div class="symbolUserContainer">
                      <div class="symbolContainer">
                        <div><svg viewBox="0 0 21.12 21.22" width="30" height="40"><path d="M13.6,10.61a5.7,5.7,0,0,0,2.6-4.84,5.77,5.77,0,1,0-8.84,4.89A10.47,10.47,0,0,0,0,20.34.89.89,0,0,0,.23,21a.81.81,0,0,0,.62.26h19.4a.91.91,0,0,0,.62-.26.93.93,0,0,0,.23-.62A10.56,10.56,0,0,0,13.6,10.61ZM10.45,1.74a4,4,0,1,1-4,4A4,4,0,0,1,10.45,1.74ZM1.82,19.53a8.82,8.82,0,0,1,17.47,0Z" style="fill:#f8cd51"/></svg></div>
                        <div><p>Persona</p></div>
                      </div>
                      <div class="symbolContainer">
                        <div><svg viewBox="0 0 26.98 22.77" width="35" height="40"><path d="M27,5.92a.57.57,0,0,0,0-.12v0a.57.57,0,0,0,0-.1v0L24.58,1.22a2.27,2.27,0,0,0-2-1.22H4.84A2.27,2.27,0,0,0,2.92,1.07L.06,5.62v0l0,.1v0a.57.57,0,0,0,0,.11v0H0V7.35a2.73,2.73,0,0,0,1.92,2.6v10a2.83,2.83,0,0,0,2.83,2.83H22.23a2.83,2.83,0,0,0,2.83-2.83V10A2.73,2.73,0,0,0,27,7.36ZM18.64,1.13h3.93a1.13,1.13,0,0,1,1,.61l1.89,3.61H1.58l2.3-3.69a1.13,1.13,0,0,1,1-.53H18.64Zm2.89,6.23v.48a2.31,2.31,0,1,1-4.61,0V6.49h4.61Zm-5.75.48a2.31,2.31,0,1,1-4.61,0V6.49h4.61ZM10,7.84a2.31,2.31,0,0,1-4.61,0V6.49H10ZM1.11,7.36V6.49H4.29v.87a1.59,1.59,0,1,1-3.18,0ZM11.37,21.64V16.88a2.11,2.11,0,1,1,4.22,0h0v4.76Zm10.86,0H16.72V16.88a3.24,3.24,0,1,0-6.48,0v4.76H4.72A1.7,1.7,0,0,1,3,19.94V10.06a2.71,2.71,0,0,0,1.59-.77,3.43,3.43,0,0,0,6,.43,3.43,3.43,0,0,0,5.75,0,3.43,3.43,0,0,0,6-.43,2.71,2.71,0,0,0,1.59.77v9.88A1.7,1.7,0,0,1,22.23,21.64ZM25.84,7.36a1.59,1.59,0,1,1-3.18,0V6.49h3.18Z" style="fill:#f8cd51"/></svg></div>
                        <div><p>Empresas</p></div>
                      </div>
                    </div>
                    <div class="emotionSymbolsContainer">
                        <div class="emotion positive">
                          <svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M14.86,12.67l-1.2-.84a4,4,0,0,1-6.59,0l-1.2.84A5.56,5.56,0,0,0,10.36,15,5.63,5.63,0,0,0,14.86,12.67Z"/></svg>
                          <p>Positivo</p>
                        </div>
                      <div class="emotion neutral">
                        <svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><rect x="6.65" y="12.79" width="6.96" height="1.46"/></svg>
                        <p>Neutral</p>  
                      </div>
                      <div class="emotion negative">
                        <svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M10.36,11.83a5.56,5.56,0,0,0-4.5,2.35l1.2.84a4,4,0,0,1,6.59,0l1.2-.84A5.63,5.63,0,0,0,10.36,11.83Z"/></svg>
                        <p>Negativo</p> 
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </section>
          <section class="container" id="gridContainer">
              <div class="prioridadesContainer">
                  ${
                    this.suggestions.length > 0 ? 
                        this.suggestions[0].suggestions.map(element => {
                          return html `
                            <div class="card blueBox">
                              <div class="cardHeader">
                                <p class="title">${element.category}</p>
                              </div>
                              <div class="cardBody">
                                  <div class="dataContainer">
                                    <div class="tweetsContainer"><p class="totalTweets">${element.suggestion.tweets.length}</p><span>Tweets analizados</span></div>
                                    <div class="badWord"><p>${
                                      element.suggestion.report.badTexts.length > 0 ? element.suggestion.report.badTexts[0]:'-------'
                                    }</p></div>
                                    <div class="goodWord"><p>${
                                      element.suggestion.report.goodTexts.length > 0 ? element.suggestion.report.goodTexts[0] : '-------'
                                    }</p></div>
                                  </div>
                                  <div class="actionContainer">
                                    <p>${element.suggestion.action}</p>
                                  </div>
                              </div>
                              <div class="cardFooter">
                                <div class="userContainer" title="Personal">
                                  <div class="active">
                                    <svg viewBox="0 0 21.12 21.22" width="40" height="40"><path d="M13.6,10.61a5.7,5.7,0,0,0,2.6-4.84,5.77,5.77,0,1,0-8.84,4.89A10.47,10.47,0,0,0,0,20.34.89.89,0,0,0,.23,21a.81.81,0,0,0,.62.26h19.4a.91.91,0,0,0,.62-.26.93.93,0,0,0,.23-.62A10.56,10.56,0,0,0,13.6,10.61ZM10.45,1.74a4,4,0,1,1-4,4A4,4,0,0,1,10.45,1.74ZM1.82,19.53a8.82,8.82,0,0,1,17.47,0Z"/></svg>
                                  </div>
                                </div>
                                <div class="emotionalContainer">
                                  ${
                                    (element.suggestion.report.trend === "bad") ? 
                                      html 
                                      ` <div class="emotion positive"><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M14.86,12.67l-1.2-.84a4,4,0,0,1-6.59,0l-1.2.84A5.56,5.56,0,0,0,10.36,15,5.63,5.63,0,0,0,14.86,12.67Z"/></svg></div>
                                        <div class="emotion neutral"><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><rect x="6.65" y="12.79" width="6.96" height="1.46"/></svg></div>
                                        <div class="emotion negative active" title="Negativo"><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M10.36,11.83a5.56,5.56,0,0,0-4.5,2.35l1.2.84a4,4,0,0,1,6.59,0l1.2-.84A5.63,5.63,0,0,0,10.36,11.83Z"/></svg></div>
                                      `
                                      : ''
                                  }
                                  ${
                                    (element.suggestion.report.trend === "good") ? 
                                      html 
                                      ` <div class="emotion positive active" title="Positivo"><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M14.86,12.67l-1.2-.84a4,4,0,0,1-6.59,0l-1.2.84A5.56,5.56,0,0,0,10.36,15,5.63,5.63,0,0,0,14.86,12.67Z"/></svg></div>
                                        <div class="emotion neutral"><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><rect x="6.65" y="12.79" width="6.96" height="1.46"/></svg></div>
                                        <div class="emotion negative" ><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M10.36,11.83a5.56,5.56,0,0,0-4.5,2.35l1.2.84a4,4,0,0,1,6.59,0l1.2-.84A5.63,5.63,0,0,0,10.36,11.83Z"/></svg></div>
                                      `
                                      : ''
                                  }
                                  ${
                                    (element.suggestion.report.trend === "neutral") ? 
                                      html 
                                      ` <div class="emotion positive"><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M14.86,12.67l-1.2-.84a4,4,0,0,1-6.59,0l-1.2.84A5.56,5.56,0,0,0,10.36,15,5.63,5.63,0,0,0,14.86,12.67Z"/></svg></div>
                                        <div class="emotion neutral active" title="Neutral"><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><rect x="6.65" y="12.79" width="6.96" height="1.46"/></svg></div>
                                        <div class="emotion negative" ><svg viewBox="0 0 20.83 20.83" width="20" height="20"><circle cx="10.42" cy="10.42" r="9.42" /><path d="M10.36,11.83a5.56,5.56,0,0,0-4.5,2.35l1.2.84a4,4,0,0,1,6.59,0l1.2-.84A5.63,5.63,0,0,0,10.36,11.83Z"/></svg></div>
                                      `
                                      : ''
                                  }
                                </div>
                              </div>
                            </div>
                            `  
                      })
                    : ''
                  }
                    <div class="rombo">
                      <p>Prioridades Estratégicas</p>
                    </div>
              </div>
          </section>
        </div>
      </main>
    `;
  }
}
