import React, {} from 'react';
import Logo from "./Logo";
import Search from "./Search";
import TodayPreview from "./TodayPreview";
import WeekView from "./WeekView";
import Map from "./Map";
import DayView from "./DayView";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: false};
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    buttonClicked() {
        this.setState({value: !this.state.value});
    }




    render() {
        return (
            <div>
                <React.StrictMode>
                    <body>
                    <div className="header">
                        <Logo/>
                        <Search/>
                    </div>

                    <div className="mainBody">
                        <div className="leftSide">
                            <TodayPreview/>
                            <div className={this.state.value ? "hidden" : ""}>
                                <WeekView/>
                            </div>
                            <div className={this.state.value ? "" : "hidden"}>
                                <DayView/>
                            </div>

                        </div>
                        <Map/>
                    </div>
                    <button onClick={this.buttonClicked}>Testinappula</button>

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
                    </body>
                </React.StrictMode>
            </div>
        );
    }
}

export default App;