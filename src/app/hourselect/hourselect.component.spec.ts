/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HourselectComponent} from './hourselect.component';

describe('HourselectComponent', () => {
    let component: HourselectComponent;
    let fixture: ComponentFixture<HourselectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HourselectComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HourselectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
