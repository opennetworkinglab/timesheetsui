import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { HourselectComponent } from './hourselect/hourselect.component';
import { TimeselectComponent } from './timeselect/timeselect.component';

@NgModule({
  declarations: [
    AppComponent,
    DayComponent,
    HourselectComponent,
    TimeselectComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
