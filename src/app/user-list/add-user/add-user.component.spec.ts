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

import {AddUserComponent} from './add-user.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {FormBuilder} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {OAuthModule} from 'angular-oauth2-oidc';
import {UserService} from '../../user.service';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

describe('AddUserComponent', () => {
    const mockDialogRef = {
        close: jasmine.createSpy('close')
    };
    let component: AddUserComponent;
    let fixture: ComponentFixture<AddUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                OAuthModule.forRoot(),
                MatSnackBarModule,
                MatDialogModule
            ],
            declarations: [AddUserComponent],
            providers: [
                {provide: FormBuilder},
                {provide: UserService},
                {provide: MatSnackBar},
                {provide: MatDialogRef, useValue: mockDialogRef}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
    expect(component).toBeTruthy();
  });
});
