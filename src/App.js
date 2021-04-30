import * as React from 'react';
import Logo from "./Logo";
import Search from "./Search";
import Map from "./Map";
import {useState} from "react";
import TodayPreview from "./TodayPreview";
import WeekView from "./WeekView";
import DayView from "./DayView";



export function App() {
    const [check, setCheck] = useState(false);

    function viewStateHandler() {
        setCheck(prevCheck => !prevCheck);

    }

    return (
        <div>
                    <div className="header">
                        <Logo/>
                        <Search/>
                    </div>

                    <div className="mainBody">
                        <div className="leftSide">

                            <TodayPreview/>
                            <div className={check? "hidden" : ""}>
                                <WeekView  buttonPress = {viewStateHandler}/>
                            </div>
                            <div className={check? "" : "hidden"}>
                                <DayView  buttonPress = {viewStateHandler}/>
                            </div>
                            
                        </div>
                        <Map/>
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
        </div>
    );
}