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

  // setTweets(){
  //   fetch('./25c354bf.json')
  //   .then(response => response.json())
  //   .then(data => {
  //     let twitter = '';
  //     data.forEach(item => {
  //       let f = new Date(item.tweet.created_at);
  //       twitter += `
  //         <div class="tweet">
  //           <div class="icon"></div>
  //           <div class="tweetTexto">
  //             <p class="texto">${item.tweet.text}</p>
  //             <p class="fecha">${f.toLocaleDateString('en-US')}</p>
  //           </div>
  //         </div>`;
  //     });
  //     console.log(twitter);
  //     document.getElementById('tweetContainer').innerHTML = twitter;
      
  //   });
  // }

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
