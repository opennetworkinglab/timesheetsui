import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {timesheets_rest_url} from "../environments/environment";
import {from, Observable} from "rxjs";
import {map, mergeMap} from "rxjs/operators";
import {TsDay} from "./tsdays.service";
import {DomSanitizer} from "@angular/platform-browser";

interface Preview {
  type: string;
  data: number[];
}

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

  constructor(
    private http: HttpClient,
    private sanitizer : DomSanitizer) { }

  getWeeklies(email: string, weekid: number): Observable<TsWeekly> {
    console.log('Getting weeklies for', email, weekid);
    return this.http.get<TsWeekly[]>(this.configUrl + '?email='+email+'&weekid='+weekid).pipe(
      mergeMap((items: TsWeekly[]) => from(items)),
      map((item: TsWeekly) => new class implements TsWeekly {
        email: string = item.email;
        weekid: number = item.weekid;
        preview: string;
        document: string;
        signed: number = Date.parse((item.signed as unknown) as string);
      })
    );
  }

  private static toBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
}
