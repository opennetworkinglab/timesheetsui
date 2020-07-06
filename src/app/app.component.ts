import {Component, Input} from '@angular/core';
import {TsWeek, TsweeksService} from "./tsweeks.service";
import {TsDay, TsdaysService} from "./tsdays.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input() email: string = 'sean@opennetworking.org';
  @Input() weekid: number;
  @Input() year: number;
  title = 'timesheetsui';
  weeks: Map<number, TsWeek> = new Map();
  days: Map<string, TsDay> = new Map();
  currentWeekId: number;

  constructor(
    tsweeksService: TsweeksService,
    tsdayssService: TsdaysService
  ) {
    const dateTimeNow = Date.now();
    console.log('Current time is', dateTimeNow);

    tsweeksService.getWeeks().subscribe(
      (weekdata: TsWeek) => {
        this.weeks.set(weekdata.id, weekdata);
        if ((this.weekid === undefined || this.year === undefined) &&
          weekdata.begin < dateTimeNow && weekdata.end > dateTimeNow) {
          this.currentWeekId = weekdata.id;
          this.weekid = weekdata.weekno;
          this.year = weekdata.year;
          console.log('Current week is', weekdata);
        }
      },
      error => console.log('error getting weeks', error),
      () => {
        tsdayssService.getDays(this.email, this.currentWeekId).subscribe(
          (daydata: TsDay) => {
            this.days.set(daydata.day, daydata)
          },
          error => console.log('error getting days', error)
        )
      }
    );


  }
}
