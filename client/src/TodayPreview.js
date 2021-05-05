import React from 'react';
import {useState} from "react";


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
	try {
		let weekdays = [
			"Su", "Ma", "Ti", "Ke", "To", "Pe", "La"
		];
		let path = "localhost:3001/imgs/";
		let weekday = weekdays[new Date(props.daily[0].date).getDay()]; // results in day abbr.
		let imglink = path + props.daily[0].symbol + ".png";
		let tempAvg = ((props.daily[0].maxTemp + props.daily[0].minTemp) / 2).toFixed(0);
	} catch (err) {
		console.log("Err: ", err);
	}

	return (
		<div>
			{console.log(props.daily)}
			<div style={{height: "100px",backgroundColor: "#aaa"}}>Paikkakunta tänään
				<img src={imglink}/>
				{path}
				{weekday}
				{tempAvg}

			</div>
		</div>
	);
}
// <canvas id = "today" style={{height: "100px"}}/>
export default TodayPreview;