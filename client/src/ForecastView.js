import React, {Component, useState} from "react";


function ForecastView(props) {

	const [switchMainView, setSwitchMainView] = useState(false);
	const [switchWeekView, setSwitchWeekView] = useState(false);
	const [dayNum, setDayNum] = useState(0);
	let daily = props.daily;
	let hourly = props.hourly;
	//const [daily, setDaily] = useState(props.daily);
	//const [hourly, setHourly] = useState(props.hourly);

	function getDayName(date) {

		let names = [
			"Su","Ma","Ti","Ke","To","Pe","La"
		];
		let var_date = new Date(date);
		let dateName = names[var_date.getDay()];
		let dayNum = var_date.getDate();
		let monthNum = var_date.getMonth()+1;
		return dateName+" "+dayNum+"."+monthNum;
	}

	function getDayForecast(day) {
		let path = "http://localhost:3002/imgs/";
		let imglink = path + day.symbol + ".png";
		let tempAvg = ((day.maxTemp + day.minTemp) / 2).toFixed(0);
		return <div><img src={imglink} alt="dayweather" height={"50px"}/>{tempAvg}</div>
	}

	function createDays(start,end,disabled){
		let content = [];
		for (let j=start;j<(end+1);j++){
			content.push(<button onClick={() => {
				setSwitchMainView(!switchMainView);setDayNum(j)
				}} className="day" disabled={disabled}>{getDayName(daily[j].date)} {getDayForecast(daily[j])}</button>
				);
		}
		return content;
	}

	// createDays for testing purposes for now
	return (
			<div>
				<div className={switchMainView? "hidden" : ""}>
					<div className={switchWeekView? "hidden" : ""}>
						<div className="weekdays">
							{createDays(0,6,false)}
						</div>
					</div>
					<div className={switchWeekView? "" : "hidden"}>
						<div className="weekdays">
							{createDays(7,13,true)}
						</div>
					</div>

					<button onClick={() =>{setSwitchWeekView(!switchWeekView)}} className="navButton" disabled={!switchWeekView}>Edellinen</button>
					<div>{switchWeekView? "Seuraava" : "Nykyinen"}</div>
					<button onClick={() =>{setSwitchWeekView(!switchWeekView)}} className="navButton" disabled={switchWeekView}>Seuraava</button>
				</div>
				<div className={switchMainView? "" : "hidden"}>
					<p> HELLO! DAY - {dayNum} - VIEW</p>
					<button onClick={()=>{setSwitchMainView(!switchMainView)}} className="navButton" >Takaisin</button>
					<button onClick={()=>{setDayNum(dayNum -1)}} className="navButton" disabled={dayNum === 0}>Edellinen</button>
					<button onClick={()=>{setDayNum(dayNum +1)}}  className="navButton" disabled={dayNum === 6}>Seuraava</button>
				</div>
			</div>
		);
}

export default ForecastView;