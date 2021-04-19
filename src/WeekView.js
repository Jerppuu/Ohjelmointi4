
import './WeekView.css';

function WeekView() {
	return (
		<div className="column">
			<div className="weekdays" style={{backgroundColor: "#bbb"}}>
				<div className="day" style={{backgroundColor: "#ddd"}}>Ma</div>
				<div className="day" style={{backgroundColor: "#ccc"}}>Ti</div>
				<div className="day" style={{backgroundColor: "#bbb"}}>Ke</div>
				<div className="day" style={{backgroundColor: "#aaa"}}>To</div>
				<div className="day" style={{backgroundColor: "#999"}}>Pe</div>
				<div className="day" style={{backgroundColor: "#888"}}>La</div>
				<div className="day" style={{backgroundColor: "#777"}}>Su</div>
			</div>
			<div className="nav">
				<div style={{backgroundColor: "lightblue"}}>edellinen</div>
				<div >viikko 1</div>
				<div style={{backgroundColor: "lightblue"}}>seuraava</div>
			</div>
		</div>
	);
}

export default WeekView;