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
import {HttpClient} from '@angular/common/http';
import {TIMESHEETS_REST_URL} from '../environments/environment';
import {from, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {TsDay} from './tsdays.service';
import {DomSanitizer} from '@angular/platform-browser';

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
    configUrl = TIMESHEETS_REST_URL + '/tsweekly';

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer) {
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
        return this.http.get<TsWeekly[]>(this.configUrl + '?email=' + email + '&weekid=' + weekid).pipe(
            mergeMap((items: TsWeekly[]) => from(items)),
            // tslint:disable-next-line:new-parens
            map((item: TsWeekly) => new class implements TsWeekly {
                email: string = item.email;
                weekid: number = item.weekid;
                preview: string;
                document: string;
                signed: number = Date.parse((item.signed as unknown) as string);
            })
        );
    }
}
