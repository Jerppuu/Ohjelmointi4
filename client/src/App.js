import * as React from 'react';
import Logo from "./Logo";
import Search from "./Search";
import Map from "./Map";
import TodayPreview from "./TodayPreview";
import WeekView from "./WeekView";
import DayView from "./DayView";



class App extends React.Component {


    //const [check, setCheck] = useState(false);
    //const [dayName, setDay] = useState(0);
    //const [daily, setDaily] = useState();
    //const [hourly, setHourly] = useState();


    constructor (props) {
        super(props);
        this.state = {
            check : false,
            dayName : null,
            daily : null,
            hourly : null
        }
    }
/*
    shouldComponentUpdate() {}

    componentDidUpdate() {}

    static getDerivedStateFromProps() {}

    getSnapshotBeforeUpdate() {}

    componentWillUnmount() {}
*/
    viewStateHandlerWeek(dayName_var) {
        this.setState({check: !this.state.check})
        //setCheck(prevCheck => !prevCheck);
        this.setState({dayname: dayName_var})
        //setDay(dayName_var);
    }

    viewStateHandlerDay () {
        this.setState({check: !this.state.check})
        //setCheck(prevCheck => !prevCheck);
    }

    dayNameHandler (dayName_var){
        this.setState({dayName: dayName_var});
    }

    async getForecast(cityName_var){

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
        [daily_var, hourly_var] = this.parseForecast(response);
        this.setState({daily: daily_var})
        //setDaily(daily_var);
        this.setState({hourly: hourly_var})
        //setHourly(hourly_var);

    }

    parseForecast(forecastJSON){
        let daysArr = [], hoursArr = [];

        forecastJSON.forecast[0].daily.forEach(day => {
            daysArr.push(day);
        });
        forecastJSON.forecast[1].hourly.forEach(hour => {
            hoursArr.push(hour);
        });
        return [daysArr,hoursArr];
    }

    // kun sivusto latautuu
    componentDidMount(){
        this.getForecast("Helsinki")
    }

    render() {
        return (<div>
            <div className="header">
                <Logo/>
                <Search getForecast = {this.getForecast}/>
            </div>

            <div className="mainBody">
                <div className="leftSide">

                    <TodayPreview daily = {this.state.daily}/>

                    <div className={this.state.check? "hidden" : ""}>
                        <WeekView  buttonPress = {this.viewStateHandlerWeek}/>
                    </div>
                    <div className={this.state.check? "" : "hidden"}>
                        <DayView buttonPress={this.viewStateHandlerDay}  day= {this.state.dayName} dayNameHandler ={this.dayNameHandler} />
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
        </div>);
    }
}

export default App;