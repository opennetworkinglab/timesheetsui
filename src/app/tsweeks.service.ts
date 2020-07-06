import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, from } from 'rxjs';
import {map, mergeMap } from 'rxjs/operators';

export interface TsWeek{
  id: number;
  year: number;
  weekno: number;
  monthno: number;
  begin: number;
  end: number;
}

@Injectable({
  providedIn: 'root'
})
export class TsweeksService {
  configUrl = 'http://localhost:8085/api/tsweek';

  constructor(private http: HttpClient) { }

  getWeeks(): Observable<TsWeek> {
    return this.http.get<TsWeek[]>(this.configUrl).pipe(
      mergeMap((items: TsWeek[]) => from(items)),
      map((item: TsWeek) => new class implements TsWeek {
        begin: number = Date.parse((item.begin as unknown) as string);
        end: number = Date.parse((item.end as unknown) as string);
        id: number = item.id;
        weekno: number = item.weekno;
        monthno: number = item.monthno;
        year: number = item.year;
      })
    );
  }
}
