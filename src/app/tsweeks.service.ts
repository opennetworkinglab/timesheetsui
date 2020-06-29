import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface TsWeek{
  id: number;
  year: number;
  weekno: number;
  begin: Date;
  end: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TsweeksService {
  configUrl = 'http://localhost:8085/api/tsweek';

  constructor(private http: HttpClient) { }

  getWeeks() {
    return this.http.get<TsWeek>(this.configUrl);
  }
}
