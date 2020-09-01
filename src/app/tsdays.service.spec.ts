/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import {TestBed} from '@angular/core/testing';

import {TsdaysService} from './tsdays.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DaysService', () => {
    let service: TsdaysService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
        });
        service = TestBed.inject(TsdaysService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
