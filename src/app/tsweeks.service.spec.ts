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

import {TestBed} from '@angular/core/testing';

import {OnfDay, TsWeek, TsweeksService} from './tsweeks.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {OAuthModule} from 'angular-oauth2-oidc';
import {HttpClient} from '@angular/common/http';
import {TIMESHEETS_REST_URL} from '../environments/environment';

export const testWeeks = [
    {id: 29, year: 2020, weekNo: 47, monthNo: 11,
        begin: '2020-11-23', end: '2020-11-29',
        onfDays: [{date: '2020-11-26'}, {date: '2020-11-27' }]},
    {id: 30, year: 2020, weekNo: 48, monthNo: 11,
        begin: '2020-11-30', end: '2020-12-06',
        onfDays: []}
];

describe('TsweeksService', () => {
    let service: TsweeksService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const configUrl = TIMESHEETS_REST_URL + '/week';
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                OAuthModule.forRoot()
            ]
        });
        service = TestBed.inject(TsweeksService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('gets weeks by http', () => {
        service.getWeeks().subscribe(
            (week) => {
                expect(week.id).toBeCloseTo(30, -1);
                expect(week.year).toEqual(2020);
                expect(week.begin).toBeCloseTo(1606403431073, -10);
                expect(week.end).toBeCloseTo(1606403431073, -10);
            },
            (err) => expect(err).toBeNull()
        );
        const req = httpTestingController.expectOne(configUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(testWeeks);

        httpTestingController.verify();
    });
});
