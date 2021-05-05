import React, {useRef} from "react";
import Parser from 'html-react-parser';
import kunnat from "./other/kunnat"

let options = '';
for (let i = 0; i < kunnat.length; i++) {
	options += '<option value="' + kunnat[i] + '"/>\n';
}

function Search(props) {
	const inputCity = useRef();

	function handleSearch (){
		const city = inputCity.current.value;
		if (city === '') return;
		props.getForecast(city);
		inputCity.current.value = null;
	}
	return (
		<div>
			<input ref={inputCity} list={"paikkakunta-lista"} id={"valitse-paikkakunta"} type="text"/>
			<datalist id={"paikkakunta-lista"}>
				{Parser(options)}
			</datalist>
			<button onClick={handleSearch}>Hae</button>
		</div>
	);
}

export default Search;
