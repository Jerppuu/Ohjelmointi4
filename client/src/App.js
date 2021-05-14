import {Component} from 'react';
import ReactNotifications from 'react-notifications-component';

import Logo from "./Logo";
import Map from "./Map";
import TodayPreview from "./TodayPreview";
import ForecastView from "./ForecastView";
import NavBarContent from "./NavBarContent";
import Search from "./Search";
import ErrorNotification from "./ErrorNotification";

import configs from "./configs.json";

const serverAddr = configs.configs.serverAddr;
const serverPort = configs.configs.serverPort;
const apiSearch = configs.configs.apiSearch;
const apiMap = configs.configs.apiMap;
const startLocation = configs.configs.startLocation;

class App extends Component {

    constructor () {
        super();
        this.state = {
            daily : null,
            hourly : null,
            location : startLocation, // [locationCity,locationCountry]
            popup: 0,
            error: 0,
            notification: false
        };
        getForecast = getForecast.bind(this);
        togglePopup = togglePopup.bind(this);
        responseCatch = responseCatch.bind(this);
        setErrorState = setErrorState.bind(this);
    }

    componentDidMount() {
        getForecast(this.state.location[0]);
    }

    render() {
        return (
            <div>
                <ReactNotifications/>
                <div className="header">
                    <Logo/>
                    <Search getForecast = {getForecast}/>
                </div>
                <div className="mainBody">
                    {(this.state.daily === null)?
                        <div className="leftSide"/>:
                        <div className="leftSide">
                            <TodayPreview daily = {this.state.daily[0]} location = {this.state.location} configs = {configs.configs}/>
                            <ForecastView daily = {this.state.daily} hourly = {this.state.hourly} configs = {configs.configs} />
                        </div>}
                        <Map configs = {configs.configs} getMapForecast = {getMapForecast} />
                </div>
                <nav className="bottomBar">
                    <button onClick={()=>togglePopup(1)} className="bottomButton">Meistä</button>
                    <button onClick={()=>togglePopup(2)} className="bottomButton">Ohjeet</button>
                </nav>
                    <NavBarContent mode={this.state.popup} togglePopup ={togglePopup}/>
                {this.state.error>1?<ErrorNotification/>:<div/>}
            </div>
        );
    }
}

export default App;

function togglePopup(mode){
    this.setState({popup: mode});
}
function setErrorState(mode) {
    this.setState({error:mode});
}

async function getForecast(cityName_var){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let errorCode = fetch(serverAddr + serverPort + apiSearch + cityName_var, requestOptions)
        .then(response => responseCatch(response))
        .then(response => parseForecast(response))
        .then(response => {
            this.setState({daily: response[0]});
            this.setState({hourly: response[1]});
            this.setState({location: response[2]});
            return 0;
        }).catch(error => {
            return error;
        });
    return errorCode;
}

function parseForecast(forecastJSON){
    let daysArr = [], hoursArr = [];
    forecastJSON.forecast[0].daily.forEach(day => {daysArr.push(day);});
    forecastJSON.forecast[1].hourly.forEach(hour => {hoursArr.push(hour);});
    return [daysArr,hoursArr,forecastJSON.forecast[2].location];
}


async function getMapForecast() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(serverAddr + serverPort + apiMap, requestOptions)
        .then(response => responseCatch(response))
        .catch(error => console.log('getMapForecast:', error));
}

function responseCatch(response){
        switch (response.status) {
            case 200:
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    if (this.setState!==0)
                        this.setState({error:0});
                    return response.json()
                }
                this.setState({error:2})
                throw 2;
            case 404:
                if (this.setState!==1)
                    this.setState({error:1});
                throw 1;
            case 500:
                if (this.setState!==2)
                    this.setState({error:2});
                throw 2;
            case 504:
                if (this.setState!==3)
                    this.setState({error:3});
                throw 3;
            default:
                if (this.setState!==4)
                    this.setState({error:4});
                throw 4;
        }
}
