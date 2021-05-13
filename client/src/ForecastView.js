import {useState} from "react";


function ForecastView(props) {

	const [switchMainView, setSwitchMainView] = useState(false);
	const [switchWeekView, setSwitchWeekView] = useState(false);
	const [, setDayNum] = useState(0);
	const [hourNum, setHourNum] = useState(0);
	const maxDays = 14;
	const maxHours = 168;
	let daily = props.daily;
	let hourly = props.hourly;

	const serverAddr = props.configs.serverAddr
	const serverPort = props.configs.serverPort
	const apiImgs = props.configs.apiImgs

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
	// {
	// "date":"2021-05-05",
	// "symbol":"d300",
	// "maxTemp":7,
	// "minTemp":-2,
	// "precipAccum":0.1,
	// "maxWindSpeed":3,
	// "windDir":55
	// }
	function getDayForecast(day) {
		let path = serverAddr + serverPort + apiImgs;
		let imglink = path + day.symbol + ".png";
		let tempAvg = ((day.maxTemp + day.minTemp) / 2).toFixed(0);
		return <div>{getDayName(day.date)} <img src={imglink} alt="dayweather" height={"50px"}/>{tempAvg}°C</div>
	}
	function createDays(start,end,disabled) {
		let content = [];
		for (let j = start-1; j < (end); j++) {
			let item;
			!disabled? 	item = 	<button className="day" onClick={() => {setSwitchMainView(!switchMainView);setDayNum(j);setHourNum(24*j)}} >
									{getDayForecast(daily[j])}
								</button> :
						item = 	<button className="dayNextWeek">
									{getDayForecast(daily[j])}
								</button>;
			content.push(item);
		}
		return content;
	}
	/*{
		"time": "2021-05-03T19:00+03:00",
		"symbol": "d100",
		"temperature": 6,
		"feelsLikeTemp": 5,
		"windSpeed": 2,
		"windGust": 5,
		"windDir": 336,
		"windDirString": "NW",
		"precipProb": 1,
		"precipAccum": 0
	}*/
	function getHourForecast(hour) {
		let path_var = serverAddr + serverPort + apiImgs;
		let imglink_var = path_var + hour.symbol + ".png";
		let hour_var = new Date(hour.time).getHours();
		return 	<div>
					{getDayName(hour.time)} {hour_var}:00
					<img src={imglink_var} alt="hourweather" height={"50px"}/>
					{hour.temperature}°C
				</div>
	}
	function createHours(start,end) {
		let content = [];
		for (let j = start; j < (end + 1); j=j+2) {
			content.push(	<button className="hour">
								{getHourForecast(hourly[j])}
							</button>
			);
		}
		return content;
	}

	if (daily === null || hourly === null)
		return (<div>Loading...</div>);
	return (
			<div>
				<div className={switchMainView? "hidden" : ""}>
					<div className={switchWeekView? "hidden" : ""}>
						<div className="weekdays">
							{createDays(1,7,false)}
						</div>
					</div>

						<div className={switchWeekView? "" : "hidden"}>
							<div className="weekdays">
								{createDays(8,maxDays,true)}
							</div>
						</div>

					<div className={"nav"}>
						<button onClick={() =>{setSwitchWeekView(!switchWeekView)}} className="navButton" disabled={!switchWeekView}>Edellinen</button>
						<div>{switchWeekView? "Seuraava" : "Nykyinen"}</div>
						<button onClick={() =>{setSwitchWeekView(!switchWeekView)}} className="navButton" disabled={switchWeekView}>Seuraava</button>
					</div>
				</div>
				<div className={switchMainView? "" : "hidden"}>
					<div className="dayhours">
						{createHours(hourNum,hourNum+12)}
					</div>
					<div className="nav">
						<button onClick={()=>{setHourNum(hourNum -24)}} className="navButton" disabled={hourNum <= 0}>Edellinen</button>
						<button onClick={()=>{setSwitchMainView(!switchMainView)}} className="navButton" >Takaisin</button>
						<button onClick={()=>{setHourNum(hourNum +24)}}  className="navButton" disabled={hourNum >= maxHours-24}>Seuraava</button>
					</div>
				</div>
			</div>
		);
}

export default ForecastView;