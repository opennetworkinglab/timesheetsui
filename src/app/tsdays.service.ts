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

import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, mergeMap} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {TIMESHEETS_REST_URL} from '../environments/environment';
import {OAuthService} from 'angular-oauth2-oidc';
import {User} from './user.service';

export interface TsDay {
    email: string;
    user: User;
    day: number;
    weekId: number;
    times: [];
}


@Injectable({
    providedIn: 'root'
})
export class TsdaysService {
    date: Date;
    configUrl = TIMESHEETS_REST_URL + '/day';
    @Output() updatedTime = new EventEmitter<number>();

    constructor(private http: HttpClient,
                private oAuthService: OAuthService) {
    }

    getDays(email: string, weekId: number): Observable<TsDay> {
        console.log('Getting days for', email, weekId);

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get<TsDay[]>(this.configUrl + '/' + email + '/' + weekId, { headers: httpHeaders }).pipe(
            mergeMap((items: TsDay[]) => from(items)),
            // tslint:disable-next-line:new-parens
            map((item: TsDay) => new class implements TsDay {

                email: string = item.user.email;
                user: User = item.user;
                day: number = Date.parse((item.day as unknown) as string);
                weekId: number = item.weekId;
                times: [] = item.times;
            }));
    }

    updateTimeInDay(email, dayInWeek, project, minutes){

        console.log('Updating day for ', email, project);

        const dayArr = dayInWeek.split(' ');
        let month = this.date.getMonth() + 1;

        if (dayArr[1] < this.date.getDate()){
            month++;
        }

        const body = {
            project,
            minutes
        };

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        this.http.patch(this.configUrl + '/' + email + '/' + this.date.getFullYear() + '-' + month + '-' + dayArr[1],
            body,
            { headers: httpHeaders })
            .subscribe(
                result => {
                    console.log(result);
                },
                error => {
                    console.log(error);
                }
            );
    }
}
