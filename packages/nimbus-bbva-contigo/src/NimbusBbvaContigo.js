import { html, css } from 'lit';
import { NimbusRequest } from './NimbusRequest';




export class NimbusBbvaContigo extends NimbusRequest {
  

  static get properties() {
    return {
      country: { type:String },
      socket:{ type:Object },
      countries: { type: Array},
      totalTweets:{type:String},
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
    this.totalTweets = '203';
    this.countries = [];
    this.tweens = [];
    this.suggestions = [];

    // this.socket = io('http://localhost:5000');
    // this.socket = io('https://stream-twitter-hackathon.herokuapp.com');
    // this.socket.on("connect", () => {
      // console.log("client side socket connection established");
    // });
    // this.socket.on('tweet', data => {
      // console.log(data);
        // this.tweens = [...data];
    // });
    // this.socket.on('suggestions', data => {
      // console.log('suggestions');
      // console.log(data);
      // this.suggestions = [...data];
    // });
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
  }

  setRequestCountry(code_country){
    this.tweens = [];
    this.suggestions = [];
    this.d3ChangeCountry(code_country);
    this.setTweets();

    // this.socket.emit('request-suggestion',code_country);

    //TODO
    //  this.setTweets();
    //  this.showLoading();
    //  this.hideLoading();
    //  this.setSuggestions();

  }

  changeCountry(){
      const country = document.getElementById('paises').value;
      console.log(country);
      this.setRequestCountry(country);
  }

  createTweet(data){
    let node;
    
    return node;
  }

  setTweets(){
    fetch('./25c354bf.json')
    .then(response => response.json())
    .then(data => {
      let twitter = '';
      data.forEach(item => {
        let f = new Date(item.tweet.created_at);
        twitter = `<div class="tweet">`;
        twitter += (Math.random() > .5) ? `<div class="icon danger"></div>` : `<div class="icon secondary"></div>`;
        twitter += `<div class="tweetTexto">
              <p class="texto">${item.tweet.text}</p>
              <p class="fecha">${f.toLocaleDateString('en-US')} - ${f.toLocaleTimeString('en-US')} </p>
            </div>
          </div>`;
          document.getElementById('tweetsContainer').innerHTML += twitter;
      });
      // document.getElementById('tweetsContainer').innerHTML = twitter;
    });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <main>
        <section class="container">
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
        <section class="container" id="firstRow">
          <div class="blueBox twitterContainer">
            <div class="twitterGeneralContainer">
                <div class="totalTweets">
                  <p id="totalTweets">${this.totalTweets}</p>
                  <span>Tweets <br>analizados</span>
                </div>
                <button id="refresh">
                  <svg viewBox="0 0 28.5 26.02" width="25" height="25"><path d="M2.26,11.86l7.89-3.37L6.63,6.78a9.7,9.7,0,0,1,17,4.63l3.11-1.33A13,13,0,0,0,3.52,5.3L0,3.59Z" style="fill:#2dcccd"/><path d="M26.28,13.27l-7.89,3.37L22,18.38a9.69,9.69,0,0,1-17.68-4.6L1.15,15.16A13.09,13.09,0,0,0,14,26a13,13,0,0,0,11-6.15l3.45,1.67Z"/></svg>
                </button>
            </div>
            <div class="tweetsContainer" id="tweetsContainer">
            </div>
          </div>
          <div class="staticContainer">
              <div class="blueBox mapContainer">
                <div class="d3_globe" id="d3_globe"></div>
              </div>
              <div class="blueBox symbolsContainer">

              </div>
          </div>
        </section>
        <section class="container">
            <div class="prioridadesContainer">
                  <div class="blueBox">
                    <p class="title">Mejorar la salud finnciera de los clientes</p>
                  </div>
                  <div class="blueBox">
                    <p class="title">Ayudar a los clientes en la transición facia el futuro sotenible</p>
                  </div>
                  <div class="blueBox">
                    <p class="title">Crecer en clientes</p>
                  </div>
                  <div class="blueBox">
                    <p class="title">Buscar la excelencia operativa</p>
                  </div>
            </div>
        </section>
      </main>
    `;
  }
}
