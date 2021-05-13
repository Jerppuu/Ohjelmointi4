import React, {Component} from 'react';
import Logo from "./Logo";
import Search from "./Search";
import Map from "./Map";
import TodayPreview from "./TodayPreview";
import ForecastView from "./ForecastView";
import NavBarContent from "./NavBarContent";
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
            errorCode: 0
        };
        getForecast = getForecast.bind(this);
        togglePopup = togglePopup.bind(this);
        responseCatch = responseCatch.bind(this);
    }

    componentDidMount() {
        getForecast(this.state.location[0]);
    }

    render() {
        return (
            <div>
            <div className="header">
                <Logo/>
                <Search getForecast = {getForecast} errorCode = {this.state.errorCode}/>
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
        </div>
        );
    }
}

export default App;

// TODO: Implement search errors so that the user is informed
async function getForecast(cityName_var){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch(serverAddr + serverPort + apiSearch + cityName_var, requestOptions)
        .then(response => responseCatch(response))
        .then(response => parseForecast(response))
        .then(response => {
            console.log(response);
            this.setState({daily: response[0]});
            this.setState({hourly: response[1]});
            this.setState({location: response[2]});
        })
        .catch(error => this.setState({errorCode: error}));
}

function parseForecast(forecastJSON){
    let daysArr = [], hoursArr = [];
    forecastJSON.forecast[0].daily.forEach(day => {daysArr.push(day);});
    forecastJSON.forecast[1].hourly.forEach(hour => {hoursArr.push(hour);});
    return [daysArr,hoursArr,forecastJSON.forecast[2].location];
}

function togglePopup(mode){
    this.setState({popup: mode});
}
async function getMapForecast() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(serverAddr + serverPort + apiMap, requestOptions)
        .then(response => responseCatch(response))
        .catch(error => console.log('error', error));
}

function responseCatch(response){
        switch (response.status) {
        case 200:
            return response.json();
        case 400:
            this.setState({error:1})
            throw "server err";
        case 404:
            this.setState({error:2})
            throw "not found";
        case 408:
            this.setState({error:3})
            throw "request timeout"
        default:
            this.setState({error:4})
            throw "unhandled server err";
        }
}