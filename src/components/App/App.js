import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import Banner from '../Banner/Banner';
import Footer from '../Footer/Footer';
import Nav from '../Nav/Nav';
import About from '../About/About';
import Authentication from '../authentication/authentication';

import './app.css';

const MainApp = () => (
  <div className='app'>
    <Nav />
    <div className='bg1'>
    <Authentication />
    <Banner />
    <Camera />
    <About />
    </div>
    <Footer />
  </div>
);

// hold state to know if there is an active user session
const App = () => (
  <Router>
    <Switch>
      <Route exact path='/' component={MainApp}></Route>
    </Switch>
  </Router>
);

export default App;
