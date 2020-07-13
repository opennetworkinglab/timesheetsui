import {Component, Input} from '@angular/core';
import {TsWeek, TsweeksService} from "./tsweeks.service";
import {TsDay, TsdaysService} from "./tsdays.service";
import {generate} from "rxjs";

const dayMs = 24 * 60 * 60 * 1000;

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
  days: Map<number, TsDay> = new Map();
  currentWeekId: number;

  constructor(
    private tsweeksService: TsweeksService,
    private tsdayssService: TsdaysService
  ) {
    const dateTimeNow = Date.now();
    console.log('Current time is', dateTimeNow);

    tsweeksService.getWeeks().subscribe(
      (weekdata: TsWeek) => {
        this.weeks.set(weekdata.id, weekdata);
        if ((this.weekid === undefined || this.year === undefined) &&
          weekdata.begin < dateTimeNow && weekdata.end + dayMs - 1 > dateTimeNow) {
          this.currentWeekId = weekdata.id;
          this.weekid = weekdata.weekno;
          this.year = weekdata.year;
          console.log('Current week is', weekdata);
        }
      },
      error => console.log('error getting weeks', error),
      () => {
        this.changeWeek(0)
      }
    );
  }

  changeWeek(delta: number) {
    if (this.weeks.get(this.currentWeekId + delta) === undefined) {
      return;
    }
    this.currentWeekId = this.currentWeekId + delta;
    this.days.clear();
    this.tsdayssService.getDays(this.email, this.currentWeekId).subscribe(
      (daydata: TsDay) => {
        this.days.set(daydata.day, daydata)
      },
      error => console.log('error getting days', error),
      () => {
        if (this.days.size < 7) { // If there are no day records for a week, add them
          // Add the days
          generate(
            this.weeks.get(this.currentWeekId).begin,
            x => x <= this.weeks.get(this.currentWeekId).end,
            x => x + 24 * 60 * 60 * 1000
          ).subscribe(
            (ms) => {
              const newDay = {
                email: this.email,
                day: ms,
                weekid: this.currentWeekId
              } as TsDay;
              if (this.days.get(ms) === undefined) {
                this.days.set(ms, newDay);
              }
            }
          );
        }
      }
    )
  }

  isWeekend(dayMs: number): boolean {
    const date = new Date(dayMs);
    if (date.getDay() === 6 || date.getDay() === 0) {
      return true
    }
    return false;
  }
}
