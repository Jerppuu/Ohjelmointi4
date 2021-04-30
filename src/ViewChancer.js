import * as React from 'react';
import TodayPreview from "./TodayPreview";
import WeekView from "./WeekView";
import DayView from "./DayView";



export function ViewChancer(check) {
    return (
        <div>
            <div>
                <TodayPreview/>
                <div className={check.state ? "hidden" : ""}>
                    <WeekView/>
                </div>
                <div className={check.state ? "" : "hidden"}>
                    <DayView/>
                </div>
            </div>
        </div>
    );
};