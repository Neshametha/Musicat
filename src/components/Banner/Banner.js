import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import ReactDOM from 'react-dom';
import Cam from '../Banner/Camera/camera';

import './banner.css';

export default function Banner() {
  return (
    <section className='banner' id='home'>
    <div className='banner-text'>
      <img src=''></img>
      <p className="date">Musicat, the cat that knows what you wanna hear.</p>
      <div className='banner-buttons'>
        <button><Link to='/#camera'>Log in with Spotify!</Link></button>
      </div>
    </div>
    </section>
  );
}
