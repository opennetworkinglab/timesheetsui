import {Component, Input} from '@angular/core';
import {TsWeek, TsweeksService} from "./tsweeks.service";

export interface DayRecord {
  dayDate: string;
  workedHours: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input() email: string;
  @Input() weekid: number;
  title = 'timesheetsui';
  weekno: number = 0;
  year: number = 2020;
  days: DayRecord[] = [];
  weeks: Map<number, TsWeek> = new Map();
  currentWeekId: number;

  constructor(tsweeksService: TsweeksService) {
    let dateTimeNow = new Date();
    console.log('Current time is', dateTimeNow);

    tsweeksService.getWeeks().subscribe(
      (weekdata: TsWeek) => {
        this.weeks.set(weekdata.id, weekdata);
        if (weekdata.begin < dateTimeNow && weekdata.end > dateTimeNow) {
          this.currentWeekId = weekdata.id;
          console.log('Current week is', weekdata);
        } else {
          console.log('Trying week', weekdata);

        }
      },
      error => console.log('error getting weeks', error)
    )

  }
}
