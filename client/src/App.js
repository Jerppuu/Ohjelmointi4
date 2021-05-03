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
    const [dayName, setDay] = useState(0);
    const [responseJSON, setResponseJSON] = useState(null);

    function viewStateHandlerWeek(dayName_var) {
        setCheck(prevCheck => !prevCheck);
        setDay(dayName_var);
    }

    function viewStateHandlerDay () {
        setCheck(prevCheck => !prevCheck);
    }

    async function getForecast (cityName_var){

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        let promise = fetch("http://localhost:3001/api/search/" + cityName_var, requestOptions)
            .then(response => response.json())
            .catch(error => console.log('error', error));
        let response = await promise;
        console.log(JSON.stringify(response));
        setResponseJSON(response);


    }





    return (
        <div>
                    <div className="header">
                        <Logo/>
                        <Search getForecast = {getForecast}/>
                    </div>

                    <div className="mainBody">
                        <div className="leftSide">

                            <TodayPreview/>
                            <div className={check? "hidden" : ""}>
                                <WeekView  buttonPress = {viewStateHandlerWeek}/>
                            </div>
                            <div className={check? "" : "hidden"}>
                                <DayView buttonPress={viewStateHandlerDay}  day= {dayName} setDay = {setDay}  />
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