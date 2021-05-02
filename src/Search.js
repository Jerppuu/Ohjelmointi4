import React, {useRef} from "react";
function Search() {

	const inputCity = useRef();

	function handleSearch (){
		const city = inputCity.current.value;
		if (city === '') return;
		alert(city);
		inputCity.current.value = null;
	}

	return (
		<div>
			<input ref={inputCity} list={"paikkakunta-lista"} id={"valitse-paikkakunta"} type="text"/>
			<datalist id={"paikkakunta-lista"}>
				<option value={"kuusamo"}/>
				<option value={"oulu"}/>
				<option value={"helsinki"}/>
			</datalist>
			<button onClick={handleSearch}>Hae</button>
		</div>
	);
}

export default Search;