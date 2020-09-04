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

import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {TsWeek, TsweeksService} from './tsweeks.service';
import {Observable, Subscriber} from 'rxjs';
import {HourselectComponent} from './hourselect/hourselect.component';
import {DayComponent} from './day/day.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

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
                weekno: number = 33;
                monthno: number = 8;
            };
            observer.next(sampleWeek);
            observer.complete();
        });

        return weeks;
    }
}

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            declarations: [
                AppComponent, DayComponent, HourselectComponent
            ],
            providers: [
                {provide: TsweeksService, useClass: MockTsWeeksService}
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'timesheetsui'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('timesheetsui');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.card-title').textContent).toContain('sean@opennetworking.org');
    });
});
