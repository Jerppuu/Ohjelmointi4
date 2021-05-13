function TodayPreview(props) {

	const serverAddr = props.configs.serverAddr
	const serverPort = props.configs.serverPort
	const apiImgs = props.configs.apiImgs

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
	let imgURL = serverAddr + serverPort + apiImgs + props.daily.symbol + ".png";
	let tempAvg = ((props.daily.maxTemp + props.daily.minTemp) / 2).toFixed(0);
	let previewLocation = props.location[0];
	if (props.location[1]!=="Suomi")
		previewLocation = `${previewLocation}, ${props.location[1]}`;

	return(
		<div className="todayView">
			<div>
				<p style={{fontSize: "20pt", margin: "10px"}}>{previewLocation} nyt </p>
				<p style={{fontSize: "20pt", margin: "10px"}}>{tempAvg}°C</p>
			</div>
			<div>
				<img src={imgURL} alt="weather" height={"75px"}/>
			</div>

		</div>
	);
}
// <canvas id = "today" style={{height: "100px"}}/>
export default TodayPreview;