import { html, css } from 'lit';
import { NimbusRequest } from './NimbusRequest';




export class NimbusBbvaContigo extends NimbusRequest {
  

  static get properties() {
    return {
      country: { type:String },
      socket:{ type:Object },
      countries: { type: Array}
    };
  }

  static get styles() {
    return css`

    `;
  }



  constructor() {
    super();
    this.countries = [];
    // this.socket = io('http://localhost:5000');
    // this.socket = io('https://stream-twitter-hackathon.herokuapp.com');
    // this.socket.on("connect", () => {
      // console.log("client side socket connection established");
    // });
    // this.socket.on('tweet', data => {
      // console.log(data);
    // });
    // this.socket.on('suggestions', data => {
      // console.log('suggestions');
      // console.log(data);
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
                    .style("fill", function(d, i) { return d.id == focusedCountry.id ? color : false; });
    
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
  }

  changeCountryMX(){
    this.d3ChangeCountry("mx",'#004481');
    console.log("mx");
    // this.socket.emit('request-suggestion','mx');
    this.setTweets();
  }

  changeCountryES(){
    this.d3ChangeCountry("es",'#004481');
    // this.socket.emit('request-suggestion','es');
  }

  setTweets(){
    fetch('./25c354bf.json')
    .then(response => response.json())
    .then(data => {
      let twitter = '';
      data.forEach(item => {
        let f = new Date(item.tweet.created_at);
        twitter += `<div class="tweet">`;
        twitter += (Math.random() > .5) ? `<div class="icon danger"></div>` : `<div class="icon secondary"></div>`;
        twitter += `<div class="tweetTexto">
              <p class="texto">${item.tweet.text}</p>
              <p class="fecha">${f.toLocaleDateString('en-US')}</p>
            </div>
          </div>`;
      });
      document.getElementById('tweetContainer').innerHTML = twitter;
    });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <main>
        <div class="container box" id="header">
          <h1>BBVA Contigo - EMOP</h1>
          <div class="diagonal">
            <select class="countriesSelect" id="paises">
              ${
                this.countries.length>0 ?
                  this.countries.map( item => html `<option value="${item.code}">${item.name}</option>`) : ''
              }
            </select>
          </div>
          <button class="addCountry">
            <svg viewBox="0 0 22 22" width="30" height="30">
            <circle class="circle" cx="11" cy="11" r="10"/>
            <polygon class="polygon" points="12 8 12 10 14 10 14 12 12 12 12 14 10 14 10 12 8 12 8 10 10 10 10 8 12 8"/>
            </svg>
            Agregar País
          </button>
        </div>
        <div class="container" id="btnsContainer">
          <button class="active" @click="${this.changeCountryMX}">MEX</button>
          <button @click="${this.changeCountryES}">ESP</button>
        </div>
        <div class="container" id="firstBlock">
          <div class="mapContainer">
            <div class="d3_globe" id="d3_globe"></div>
          </div>
          <div class="twitterContainer">
            <h2>Tweets</h2>
            <div class="tweetContainer" id="tweetContainer">
            </div>
          </div>
        </div>
      </main>
    `;
  }
}
