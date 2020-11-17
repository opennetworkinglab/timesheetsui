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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserTimesComponent} from './user-times.component';
import {OAuthModule} from 'angular-oauth2-oidc';
import {TsWeek, TsweeksService} from '../tsweeks.service';
import {AuthInterceptor} from '../auth-interceptor.service';
import {TsdaysService} from '../tsdays.service';
import {TsweeklyService} from '../tsweekly.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Observable, Subscriber} from 'rxjs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

const msInWeek = 7 * 24 * 60 * 60 * 1000;

class MockTsWeeksService {
    getWeeks(): Observable<TsWeek> {
        const weeks = new Observable<TsWeek>((observer: Subscriber<TsWeek>) => {
            const thisWeekStart: number = Date.now() - Date.now() % msInWeek;
            console.log('Starting week', thisWeekStart, Date.now());
            // tslint:disable-next-line:new-parens
            const sampleWeek: TsWeek = new class implements TsWeek {
                begin: number = thisWeekStart;
                end: number = thisWeekStart + 7 * 24 * 3600 * 1000 - 1;
                id: number = 1;
                year: number = 2020;
                weekNo: number = 33;
                monthNo: number = 8;
                onfDays: [];
            };
            observer.next(sampleWeek);
            observer.complete();
        });

        return weeks;
    }
}

describe('UserTimesComponent', () => {
    let component: UserTimesComponent;
    let fixture: ComponentFixture<UserTimesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                OAuthModule.forRoot(),
                HttpClientTestingModule,
                MatSnackBarModule
            ],
            declarations: [UserTimesComponent],
            providers: [
                {provide: TsweeksService, useClass: MockTsWeeksService},
                {provide: TsdaysService},
                {provide: TsweeklyService},
                {provide: AuthInterceptor},
                {provide: MatSnackBar}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserTimesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
