import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TsWeek } from './tsweeks.service';
import { map, mergeMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { TIMESHEETS_REST_URL } from '../environments/environment';

export interface TsDay {
  email: string;
  day: number;
  weekid: number;
  worked_mins: number;
  holiday_min: number;
}

@Injectable({
  providedIn: 'root'
})
export class TsdaysService {
  configUrl = TIMESHEETS_REST_URL + '/tsday';

  constructor(private http: HttpClient) { }

  getDays(email: string, weekid: number): Observable<TsDay> {
    console.log('Getting days for', email, weekid);
    return this.http.get<TsDay[]>(this.configUrl + '?email=' + email + '&weekid=' + weekid).pipe(
      mergeMap((items: TsDay[]) => from(items)),
      map((item: TsDay) => new class implements TsDay {

        email: string = item.email;
        day: number = Date.parse((item.day as unknown) as string);
        weekid: number = item.weekid;
        worked_mins: number = item.worked_mins;
        holiday_min: number = item.holiday_min;
      })
    );
  }
}
