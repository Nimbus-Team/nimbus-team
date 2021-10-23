import { LitElement, html, css } from 'lit';

export class NimbusBbvaContigo extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      country : {type:String},
      socket:{type:Object}
    };
  }

  static get styles() {
    return css`

    `;
  }

  d3Init() {
    let width = 250,
      height = 250,
      focused;
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

    function setCountry(id_country,color){
      var rotate = projection.rotate(),
        focusedCountry = country(countries, id_country),
        p = d3.geo.centroid(focusedCountry);
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

    function unsetCountry(){
      svg.selectAll("path").attr("d", path)
        .classed("focused", false)
        .style("fill", "#2C1E3D");
    }

    function country(cnt, sel) {
      for(var i = 0, l = cnt.length; i < l; i++) {
        if(cnt[i].id == sel) {return cnt[i];}
      }
    }
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.d3Init();
  }

  constructor() {
    super();
    this.socket = io('http://localhost:5000');
    this.socket.on("connect", () => {
      console.log("client side socket connection established");
    });
    this.socket.on('tweet', data => {
      console.log(data);
    });
    this.socket.on('suggestion', data => {
      console.log('suggestion');
      console.log(data);
    });

    this.title = 'BBVA Contigo - EMOP';

  }




  changeCountryMX(){

    // this.socket.emit('request-suggestion','mx');

  }
  changeCountryES(){
    // this.socket.emit('request-suggestion','es');
  }

  setTweets(){
    fetch('./25c354bf.json')
    .then(response => response.json())
    .then(data => {
      let twitter = '';
      data.forEach(item => {
        let f = new Date(item.tweet.created_at);
        twitter += `
          <div class="tweet">
            <div class="icon"></div>
            <div class="tweetTexto">
              <p class="texto">${item.tweet.text}</p>
              <p class="fecha">${f.toLocaleDateString('en-US')}</p>
            </div>
          </div>`;
      });
      console.log(twitter);
      document.getElementById('tweetContainer').innerHTML = twitter;

    });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <main>
        <div class="container"><h1>${this.title}</h1></div>
        <div class="container" id="btnsContainer">
          <button class="active" @click="${this.changeCountryMX}">MEX</button>
          <button @click="${this.changeCountryES}">ESP</button>
        </div>
        <div class="container" id="firstBlock">
          <div class="mapContainer">
            <div id="d3_globe"></div>
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
