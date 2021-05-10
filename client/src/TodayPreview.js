import React from 'react';

const imgURL = "http://localhost:3002/imgs/";

function TodayPreview(props) {

	// {
	// "date":"2021-05-05",
	// "symbol":"d300",
	// "maxTemp":7,
	// "minTemp":-2,
	// "precipAccum":0.1,
	// "maxWindSpeed":3,
	// "windDir":55
	// }

	let weekdays = [
		"Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"
	];

	let weekday = weekdays[new Date(props.daily.date).getDay()]; // results in day abbr.
	let imglink = imgURL + props.daily.symbol + ".png";
	let tempAvg = ((props.daily.maxTemp + props.daily.minTemp) / 2).toFixed(0);

	return (
		<div className="todayView">
			<div>
				<p style={{fontSize: "20pt", margin: "10px"}}>{props.municipality} nyt </p>
				<p style={{fontSize: "20pt", margin: "10px"}}>{tempAvg}°C</p>
			</div>
			<div>
				<img src={imglink} alt="weather" height={"75px"}/>
			</div>

		</div>
	);
}
// <canvas id = "today" style={{height: "100px"}}/>
export default TodayPreview;