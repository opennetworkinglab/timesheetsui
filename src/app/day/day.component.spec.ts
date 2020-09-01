/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DayComponent} from './day.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DayComponent', () => {
    let component: DayComponent;
    let fixture: ComponentFixture<DayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            declarations: [DayComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
