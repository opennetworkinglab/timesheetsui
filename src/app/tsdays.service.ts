import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TsWeek} from "./tsweeks.service";
import {mergeMap} from "rxjs/operators";
import {from, Observable} from "rxjs";
import {timesheets_rest_url} from "../environments/environment";

export interface TsDay {
  email: string;
  day: string;
  weekid: number;
  worked_mins: number;
  holiday_min: number;
}

@Injectable({
  providedIn: 'root'
})
export class TsdaysService {
  configUrl = timesheets_rest_url + '/tsday';

  constructor(private http: HttpClient) { }

  getDays(email: string, weekid: number): Observable<TsDay> {
    console.log('Getting days for', email, weekid);
    return this.http.get<TsDay[]>(this.configUrl + '?email='+email+'&weekid='+weekid).pipe(
      mergeMap((items: TsDay[]) => from(items))
    );
  }
}
