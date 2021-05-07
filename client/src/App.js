import * as React from 'react';
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

    let promise = fetch("http://localhost:3001/api/search/" + cityName_var, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
    let response = await promise;
    //console.log(JSON.stringify(response));
    let daily_var = [], hourly_var = [];
    [daily_var, hourly_var] = parseForecast(response);
    this.setState({daily: daily_var})
    //setDaily(daily_var);
    this.setState({hourly: hourly_var})
    //setHourly(hourly_var);
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

class App extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            daily : "dailyst",
            hourly : "hourlystate"
        };
        getForecast = getForecast.bind(this);
    }
    // kun sivusto latautuu


    /*

		shouldComponentUpdate() {}


		static getDerivedStateFromProps() {}

		getSnapshotBeforeUpdate() {}

		componentWillUnmount() {}
	*/
    componentDidUpdate() {

    }

    componentDidMount(){
        getForecast("Oulu");
    }

    render() {
        return (<div>
            <div className="header">
                <Logo/>
                <Search getForecast = {getForecast}/>
            </div>

            <div className="mainBody">
                <div className="leftSide">
                    <TodayPreview daily = {this.state.daily}/>
                    <ForecastView forecast = {this.state}/>
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
        </div>);
    }
}

export default App;