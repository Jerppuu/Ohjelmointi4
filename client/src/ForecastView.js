import {useState} from "react";


function ForecastView(props) {

	const [switchMainView, setSwitchMainView] = useState(false);
	const [switchWeekView, setSwitchWeekView] = useState(false);
	const [dayNum, setDayNum] = useState(0);
	const daily = props.daily;
	let hourly = null;
	const maxDays = 14;

	const serverAddr = props.configs.serverAddr
	const serverPort = props.configs.serverPort
	const apiImgs = props.configs.apiImgs

	if (props.hourly!==null && hourly===null) hourly = parseDaySpesific(props.hourly);

	function parseDaySpesific(hourly) {
		let entriesByDay = new Map();
		hourly.forEach(entry => {
			let day = entry.time.split("T")[0];
			if (!entriesByDay.has(day))
				entriesByDay.set(day,[entry]);
			else {
				let entries = entriesByDay.get(day);
				entries.push(entry);
				entriesByDay.set(day,entries);
			}
		});
		return Array.from(entriesByDay);

	}

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
		for (let j = start; j <= (end); j++) {
			let item;
			!disabled? 	item = 	<button key={j} className="day" onClick={() => {setSwitchMainView(!switchMainView);setDayNum(j);}} >
									{getDayForecast(daily[j])}
								</button> :
						item = 	<button key={j} className="dayNextWeek">
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
					{hour_var}:00
					<img src={imglink_var} alt="hourweather" height={"50px"}/>
					{hour.temperature}°C
				</div>
	}
	function createHours() {
		let content = [];
		for (let i=0;i<=hourly[dayNum][1].length-1;i=i+2)
		{
			content.push(	<button key={i} className="hour">
								{getHourForecast(hourly[dayNum][1][i])}
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
							{createDays(0,7,false)}
						</div>
					</div>

						<div className={switchWeekView? "" : "hidden"}>
							<div className="weekdays">
								{createDays(8,maxDays-1,true)}
							</div>
						</div>

					<div className={"nav"}>
						<button onClick={() =>{setSwitchWeekView(!switchWeekView)}} className="navButton" disabled={!switchWeekView}>Edellinen</button>
						<div>{switchWeekView? "Seuraava" : "Nykyinen"}</div>
						<button onClick={() =>{setSwitchWeekView(!switchWeekView)}} className="navButton" disabled={switchWeekView}>Seuraava</button>
					</div>
				</div>
				<div className={switchMainView? "" : "hidden"}>
					<div className="dayheader">
						{getDayName(hourly[dayNum][1][0].time)}
					</div>
					<div className="dayhours">
						{createHours()}
					</div>
					<div className="nav">
						<button onClick={()=>{setDayNum(dayNum -1)}} className="navButton" disabled={dayNum <= 0}>Edellinen</button>
						<button onClick={()=>{setSwitchMainView(!switchMainView)}} className="navButton">Takaisin</button>
						<button onClick={()=>{setDayNum(dayNum +1)}}  className="navButton" disabled={dayNum >= 7}>Seuraava</button>
					</div>
				</div>
			</div>
		);
}

export default ForecastView;