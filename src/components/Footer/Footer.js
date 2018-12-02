import React from 'react';
import './footer.css';

export default function Footer() {
  return (
    <div className="footer">
      <div className="two">
        See our project on:
        <br /><a href="https://github.com/">
          <i className="fab fa-github fa-3x"></i>
        </a>
        <br />
        <br />
        Made with:
        <br /><img src="\src\assets\ShellHacks_Logo_White@4x.png" alt="Shell" height="50px" />
        <img src="\src\assets\logo.svg" className="App-logo" alt="React" height="50px" />
        <img src="\src\assets\mikemura lines white.png" alt="Mikemura" height="50px" />
      </div>
    </div>
  );
}
