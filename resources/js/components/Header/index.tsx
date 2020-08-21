import React from 'react';

export default function Header() {
  return (
    <nav className="border fixed split-nav">
      <div className="nav-brand">
        <h3><a href="#">PhotApp</a></h3>
      </div>

      <div className="collapsible">
        <input id="collapsible1" type="checkbox" name="collapsible1"/>
        <label htmlFor="collapsible1">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </label>
        <div className="collapsible-body">
          <ul className="inline">
            <li><a href="#">1</a></li>
            <li><a href="j">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#">4</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );

}
