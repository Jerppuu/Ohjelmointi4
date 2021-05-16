import {useEffect, useRef} from "react";
import {store} from "react-notifications-component";

function Map(props){

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
					let date = new Date(result.map[0].time)
					ctx.font = "18px DejaVu Sans";
					ctx.fillText(`Tänään ${date.getHours()}:${date.getMinutes()}`, 0,20);
					ctx.font = "20px DejaVu Sans";
					result.map.forEach(
						(loc) => {
							let symbolImg = new Image(40, 40);
							symbolImg.onload = () => {
								ctx.drawImage(symbolImg, 0, 0, 150, 150, loc.map[1], loc.map[2], 50, 50);
								if (loc.temperature>24)ctx.fillStyle = "red";
								else if (loc.temperature<-20)ctx.fillStyle = "blue";
								else ctx.fillStyle = "black";
								ctx.fillText(loc.temperature + "°C", loc.map[1], loc.map[2]+70);
							}
							symbolImg.src = serverAddr + serverPort + apiImgs + loc.symbol + ".png";
						}
					)
				})
				.catch(error => {
					store.addNotification({
						title: 'Meidän Virhe!',
						message: error.usermessage,
						type: 'warning',                         // 'default', 'success', 'info', 'warning'
						container: 'bottom-right',                // where to position the notifications
						animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
						animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
						dismiss: {
							duration: 5000
						}
					});

				});
			}
	});

	return (
			<>
				<div className="map">
					<canvas ref={canvasRef} width={"250px"} height={"500px"}/>
					<img ref={imageRef} src={serverAddr+serverPort+apiImgs+mapImg} className={"hidden"} alt={"Sääkartta"}/>
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