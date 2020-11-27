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

import {TsdaysService} from './tsdays.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {OAuthModule} from 'angular-oauth2-oidc';
import {HttpClient} from '@angular/common/http';
import {TIMESHEETS_REST_URL} from '../environments/environment';
import {testWeeks} from './tsweeks.service.spec';

export const tsDaysWeek29SampleData: any = require('../assets/tsdays-week29-sample-data.json');
export const tsDaysWeek30SampleData: any = require('../assets/tsdays-week30-sample-data.json');
export const tsDaysWeek31SampleData: any = require('../assets/tsdays-week31-sample-data.json');

describe('DaysService', () => {
    let service: TsdaysService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const configUrl = TIMESHEETS_REST_URL + '/day/test@email/29';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                OAuthModule.forRoot()
            ],
        });
        service = TestBed.inject(TsdaysService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('gets weeks by http long', () => {
        service.getDays('test@email', 29).subscribe(
            (days) => {
                // expect(days.day).toMatch('2020-11-29');
                expect(days.weekId).toMatch('29');
                expect(days.user.email).toMatch('test@email');
                expect(days.user.supervisorEmail).toMatch('approver@email');
                expect(days.user.firstName).toMatch('Test');
                expect(days.user.lastName).toMatch('User');
                expect(days.user.darpaAllocationPct).toEqual(100);
                expect(days.user.isSupervisor).toBeFalse();
                expect(days.user.isActive).toBeTruthy();
                expect(days.user.projects.length).toEqual(6);
            },
            (err) => expect(err).toBeNull()
        );
        const req = httpTestingController.expectOne(configUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(tsDaysWeek29SampleData);

        httpTestingController.verify();
    });

});
