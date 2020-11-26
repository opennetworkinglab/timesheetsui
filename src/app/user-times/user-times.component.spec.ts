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
import {AuthInterceptor} from '../auth-interceptor.service';
import {TsdaysService} from '../tsdays.service';
import {TsweeklyService} from '../tsweekly.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

import {TsweeksService} from '../tsweeks.service';
import {testWeeks} from '../tsweeks.service.spec';
import {tsDaysSampelData} from '../tsdays.service.spec';
import {DayComponent} from '../day/day.component';
import {HourselectComponent} from '../hourselect/hourselect.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('UserTimesComponent', () => {
    let component: UserTimesComponent;
    let fixture: ComponentFixture<UserTimesComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                OAuthModule.forRoot(),
                HttpClientTestingModule,
                MatSnackBarModule,
                MatIconModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            declarations: [UserTimesComponent, DayComponent, HourselectComponent],
            providers: [
                {provide: TsweeksService},
                {provide: TsdaysService},
                {provide: TsweeklyService},
                {provide: AuthInterceptor},
                {provide: MatSnackBar}
            ],
    })
            .compileComponents();
    }));

    beforeEach(() => {
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(UserTimesComponent);
        component = fixture.componentInstance;
        component.getTsWeeks(1606403431073);
        component.email = 'test@email';
        const reqWeeks = httpTestingController.expectOne('http://localhost:3000/week');
        expect(reqWeeks.request.method).toEqual('GET');
        reqWeeks.flush(testWeeks);

        const reqDays = httpTestingController.expectOne('http://localhost:3000/day/test@email/29');
        expect(reqDays.request.method).toEqual('GET');
        reqDays.flush(tsDaysSampelData);

        component.checkHoursAllocated();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.weeks.size).toEqual(2);
        expect(component.email).toMatch('test@email');
        expect(component.currentWeekId).toEqual(29);
        expect(component.darpaAllocationPct).toEqual(100);
        // Check totals
        expect(component.gAMins).toEqual(0);
        component.projectTimeChange({name: 'G_A', minutes: 90});
        expect(component.gAMins).toEqual(1.5);
    });

    it('should have centre-table', () => {
        const devDe: DebugElement = fixture.debugElement;
        const divDe = devDe.query(By.css('div div.mat-typography div.center-table'));
        expect(divDe).toBeTruthy();
    });

    it('should have row-names-table', () => {
        const devDe: DebugElement = fixture.debugElement;
        const divDe = devDe.query(
            By.css('div div.mat-typography div.center-table table tbody tr td#row-names table#row-names-table tbody'));
        expect(divDe).toBeTruthy();
        expect(divDe.children.length).toEqual(6);

        expect(divDe.children[1].nativeElement.textContent).toContain('IR&D');
        expect(divDe.children[2].nativeElement.textContent).toContain('G&A');
        expect(divDe.children[3].nativeElement.textContent).toContain('PTO');
        expect(divDe.children[4].nativeElement.textContent).toContain('Sick');
        expect(divDe.children[5].nativeElement.textContent).toContain('ONF Holiday');
    });


});
