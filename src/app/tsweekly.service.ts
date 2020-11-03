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
import {filter, map} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {OAuthService} from 'angular-oauth2-oidc';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

interface Preview {
    type: string;
    data: number[];
}

export interface TsWeekly {
    weekId: number;
    document: string;
    preview: string;
    userSigned: string;
    supervisorSigned: boolean;
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

    getWeeklies(email: string, weekid: number): Observable<TsWeekly> {

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
            })
        );
    }

    sign(email, weekId, userSigned): Observable<any> {

        console.log('Signing weekly for', email, weekId);

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        const body = {
            userSigned,
            redirectUrl: REDIRECT_URL
        };

        return this.http.patch(this.configUrl + '/' + email + '/' + weekId, body, { headers: httpHeaders});
    }
}
