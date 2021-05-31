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
import {REDIRECT_URL, TIMESHEETS_REST_URL} from '../environments/environment';
import {from, Observable} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {OAuthService} from 'angular-oauth2-oidc';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

export interface TsWeekly {
    weekId: number;
    document: string;
    preview: string;
    userSigned: string;
    supervisorSigned: boolean;
}

export interface TsWeeklyNew {
    weekId: number;
    document: string;
    preview: string;
    userSigned: string;
    supervisorSigned: boolean;
    comment: any;
}

@Injectable({
    providedIn: 'root'
})
export class TsweeklyService {
    configUrl = TIMESHEETS_REST_URL + '/weekly';

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private oAuthService: OAuthService) {
    }

    private static toBase64(buffer: number[]): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    getLastUnsignedWeeklyDiff(): Observable<any> {

        console.log('Getting last unsigned week');

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get(this.configUrl + '/unsigned', {headers: httpHeaders});
    }

    getRejectWeeks(): Observable<TsWeeklyNew> {

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get(this.configUrl + '/reject/weeks', {headers: httpHeaders}).pipe(
            mergeMap((items: TsWeeklyNew[]) => from(items))
        );
    }

    getWeekly(email: string, weekid: number): Observable<TsWeekly> {

        console.log('Getting weeklies for', email, weekid);

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get<TsWeekly>(this.configUrl + '/' + email + '/' + weekid, {headers: httpHeaders}).pipe(
            filter(isNotNullOrUndefined),
            // tslint:disable-next-line:new-parens
            map((item: TsWeekly) => new class implements TsWeekly {

                weekId = item.weekId;
                document = item.document;
                preview = item.preview;
                userSigned = item.userSigned;
                supervisorSigned = item.supervisorSigned;
            }));
    }

    unsignSheetApprover(userEmail: string, weekId: number){

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.post(this.configUrl + '/approver/unsign/' + userEmail + '/' + weekId, {}, { headers: httpHeaders });
    }

    signSheetApprover(userEmail: string, weekId: number){

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.post(this.configUrl + '/approver/sign/' + userEmail + '/' + weekId, {}, { headers: httpHeaders });
    }

    rejectTimeSheet(userEmail: string, weekId: number, comment: string) {

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.post(this.configUrl + '/reject/' + userEmail + '/' + weekId, {
            comment
        }, { headers: httpHeaders });
    }

    sendReminder(userEmail: string, weekId: number){

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.post(this.configUrl + '/reminders/' + userEmail + '/' + weekId, {}, { headers: httpHeaders });
    }

    getUsersAndWeekly(weekId: number): Observable<any>{

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get(this.configUrl + '/usersweekly/' + weekId, { headers: httpHeaders});
    }

    sign(email, weekId, userSigned): Observable<any> {

        console.log('Signing weekly for', email, weekId);

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        const body = {
            userSigned
        };

        return this.http.patch(this.configUrl + '/' + email + '/' + weekId, body, { headers: httpHeaders});
    }
}
