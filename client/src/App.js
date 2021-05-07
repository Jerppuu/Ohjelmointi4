import React, {Component} from 'react';
import Logo from "./Logo";
import Search from "./Search";
import Map from "./Map";
import TodayPreview from "./TodayPreview";
import ForecastView from "./ForecastView";

async function getForecast(cityName_var){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://localhost:3002/api/search/" + cityName_var, requestOptions)
        .then(response => response.json())
        .then(result => parseForecast(result))
        .then(result => {
            this.setState({daily: result[0]});
            this.setState({hourly: result[1]});
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

    constructor (props) {

        super(props);
        this.state = {
            daily : null,
            hourly : null
        };
        getForecast = getForecast.bind(this);

    }

    componentDidMount() {
        getForecast("Oulu");
    }

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
                        <TodayPreview daily = {this.state.daily[0]}/>
                        <ForecastView daily = {this.state.daily} hourly = {this.state.hourly} />
                    </div>}
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
        </div>);
    }
}

export default App;