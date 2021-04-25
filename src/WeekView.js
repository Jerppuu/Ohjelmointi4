

function WeekView() {
	return (
		<div>
			<div className="weekdays">
				<div className="day" style={{height: "100px", width: "75px", backgroundColor: "#ddd"}}>Ma</div>
				<div className="day" style={{height: "100px", width: "75px",backgroundColor: "#ccc"}}>Ti</div>
				<div className="day" style={{height: "100px", width: "75px",backgroundColor: "#bbb"}}>Ke</div>
				<div className="day" style={{height: "100px", width: "75px",backgroundColor: "#aaa"}}>To</div>
				<div className="day" style={{height: "100px", width: "75px",backgroundColor: "#999"}}>Pe</div>
				<div className="day" style={{height: "100px", width: "75px",backgroundColor: "#888"}}>La</div>
			</div>
			<div className="nav" style={{gap: "10px", justifyContent: "space-evenly"}}>
				<div style={{backgroundColor: "lightblue"}}>edellinen</div>
				<div >viikko 1</div>
				<div style={{backgroundColor: "lightblue"}}>seuraava</div>
			</div>
		</div>
	);
}

export default WeekView;