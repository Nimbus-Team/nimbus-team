import { html, css } from 'lit';
import { NimbusRequest } from './NimbusRequest';
import './emop-link';

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

    this.socket = io('https://stream-twitter-hackathon.herokuapp.com');
    this.socket.on("connect", () => {
      console.log("client side socket connection established");
    });
    this.socket.on('tweet', data => {
      this.tweets = [...this.tweets,data];
    });
    this.socket.on('suggestions', data => {
      // console.log(data);
      this.suggestions = [...this.suggestions,...data.suggestions];
      this.totalTweets = data.counter;
      console.log(this.suggestions);
      console.log(this.totalTweets);
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
                  <svg viewBox="0 0 1024 1280" width="20" height="20"><path d="M868.8,475.4c-4.4-24.7-8.8-49.4-13.2-74c-1,7.7-2,15.4-3,23.1c20.5-27,40.9-54.1,61.4-81.1    c2.9-3.8,5.8-7.6,8.7-11.5c3.9-5.1,4.4-13.1,3.6-19.1c-0.9-7-3.8-11.7-8.3-17.2c-30.2-37.5-60.3-75-90.5-112.5    c-4.2-5.2-8.4-10.5-12.6-15.7c-6-7.4-20.3-11.3-29.2-7.7c-32.8,13.1-65.7,26.3-98.5,39.4c-4.6,1.9-9.3,3.7-13.9,5.6    c7.7,1,15.4,2,23.1,3c-18.5-9.7-37-19.4-55.5-29.1c4.6,6,9.2,12,13.8,17.9c-9.3-31.3-18.5-62.5-27.8-93.8    c-1.3-4.4-2.6-8.9-3.9-13.3c-3.8-12.7-15.6-22-28.9-22c-47.9,0-95.8,0-143.7,0c-6.7,0-13.5,0-20.2,0c-13.4,0-25.2,9.4-28.9,22    c-9.3,31.3-18.5,62.5-27.8,93.8c-1.3,4.4-2.6,8.9-3.9,13.3c4.6-6,9.2-12,13.8-17.9c-18.5,9.7-37,19.4-55.5,29.1    c7.7-1,15.4-2,23.1-3c-32.8-13.1-65.7-26.3-98.5-39.4c-4.6-1.9-9.3-3.7-13.9-5.6c-8.9-3.5-23.2,0.3-29.2,7.7    c-30.2,37.5-60.3,75-90.5,112.5c-4.2,5.2-8.4,10.5-12.6,15.7c-4.3,5.3-7.3,10.3-8.3,17.2c-0.8,6-0.3,14.1,3.6,19.1    c20.5,27,40.9,54.1,61.4,81.1c2.9,3.8,5.8,7.6,8.7,11.5c-1-7.7-2-15.4-3-23.1c-4.4,24.7-8.8,49.4-13.2,74c4.6-6,9.2-12,13.8-17.9    c-30.1,15.1-60.3,30.1-90.4,45.2c-4.2,2.1-8.5,4.2-12.7,6.4c-12.3,6.2-16.4,21.4-13.8,33.9c9.3,44.5,18.6,88.9,27.8,133.4    c1.3,6.2,2.6,12.4,3.9,18.7c2.9,13.7,16.3,20.9,28.9,22c34.7,3.1,69.3,6.2,104,9.2c5,0.4,10,0.9,15,1.3c-8.6-5-17.3-9.9-25.9-14.9    c12.8,17.6,25.6,35.3,38.3,52.9c-1.4-5-2.7-10.1-4.1-15.1c-3.9,32-7.7,64.1-11.6,96.1c-0.5,4.5-1.1,9.1-1.6,13.6    c-1.1,9.5,6.4,21.9,14.9,25.9c41.3,19.7,82.6,39.4,123.9,59.1c5.9,2.8,11.7,5.6,17.6,8.4c11.9,5.7,26.7,5.5,36.4-4.7    c22-23.1,44-46.3,65.9-69.4c3.1-3.3,6.3-6.6,9.4-9.9c-7.1,2.9-14.1,5.9-21.2,8.8c25.6,0,51.1,0,76.7,0c-7.1-2.9-14.1-5.9-21.2-8.8    c22,23.1,44,46.3,65.9,69.4c3.1,3.3,6.3,6.6,9.4,9.9c9.8,10.3,24.4,10.4,36.4,4.7c41.3-19.7,82.6-39.4,123.9-59.1    c5.9-2.8,11.7-5.6,17.6-8.4c8.5-4,16-16.4,14.9-25.9c-3.9-32-7.7-64.1-11.6-96.1c-0.5-4.5-1.1-9.1-1.6-13.6    c-1.4,5-2.7,10.1-4.1,15.1c12.8-17.6,25.6-35.3,38.4-52.9c-8.6,5-17.3,9.9-25.9,14.9c34.7-3.1,69.3-6.2,104-9.2    c5-0.4,10-0.9,15-1.3c12.6-1.1,26.1-8.5,28.9-22c9.3-44.5,18.6-88.9,27.8-133.4c1.3-6.2,2.6-12.4,3.9-18.7    c2.6-12.4-1.5-27.7-13.8-33.9c-30.1-15.1-60.3-30.1-90.4-45.2c-4.2-2.1-8.5-4.2-12.7-6.4c-14-7-33.1-4.2-41,10.8    c-7.2,13.6-4.2,33.6,10.8,41c30.1,15.1,60.3,30.1,90.4,45.2c4.2,2.1,8.5,4.2,12.7,6.4c-4.6-11.3-9.2-22.6-13.8-33.9    c-9.3,44.5-18.6,88.9-27.8,133.4c-1.3,6.2-2.6,12.4-3.9,18.7c9.6-7.3,19.3-14.7,28.9-22c-39.6,3.5-79.3,6.7-118.8,10.6    c-11.9,1.2-19.1,5.4-26.1,14.9c-0.7,0.9-1.4,1.9-2.1,2.9c-3.2,4.4-6.4,8.8-9.6,13.2c-7.7,10.6-15.4,21.2-23,31.8    c-4.4,6.1-8.2,11.7-7.7,20.1c0.1,1.9,0.5,3.8,0.7,5.7c1.3,11.2,2.7,22.3,4,33.5c2.8,23.5,5.7,47,8.5,70.5    c5-8.6,9.9-17.3,14.9-25.9c-41.3,19.7-82.6,39.4-123.9,59.1c-5.9,2.8-11.7,5.6-17.6,8.4c12.1,1.6,24.2,3.1,36.4,4.7    c-13.9-14.7-27.9-29.3-41.8-44c-8.7-9.1-17.3-18.2-26-27.3c-8.6-9.1-15.6-16.6-30.1-16.8c-23.3-0.4-46.6,0-69.9,0    c-9.8,0-19,1.3-26.7,8.8c-1.3,1.2-2.4,2.6-3.7,3.9c-7.6,8-15.2,16-22.9,24.1c-16.3,17.1-32.6,34.3-48.8,51.4    c12.1-1.6,24.2-3.1,36.4-4.7c-41.3-19.7-82.6-39.4-123.9-59.1c-5.9-2.8-11.7-5.6-17.6-8.4c5,8.6,9.9,17.3,14.9,25.9    c2.4-19.9,4.8-39.9,7.2-59.8c1.5-12.7,3.1-25.3,4.6-38c1.2-10.1,3.1-18.5-3.4-28.1c-11.9-17.6-24.9-34.6-37.5-51.8    c-7.1-9.6-14.3-13.8-26.2-15c-0.8-0.1-1.5-0.1-2.3-0.2c-3.5-0.3-7-0.6-10.5-0.9c-12.5-1.1-25.1-2.2-37.6-3.3    c-22.8-2-45.6-4.1-68.4-6.1c9.6,7.3,19.3,14.7,28.9,22c-9.3-44.5-18.6-88.9-27.8-133.4c-1.3-6.2-2.6-12.4-3.9-18.7    c-4.6,11.3-9.2,22.6-13.8,33.9c18.5-9.3,37.1-18.5,55.6-27.8c12-6,24-12,36-18c11.2-5.6,22.4-10,25.5-24.4    c4.9-23,8.3-46.4,12.4-69.5c1.6-9.1,3.2-18.7-2.5-27.1c-1.3-2-2.9-3.9-4.4-5.8c-7.2-9.5-14.4-19-21.6-28.6    c-14.7-19.4-29.3-38.7-44-58.1c-1.6,12.1-3.1,24.2-4.7,36.4c30.2-37.5,60.3-75,90.5-112.5c4.2-5.2,8.4-10.5,12.6-15.7    c-9.7,2.6-19.5,5.1-29.2,7.7c17.8,7.1,35.6,14.2,53.4,21.4c19.5,7.8,38.8,16.6,58.6,23.4c13.7,4.8,28.6-5.6,40.5-11.8    c11.4-6,22.9-12,34.3-18c8.5-4.4,14.9-10.5,18-20.2c0.7-2.1,1.2-4.2,1.9-6.3c3.3-11,6.5-22,9.8-32.9c6.7-22.6,13.4-45.2,20.1-67.7    c-9.6,7.3-19.3,14.7-28.9,22c47.9,0,95.8,0,143.7,0c6.7,0,13.5,0,20.2,0c-9.6-7.3-19.3-14.7-28.9-22c5.7,19.1,11.3,38.2,17,57.4    c3.7,12.4,7.3,24.7,11,37.1c3.5,11.9,5.9,23.9,18,30.8c17.9,10.2,36.6,19.6,55,28.8c14.9,7.4,23.6,2.9,36.5-2.2    c11.8-4.7,23.7-9.5,35.5-14.2c21.2-8.5,42.4-17,63.6-25.4c-9.7-2.6-19.5-5.1-29.2-7.7c30.2,37.5,60.3,75,90.5,112.5    c4.2,5.2,8.4,10.5,12.6,15.7c-1.6-12.1-3.1-24.2-4.7-36.4c-16.7,22.1-33.5,44.2-50.2,66.3c-6.5,8.6-13.9,17-19.7,26    c-5.9,9.3-3.8,19.7-2,29.8c1.4,7.8,2.8,15.5,4.2,23.3c2.6,14.8,5.3,29.6,7.9,44.3c1.3,7,7.9,14.5,13.8,17.9    c6.4,3.8,15.9,5.4,23.1,3c7.3-2.3,14.3-6.8,17.9-13.8C869.8,491,870.3,483.7,868.8,475.4z"/><path d="M512,631.2c-6.5,0-12.9-0.4-19.4-1.3c2.7,0.4,5.3,0.7,8,1.1c-13.4-1.8-26.4-5.3-38.8-10.6    c2.4,1,4.8,2,7.2,3c-8.5-3.6-16.6-8-24.3-13.1c-2-1.3-3.9-2.7-5.9-4.1c-4.3-3.1,1.9,1.9,2.4,1.9c-0.4,0-2.7-2.2-3-2.5    c-3.5-2.9-6.9-6-10.1-9.2c-3.2-3.2-6.3-6.6-9.2-10.1c-0.7-0.8-1.4-1.7-2.1-2.5c-2.2-2.7,4.6,6.2,1.9,2.4c-1.4-1.9-2.8-3.9-4.2-5.9    c-5.3-7.8-9.8-16.2-13.5-24.8c1,2.4,2,4.8,3,7.2c-5.2-12.4-8.8-25.4-10.6-38.8c0.4,2.7,0.7,5.3,1.1,8c-1.6-12.9-1.6-25.9,0-38.8    c-0.4,2.7-0.7,5.3-1.1,8c1.8-13.4,5.3-26.4,10.6-38.8c-1,2.4-2,4.8-3,7.2c3.6-8.5,8-16.6,13.1-24.3c1.3-2,2.7-3.9,4.1-5.9    c3.1-4.3-1.9,1.9-1.9,2.4c0-0.4,2.2-2.7,2.5-3c2.9-3.5,6-6.9,9.2-10.1c3.2-3.2,6.6-6.3,10.1-9.2c0.8-0.7,1.7-1.4,2.5-2.1    c2.7-2.2-6.2,4.6-2.4,1.9c1.9-1.4,3.9-2.8,5.9-4.2c7.8-5.3,16.2-9.8,24.8-13.5c-2.4,1-4.8,2-7.2,3c12.4-5.2,25.4-8.8,38.8-10.6    c-2.7,0.4-5.3,0.7-8,1.1c12.9-1.6,25.9-1.6,38.8,0c-2.7-0.4-5.3-0.7-8-1.1c13.4,1.8,26.4,5.3,38.8,10.6c-2.4-1-4.8-2-7.2-3    c8.5,3.6,16.6,8,24.3,13.1c2,1.3,3.9,2.7,5.9,4.1c4.3,3.1-1.9-1.9-2.4-1.9c0.4,0,2.7,2.2,3,2.5c3.5,2.9,6.9,6,10.1,9.2    c3.2,3.2,6.3,6.6,9.2,10.1c0.7,0.8,1.4,1.7,2.1,2.5c2.2,2.7-4.6-6.2-1.9-2.4c1.4,1.9,2.8,3.9,4.2,5.9c5.3,7.8,9.8,16.2,13.5,24.8    c-1-2.4-2-4.8-3-7.2c5.2,12.4,8.8,25.4,10.6,38.8c-0.4-2.7-0.7-5.3-1.1-8c1.6,12.9,1.6,25.9,0,38.8c0.4-2.7,0.7-5.3,1.1-8    c-1.8,13.4-5.3,26.4-10.6,38.8c1-2.4,2-4.8,3-7.2c-3.6,8.5-8,16.6-13.1,24.3c-1.3,2-2.7,3.9-4.1,5.9c-3.1,4.3,1.9-2,1.9-2.4    c0,0.4-2.2,2.7-2.5,3c-2.9,3.5-6,6.9-9.2,10.1c-3.2,3.2-6.6,6.3-10.1,9.2c-0.8,0.7-1.7,1.4-2.5,2.1c-2.7,2.2,6.2-4.6,2.4-1.9    c-1.9,1.4-3.9,2.8-5.9,4.2c-7.8,5.3-16.2,9.8-24.8,13.5c2.4-1,4.8-2,7.2-3c-12.4,5.2-25.4,8.8-38.8,10.6c2.7-0.4,5.3-0.7,8-1.1    C524.9,630.7,518.5,631.1,512,631.2c-15.7,0.1-30.7,13.7-30,30c0.7,16.2,13.2,30.1,30,30c35.9-0.2,72.6-10.9,101.9-32    c30.8-22.2,53.5-51.7,66.6-87.3c25-67.9,2.8-150-53.3-195.8c-29.9-24.4-64.8-38.8-103.4-41.8c-35.8-2.8-73.2,6.5-103.9,25.1    c-29.7,18-55,45.1-69.4,76.8c-16.2,35.9-21,74.4-13.4,113.2c13.7,69.7,73.7,128.3,144.1,139.1c10.2,1.6,20.4,2.8,30.8,2.8    c15.7,0.1,30.7-13.9,30-30C541.3,644.8,528.8,631.2,512,631.2z"/></svg>
                  <emop-link href="/rules">
                    <span>Configuración</span>
                  </emop-link>
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
                    ${ this.totalTweets }
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
                    <p style="m">Simbología</p>
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
                        this.suggestions.map(element => {
                          console.log(element);
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
