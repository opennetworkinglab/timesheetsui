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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DayComponent} from './day/day.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HourselectComponent} from './hourselect/hourselect.component';
import {OAuthModule} from 'angular-oauth2-oidc';
import {RouterModule, Routes} from '@angular/router';
import { UserTimesComponent } from './user-times/user-times.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { UserListComponent } from './user-list/user-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { AddUserComponent } from './user-list/add-user/add-user.component';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { UsersSignedComponent } from './users-signed/users-signed.component';

const routes: Routes = [
    { path: '', component: UserTimesComponent},
    { path: 'users', component: UserListComponent},
    { path: 'signed', component: UsersSignedComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        DayComponent,
        HourselectComponent,
        UserTimesComponent,
        NavigationComponent,
        UserListComponent,
        AddUserComponent,
        UsersSignedComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        OAuthModule.forRoot(),
        RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
        BrowserAnimationsModule,
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
    providers: [],
    bootstrap: [AppComponent],
})

export class AppModule {}
