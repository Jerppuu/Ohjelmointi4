import React from 'react';

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
		"Su", "Ma", "Ti", "Ke", "To", "Pe", "La"
	];
	let path = "http://localhost:3002/imgs/";
	let weekday = weekdays[new Date(props.daily.date).getDay()]; // results in day abbr.
	let imglink = path + props.daily.symbol + ".png";
	let tempAvg = ((props.daily.maxTemp + props.daily.minTemp) / 2).toFixed(0);

	return (
		<div>
			<div style={{height: "100px",backgroundColor: "#aaa"}}>
				{weekday}
				<img src={imglink} alt="weather" height={"100px"}/>
				{tempAvg}
			</div>
		</div>
	);
}
// <canvas id = "today" style={{height: "100px"}}/>
export default TodayPreview;