import React from 'react';
import ScrollReveal from 'scrollreveal';

import './about.css';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.textRef = React.createRef();
  }

  componentDidMount() {
    /* TODO: change animation sequence; center image on text's height */
    const imageConfig = {
      origin: 'bottom',
      duration: 800,
      distance: '30px',
      scale: 0.1,
      opacity: 1,
      easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
    };

    /* TODO: remove delay depending on screen size */
    const textConfig = {
      origin: 'bottom',
      duration: 1000,
      delay: 600,
      distance: '150px',
      easing: 'ease',
    };
    window.sr = ScrollReveal();
    window.sr.reveal(this.imageRef.current, imageConfig);
    window.sr.reveal(this.textRef.current, textConfig);
  }

  // TODO: find cleanup method of ScrollReveal to tear down the object in componentWillUnmount

  render() {
    return (
      <div className='about-container' id='about'>
      <div className='about-content'>
        <div className='about-image' ref={this.imageRef} alt="ohayouuuu"></div>
        <div className='about-text' ref={this.textRef}>
          <h1 className='about-header'>What is Musicat?</h1>
          <p>This lil’ kitten takes a picture of your face (with your permission, of course), and
          builds a playlist on how you appear to feel.
            <br />
            <br />
            We’ve integrated Microsoft Azure’s Face API and Spotify’s API together in JavaScript
            bundled with ReactJS to create this project.
          </p>
        </div>
      </div>
      </div>
    );
  }
}
