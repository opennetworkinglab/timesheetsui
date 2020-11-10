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

import {Component, Inject, Input, OnInit} from '@angular/core';
import {TsWeek, TsweeksService} from '../tsweeks.service';
import {TsDay, TsdaysService} from '../tsdays.service';
import {TsWeekly, TsweeklyService} from '../tsweekly.service';
import {OAuthService} from 'angular-oauth2-oidc';
import {generate} from 'rxjs';
import {EMAIL_ATTR} from '../app.component';
import { DOCUMENT } from '@angular/common';

const msInDay = 24 * 60 * 60 * 1000;


// TODO: implement service? Warnings based on darpaAllocationPct and hours per week.
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

    nameBtnSign: string = 'Sign Timesheets';
    nameBtnUnsign: string = 'Unsign Timesheets';
    userSigned: boolean = false;

    showPreview: boolean = false;
    signBtnName: string = this.nameBtnSign;
    signBtnDisabled: boolean = false;
    supervisor: boolean = false;
    loadingProgress: boolean = false;

    title = 'timesheetsui';
    weeks: Map<number, TsWeek> = new Map();
    days: Map<number, TsDay> = new Map();
    weekly: TsWeekly;
    previewImgUrl: any;
    currentWeekId: number;

    darpaMins: number = 0;
    sickMins: number = 0;
    holidayMins: number = 0;
    ptoMins: number = 0;
    gAMins: number = 0;
    iRDMins: number = 0;

    constructor(
        private tsweeksService: TsweeksService,
        private tsdayssService: TsdaysService,
        private tsweekliesService: TsweeklyService,
        private oauthService: OAuthService,
        @Inject(DOCUMENT) private document: Document) {

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
                    this.resetTotals();
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
                    console.log(this.weekly);
                    if (this.weekly.supervisorSigned){
                        this.showPreview = true;
                    }
                    else if (this.weekly.userSigned != null && this.weekly.userSigned.length > 0){
                        this.userSigned = true;
                        this.signBtnName = this.nameBtnUnsign;
                    }
                    else {
                        this.userSigned = false;
                    }
                }
                else {
                    this.showPreview = false;
                    this.userSigned = false;
                }

                // console.log('Binary data length', weekly.preview.length);
                // this.previewImgUrl = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + sampleImageData);
            },
            err => {
                console.log('error', err);
            },
            () => {

                if (this.weekly === undefined){

                    this.userSigned = false;
                    this.showPreview = false;
                    this.signBtnName  = this.nameBtnSign;

                }
            }
        );
    }

    isWeekend(dayMs: number): boolean {
        const date = new Date(dayMs);
        return date.getDay() === 6 || date.getDay() === 0;
    }

    isOnfDay(dayMs: number, currentWeekId: number): boolean{
        const date = new Date(dayMs);

        for (const el of this.weeks.get(currentWeekId).onfDays){
            const onfDay = new Date(el.date);
            console.log(date.getDate(), onfDay.getDate());
            if (date.getDate() === onfDay.getDate()){
                return true;
            }
        }
        return false;
    }

    sign() {

        this.signBtnDisabled = true;
        let userSigned = false;

        if (this.signBtnName === this.nameBtnSign) {
            userSigned = true;
            this.signBtnName = this.nameBtnUnsign;
        }
        else {
            this.signBtnName = this.nameBtnSign;
        }

        this.tsweekliesService.sign(this.email, this.currentWeekId, userSigned).subscribe(
            (result) => {

                if (result.viewRequest !== null) {
                    this.document.location.href = result.viewRequest;
                }

                this.loadingProgress = false;
                this.signBtnDisabled = false;
            }
        );
        this.loadingProgress = true;
    }

    resetTotals() {
        this.darpaMins = 0;
        this.sickMins = 0;
        this.holidayMins = 0;
        this.ptoMins = 0;
        this.gAMins = 0;
        this.iRDMins = 0;
    }

    projectTimeChange(event) {

        switch (event.name) {
            case 'Darpa HR001120C0107':
                if (event.minutes !== 0) {
                    this.darpaMins += event.minutes / 60;
                }
                break;
            case 'Sick':
                if (event.minutes !== 0) {
                    this.sickMins += event.minutes / 60;
                }
                break;
            case 'Holiday':
                if (event.minutes !== 0) {
                    this.holidayMins += event.minutes / 60;
                }
                break;
            case 'PTO':
                if (event.minutes !== 0) {
                    this.ptoMins += event.minutes / 60;
                }
                break;
            case 'G_A':
                if (event.minutes !== 0) {
                    this.gAMins += event.minutes / 60;
                }
                break;
            case 'IR_D':
                if (event.minutes !== 0) {
                    this.iRDMins += event.minutes / 60;
                }
                break;
            default:
        }
    }
}
