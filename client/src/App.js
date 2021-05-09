import React, {Component} from 'react';
import Logo from "./Logo";
import Search from "./Search";
import Map from "./Map";
import TodayPreview from "./TodayPreview";
import ForecastView from "./ForecastView";

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
                case 404:
                    throw "not found";
                case 400:
                    throw "server err";
                default:
                    throw "server err";
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

class App extends Component {

    constructor () {
        super();
        this.state = {
            daily : null,
            hourly : null,
            municipality : "Oulu"
        };
        getForecast = getForecast.bind(this);
    }

    componentDidMount() {
        getForecast(this.state.municipality);
    }
    //  TODO: implement bottom links
    render() {
        return (<div>
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
            <nav className="navbar navbar-expand-sm bg-primary navbar-dark" style={{position: "fixed",bottom: 0, width: "100%", height: "30px"}}>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="#notready">Meistä</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#notready">Ohjeet</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#notready">Sivustokartta</a>
                    </li>
                </ul>
            </nav>
        </div>);
    }
}

export default App;