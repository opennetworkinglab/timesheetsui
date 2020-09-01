/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import {TestBed} from '@angular/core/testing';

import {TsweeksService} from './tsweeks.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TsweeksService', () => {
    let service: TsweeksService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ]
        });
        service = TestBed.inject(TsweeksService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
