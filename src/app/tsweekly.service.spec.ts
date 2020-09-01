/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import {TestBed} from '@angular/core/testing';

import {TsweeklyService} from './tsweekly.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TsweeklyService', () => {
    let service: TsweeklyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(TsweeklyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
