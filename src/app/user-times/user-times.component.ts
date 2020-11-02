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

import {Component, Input, OnInit} from '@angular/core';
import {TsWeek, TsweeksService} from '../tsweeks.service';
import {TsDay, TsdaysService} from '../tsdays.service';
import {TsWeekly, TsweeklyService} from '../tsweekly.service';
import {OAuthService} from 'angular-oauth2-oidc';
import {generate} from 'rxjs';
import {EMAIL_ATTR} from '../app.component';

const msInDay = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-user-times',
  templateUrl: './user-times.component.html',
  styleUrls: ['./user-times.component.css']
})
export class UserTimesComponent implements OnInit {
    @Input() email: string;
    @Input() weekid: number;
    @Input() year: number;
    @Input() loggedIn: boolean;

    showPreview: boolean = false;
    showSign: boolean = true;
    userSigned: boolean = false;
    supervisor: boolean = false;
    activeSession: boolean = false;
    loadingProgress: boolean = false;

    title = 'timesheetsui';
    weeks: Map<number, TsWeek> = new Map();
    days: Map<number, TsDay> = new Map();
    weekly: TsWeekly;
    previewImgUrl: any;
    currentWeekId: number;

    constructor(
        private tsweeksService: TsweeksService,
        private tsdayssService: TsdaysService,
        private tsweekliesService: TsweeklyService,
        private oauthService: OAuthService) {

        if (oauthService.hasValidAccessToken()) {

            // TODO: GET USER TO CHECK IS SUPERVISOR AND SET SUPERVISOR TRUE - Will show add user

            console.log(this.oauthService.getIdToken());

            this.email = localStorage.getItem(EMAIL_ATTR);

            const dateTimeNow = Date.now();
            console.log('Current time is', dateTimeNow);

            tsweeksService.getWeeks().subscribe(
                (weekdata: TsWeek) => {
                    this.weeks.set(weekdata.id, weekdata);
                    if ((this.weekid === undefined || this.year === undefined) &&
                        weekdata.begin < dateTimeNow && weekdata.end + msInDay - 1 > dateTimeNow) {
                        this.currentWeekId = weekdata.id;
                        this.weekid = weekdata.weekno;
                        this.year = weekdata.year;

                        tsdayssService.date = new Date(weekdata.begin);
                        console.log('Current week is', new Date(weekdata.begin));
                    }
                },
                error => console.log('error getting weeks', error),
                () => {
                    this.changeWeek(0);
                    this.changeWeekAlreadySigned(0);
                }
            );
            // this.activeSession = true;
        }
    }

    ngOnInit(): void {}

    changeWeek(delta: number) {
        if (this.weeks.get(this.currentWeekId + delta) === undefined) {
            return;
        }
        this.currentWeekId = this.currentWeekId + delta;
        this.tsdayssService.date = new Date(this.weeks.get(this.currentWeekId).begin);
        this.days.clear();
        this.tsdayssService.getDays(this.email, this.currentWeekId).subscribe(
            (daydata: TsDay) => {

                this.days.set(daydata.day, daydata);
            },
            error => console.log('error getting days', error),
            () => {
                if (this.days.size < 7) { // If there are no day records for a week, add them
                    // Add the days
                    generate(
                        this.weeks.get(this.currentWeekId).begin,
                        x => x <= this.weeks.get(this.currentWeekId).end,
                        x => x + 24 * 60 * 60 * 1000
                    ).subscribe(
                        (ms) => {
                            const newDay = {
                                email: this.email,
                                day: ms,
                                weekId: this.currentWeekId
                            } as TsDay;
                            if (this.days.get(ms) === undefined) {
                                this.days.set(ms, newDay);
                            }
                        }
                    );
                }
            }
        );
    }

    changeWeekAlreadySigned(delta: number) {
        this.weekly = undefined;
        this.previewImgUrl = undefined;
        this.tsweekliesService.getWeeklies(this.email, this.currentWeekId).subscribe(
            (weekly: TsWeekly) => {

                this.weekly = weekly;

                if (this.weekly){

                    if (this.weekly.supervisorSigned){
                        this.showPreview = true;
                    }
                    else if (this.weekly.userSigned != null && this.weekly.userSigned.length > 0){
                        this.showSign = false;
                        this.userSigned = true;
                    }
                }
                else {

                    this.showSign = true;
                    this.showPreview = false;
                }

                // console.log('Binary data length', weekly.preview.length);
                // this.previewImgUrl = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + sampleImageData);
            },
            err => {
                console.log('error', err);
            },
        );
    }

    isWeekend(dayMs: number): boolean {
        const date = new Date(dayMs);
        return date.getDay() === 6 || date.getDay() === 0;
    }

    sign(userSigned) {

        this.tsweekliesService.sign(this.email, this.currentWeekId, userSigned).subscribe(
            () => {
                this.loadingProgress = false;
            }
        );
        this.loadingProgress = true;
        this.showSign = !this.showSign;
        this.userSigned = !this.userSigned;
    }
}
