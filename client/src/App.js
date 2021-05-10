import React, {Component} from 'react';
import Logo from "./Logo";
import Search from "./Search";
import Map from "./Map";
import TodayPreview from "./TodayPreview";
import ForecastView from "./ForecastView";
import Popup from "./Popup";
import NavBarContent from "./NavBarContent";

const serverPort = ":3002";
const serverAddr = "http://localhost"
const api = "/api/search/";

// TODO: Implement search errors so that user is informed
async function getForecast(cityName_var){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch(serverAddr + serverPort + api + cityName_var, requestOptions)
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                case 400:
                    throw "server err";
                case 404:
                    throw "not found";
                case 408:
                    throw "request timeout"
                default:
                    throw "unhandled server err";
            }})
        .then(result => parseForecast(result))
        .then(result => {
            this.setState({daily: result[0]});
            this.setState({hourly: result[1]});
            this.setState({municipality: cityName_var});
        })
        .catch(error => console.log('error', error));
}

function parseForecast(forecastJSON){
    let daysArr = [], hoursArr = [];
    forecastJSON.forecast[0].daily.forEach(day => {
        daysArr.push(day);
    });
    forecastJSON.forecast[1].hourly.forEach(hour => {
        hoursArr.push(hour);
    });
    return [daysArr,hoursArr];
}

function togglePopup(mode){
    this.setState({popup: mode});
}


class App extends Component {

    constructor () {
        super();
        this.state = {
            daily : null,
            hourly : null,
            municipality : "Oulu",
            popup: 0
        };
        getForecast = getForecast.bind(this);
        togglePopup = togglePopup.bind(this);
    }

    componentDidMount() {
        getForecast(this.state.municipality);
    }
    //  TODO: implement bottom links
    render() {
        return (
            <div>
            <div className="header">
                <Logo/>
                <Search getForecast = {getForecast}/>
            </div>

            <div className="mainBody">
                {(this.state.daily === null)?
                    <div className="leftSide"/>:
                    <div className="leftSide">
                        <TodayPreview daily = {this.state.daily[0]} municipality = {this.state.municipality}/>
                        <ForecastView daily = {this.state.daily} hourly = {this.state.hourly} />
                    </div>}
                <Map/>
            </div>
            <nav className="bottomBar">
                <button onClick={()=>togglePopup(1)} className="bottomButton">Meistä</button>
                <button onClick={()=>togglePopup(2)} className="bottomButton">Ohjeet</button>
                <button onClick={()=>togglePopup(3)} className="bottomButton">Sivustokartta</button>
            </nav>

                <NavBarContent mode={this.state.popup} togglePopup ={togglePopup}/>

        </div>
        );
    }
}

export default App;