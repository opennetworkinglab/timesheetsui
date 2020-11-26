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
import {HourselectComponent} from './hourselect/hourselect.component';
import {DayComponent} from './day/day.component';
import {OAuthModule} from 'angular-oauth2-oidc';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                OAuthModule.forRoot(),
                RouterTestingModule,
                HttpClientTestingModule,
                MatProgressSpinnerModule,
                MatSliderModule,
                MatCardModule,
                MatToolbarModule,
                MatIconModule,
                MatTabsModule,
                MatSidenavModule,
                LayoutModule,
                MatButtonModule,
                MatListModule,
                MatIconModule,
                MatSnackBarModule,
                MatTooltipModule,
                MatTableModule,
                MatPaginatorModule,
                MatSortModule,
                MatFormFieldModule,
                MatInputModule,
                MatDialogModule,
                ReactiveFormsModule,
                MatSelectModule,
                MatSlideToggleModule
            ],
            declarations: [
                AppComponent, DayComponent, HourselectComponent
            ],
            providers: [
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
