import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import TodayPreview from './TodayPreview';
import Search from './Search';
import WeekView from './WeekView.js';
import Map from './Map';
import Logo from "./Logo";


ReactDOM.render(
    <React.StrictMode>
        <div className="header">
            <div className="row">
                <Logo/>
                <Search/>
            </div>
        </div>

        <div className="mainBody">
            <div>
                <div className="row">
                    <TodayPreview/>
                </div>

                <div className="row">
                    <WeekView/>
                </div>
            </div>
            <div>
                <Map/>
            </div>
        </div>

        <nav className="navbar navbar-expand-sm bg-primary navbar-dark" style={{position: "fixed",bottom: 0, width: "100%", height: "30px"}}>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#">Meistä</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Ohjeet</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Sivustokartta</a>
                </li>
            </ul>
        </nav>
    </React.StrictMode>,
  document.getElementById('root')
);

