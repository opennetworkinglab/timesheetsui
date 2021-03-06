/*
 * Copyright 2019-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, from} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {TIMESHEETS_REST_URL} from '../environments/environment';
import {OAuthService} from 'angular-oauth2-oidc';

export interface TsWeek {
    id: number;
    year: number;
    weekNo: number;
    monthNo: number;
    begin: number;
    end: number;
    onfDays: OnfDay[];
}

export interface OnfDay {
    date: Date;
}

@Injectable({
    providedIn: 'root'
})
export class TsweeksService {
    configUrl = TIMESHEETS_REST_URL + '/week';

    constructor(private http: HttpClient,
                private oAuthService: OAuthService) {
    }

    getWeeks(): Observable<TsWeek> {

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get<TsWeek[]>(this.configUrl, { headers: httpHeaders} ).pipe(
            mergeMap((items: TsWeek[]) => from(items)),
            // tslint:disable-next-line:new-parens
            map((item: TsWeek) => new class implements TsWeek {
                begin: number = Date.parse((item.begin as unknown) as string);
                end: number = Date.parse((item.end as unknown) as string);
                id: number = item.id;
                weekNo: number = item.weekNo;
                monthNo: number = item.monthNo;
                year: number = item.year;
                onfDays = item.onfDays;
            })
        );
    }
}
