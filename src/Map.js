import './Map.css';
import kartta from './imgs/karttaesim.png';

function Map(){
	return (
		<div className="map" style={{backgroundColor: "#bbb"}}>
			<img src={kartta}/>
		</div>
	);
}

export default Map;