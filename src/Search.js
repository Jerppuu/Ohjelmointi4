import './Search.css';

function Search() {
	return (
		<div className="column" style={{height: "100px",backgroundColor: "#ccc"}}>
			<label for={"valitse-paikkakunta"}>Valitse paikkakunta:</label>
			<input list={"paikkakunta-lista"} id={"valitse-paikkakunta"}/>
			<datalist id={"paikkakunta-lista"}>
				<option value={"kuusamo"}/>
				<option value={"oulu"}/>
				<option value={"helsinki"}/>
			</datalist>
		</div>
	);
}

export default Search;