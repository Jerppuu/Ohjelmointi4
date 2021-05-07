import React, {Component} from "react";

class ForecastView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			switchMainView : false,
			switchWeekView : false,
			DayNum : 0,
			daily : props.forecast.daily,
			hourly : props.forecast.hourly
		};
	}
	viewStateHandlerWeek(dayName_var) {
		this.dayNum = dayName_var;
		//this.setState({switchWeekView : !this.state.switchWeekView})
	}

	viewStateHandlerDay () {
		this.setState({check: !this.state.check})
		//setCheck(prevCheck => !prevCheck);
	}

	addDay() {
		this.dayNum = this.dayNum + 1;
	}
	subDay() {
		this.dayNum = this.dayNum - 1;
	}
	setDay(num) {
		this.dayNum = num;
	}
	getDayName(date) {

		let names = [
			"Su","Ma","Ti","Ke","To","Pe","La"
		];
		let dateNum = new Date(date).getDay();
		return names[dateNum];
	}
	createDays(start,end){
		let content = [];
		for (let j=start;j<(end+1);j++){
			console.log(this.state.daily[j]);
			/*
			content.push(<button onClick={() => {
				this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:j});
				}} className="day">{this.getDayName(this.state.daily[j].date)}</button>
				);
			*/
		}
		return content;
	}


/*
	shouldComponentUpdate() {}

	componentDidUpdate() {}

	static getDerivedStateFromProps() {}

	getSnapshotBeforeUpdate() {}

	componentWillUnmount() {}
*/
	// kun sivusto latautuu
	componentDidMount(){
		//getForecast("Helsinki")
	}
	// createDays for testing purposes for now
	renderWeekView(){
		return (
			<div>
				<div className={this.state.switchMainView? "hidden" : ""}>
					<div className={this.state.switchWeekView? "hidden" : ""}>
						<div className="weekdays">
							{this.createDays(0,6)}
							<button onClick={() => {this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:0});}} className="day">Su</button>
							<button onClick={() => {this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:1});}} className="day">Ti</button>
							<button onClick={() => {this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:2});}} className="day">Ma</button>
							<button onClick={() => {this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:3});}} className="day">Ke</button>
							<button onClick={() => {this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:4});}} className="day">To</button>
							<button onClick={() => {this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:5});}} className="day">Pe</button>
							<button onClick={() => {this.setState({switchMainView : !this.state.switchMainView}); this.setState({DayNum:6});}} className="day">La</button>
						</div>
					</div>
					<div className={this.state.switchWeekView? "" : "hidden"}>
						<div className="weekdays">
							<button className="day" disabled={true}>Ma</button>
							<button className="day" disabled={true}>Ti</button>
							<button className="day" disabled={true}>Ke</button>
							<button className="day" disabled={true}>To</button>
							<button className="day" disabled={true}>Pe</button>
							<button className="day" disabled={true}>La</button>
							<button className="day" disabled={true}>Su</button>
						</div>
					</div>

					<button onClick={() => this.setState({switchWeekView : !this.state.switchWeekView})} className="navButton" disabled={!this.state.switchWeekView}>Edellinen</button>
					<div>{this.switchWeekView? "Seuraava" : "Nykyinen"}</div>
					<button onClick={() => this.setState({switchWeekView : !this.state.switchWeekView})} className="navButton" disabled={this.state.switchWeekView}>Seuraava</button>
				</div>
				<div className={this.state.switchMainView? "" : "hidden"}>
					<p> HELLO! DAY - {this.state.DayNum} - VIEW{this.state.daily[this.dayNum]}</p>
					<button onClick={()=>this.setState({switchMainView : !this.state.switchMainView})} className="navButton" >Takaisin</button>
					<button onClick={() => this.setState({DayNum : this.state.DayNum -1})} className="navButton" disabled={this.state.DayNum === 0}>Edellinen</button>
					<button onClick={() => this.setState({DayNum : this.state.DayNum +1})} className="navButton" disabled={this.state.DayNum === 6}>Seuraava</button>
				</div>
			</div>
		)
	}



	render() { return this.renderWeekView();}
}

export default ForecastView;