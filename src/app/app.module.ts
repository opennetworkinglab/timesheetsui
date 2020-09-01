/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: LicenseRef-ONF-Member-1.0
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DayComponent} from './day/day.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {HourselectComponent} from './hourselect/hourselect.component';

@NgModule({
    declarations: [
        AppComponent,
        DayComponent,
        HourselectComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
