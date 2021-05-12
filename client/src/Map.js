import {useEffect, useRef} from "react";

// TODO: Does not render properly. Temperature renders fine, but images are left missing. ATM server helps out by delaying dummy JSONs.
function Map(props){

	//const [loaded, setLoaded] = useState(false);
	const serverAddr = props.configs.serverAddr
	const serverPort = props.configs.serverPort
	const mapImg = props.configs.mapImg
	const apiImgs = props.configs.apiImgs
	const canvasRef = useRef(null);
	const imageRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const image = imageRef.current;

		image.onload = () => {
			ctx.drawImage(image, 0, 0, 400, 900, 0, 0, 250, 475);
			props.getMapForecast()
				.then(result => {
					result.map.forEach(
						(loc) => {
							let symbolImg = new Image(40, 40);
							symbolImg.src = serverAddr + serverPort + apiImgs + loc.symbol + ".png";
							ctx.drawImage(symbolImg, 0, 0, 150, 150, loc.map[1], loc.map[2], 50, 50);
							ctx.font = "20px DejaVu Sans";
							ctx.fillText(loc.temperature + "°C", loc.map[1], loc.map[2]+70);
						}
					)
				})
				.catch(error => console.log("error: ", error));
			}
	})

		return (
				<>
					<div className="map">
						<canvas ref={canvasRef} width={"250px"} height={"500px"}/>
						<img ref={imageRef} src={serverAddr+serverPort+apiImgs+mapImg} className={"hidden"}/>
					</div>
				</>
			);

}

export default Map;

/*{
 "map":[
    {
      "time":"2021-05-11T13:47+03:00",
      "symbol":"d300",
      "symbolPhrase":"cloudy",
      "temperature":15,
      "feelsLikeTemp":15,
      "relHumidity":75,
      "dewPoint":11,
      "windSpeed":3,
      "windDirString":"SW",
      "windGust":10,
      "precipProb":6,
      "precipRate":0,
      "cloudiness":87,
      "thunderProb":0,
      "uvIndex":2,
      "pressure":1012.05,
      "visibility":33539,
      "map":["Sodankylä",110,110]},
    }
    ,
    ...
    ]
}
 */