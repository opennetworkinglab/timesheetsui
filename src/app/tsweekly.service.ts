import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {timesheets_rest_url} from "../environments/environment";
import {from, Observable} from "rxjs";
import {map, mergeMap} from "rxjs/operators";
import {TsDay} from "./tsdays.service";

export interface TsWeekly {
  email: string;
  weekid: number;
  document: string;
  preview: string;
  signed: number;
}

@Injectable({
  providedIn: 'root'
})
export class TsweeklyService {
  configUrl = timesheets_rest_url + '/tsweekly';

  constructor(private http: HttpClient) { }

  getWeeklies(email: string, weekid: number): Observable<TsWeekly> {
    console.log('Getting weeklies for', email, weekid);
    return this.http.get<TsWeekly[]>(this.configUrl + '?email='+email+'&weekid='+weekid).pipe(
      mergeMap((items: TsWeekly[]) => from(items))
    );
  }
}
