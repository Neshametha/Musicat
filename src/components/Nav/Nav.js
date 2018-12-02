import React from 'react';

import NavWide from './NavWide/NavWide';
import NavNarrow from './NavNarrow/NavNarrow';
import NavItem from './NavItem/NavItem';
import './nav.css';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWideScreen: false,
      isDropdownOpen: false,
      windowLocation: '',
      menuItems: [
        {
          text: 'About',
          link: 'about',
        },
      ],
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.scrollToWindowPosition = this.scrollToWindowPosition.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  toggleDropdown() {
    this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  }

  closeDropdown() {
    this.setState({ isDropdownOpen: false });
  }

  scrollToWindowPosition(e) {
    e.preventDefault();
    const jumpLocation = e.target.attributes[0].nodeValue;
    this.state.windowLocation = jumpLocation;
    const anchorElement = document.getElementById(jumpLocation).offsetTop;
    window.scrollTo(0, anchorElement);
  }

  handleResize() {
    if (window.innerWidth >= 840) {
      if (!this.state.isWideScreen) {
        this.setState(prevState => ({
          isWideScreen: true,
          isDropdownOpen: false,
        }));
      }
    } else if (window.innerWidth < 840) {
      if (this.state.isWideScreen) {
        this.setState(prevState => ({
          isWideScreen: false,
          isDropdownOpen: false,
        }));
      }
    }
  }

  componentWillMount() {
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevState) {
    if (this.state.isDropdownOpen && prevState.isDropdownOpen) {
      return;
    }

    const dropDown = document.querySelector('.dropdown');
    let dropDownItems = document.querySelector('.navbar-items');
    if (!this.state.isWideScreen) {
      dropDownItems = document.querySelector('.dropdown-items');
    }
    if (this.state.isDropdownOpen && !prevState.isDropdownOpen) {
      dropDown.addEventListener('click', this.closeDropdown, false);
    } else if (!this.state.isDropdownOpen && prevState.isDropdownOpen) {
      dropDown.removeEventListener('click', this.closeDropdown);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <nav>
        {(() => {
          if (this.state.isWideScreen) {
            return (
              <NavWide>
                {this.state.menuItems.map(item =>
                  <li key={item.text} className='navbar-item'>
                  <NavItem {...item}/>
                  </li>)
                }
              </NavWide>);
          }
          return (
            <NavNarrow toggle={this.toggleDropdown}
            isOpen={this.state.isDropdownOpen}>
              {this.state.menuItems.map(item =>
                <NavItem key={item.text} {...item}/>)
              }
            </NavNarrow>);
        })()}
      </nav>
    );
  }
}
