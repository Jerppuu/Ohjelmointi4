import kartta from './imgs/karttaesim.png';
import {Component, useRef} from "react";
const mapImgURL = "localhost:3002/imgs/map.svg"

const serverPort = 3002;
const serverAddr = "http://localhost:"
const api = "/api/map";

// TODO: finish map

class Map extends Component {
	componentDidMount() {
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext("2d");
		const img = this.refs.image;
		img.onload = () => {
			ctx.drawImage(img,0,0);
		}
	}


	getMap() {
		async function getForecast(cityName_var) {
			var requestOptions = {
				method: 'GET',
				redirect: 'follow'
			};
			fetch(serverAddr + serverPort + api, requestOptions)
				.then(response => response.json())
				.catch(error => console.log('error', error));
		}
	}
	render() {
		return (
		<>
			<div>
				<img ref={"image"} src={mapImgURL}/>
			</div>
			<div>
				<canvas ref={"canvas"} width={"200px"} height={"500px"}/>
			</div>
		</>
		)
		}
}

export default Map;

/*
<div className="map">
	<img src={kartta} alt="Map"/>
</div>
*/