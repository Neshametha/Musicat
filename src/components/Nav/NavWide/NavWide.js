import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import React from 'react';

import './navWide.css';
// added images to work with here
const NavWide = props =>
    <div className='navbar-container'>
      {(() => {
        if (window.location.pathname === '/') {
          return <HashLink to='/#home' className="logo"></HashLink>;
        }
        return <Link to='/' className="logo"></Link>;
      })()}
      <ul className="navbar-items">
        {props.children}
      </ul>
    </div>;

export default NavWide;
