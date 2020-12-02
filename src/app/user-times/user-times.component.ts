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

import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {TsWeek, TsweeksService} from '../tsweeks.service';
import {TsDay, TsdaysService} from '../tsdays.service';
import {TsWeekly, TsweeklyService} from '../tsweekly.service';
import {OAuthService} from 'angular-oauth2-oidc';
import {generate, Subscription} from 'rxjs';
import {EMAIL_ATTR} from '../app.component';
import { DOCUMENT } from '@angular/common';
import {UserService} from '../user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

const msInDay = 24 * 60 * 60 * 1000;


// TODO: implement service? Warnings based on darpaAllocationPct and hours per week.
@Component({
  selector: 'app-user-times',
  templateUrl: './user-times.component.html',
  styleUrls: ['./user-times.component.css']
})
export class UserTimesComponent implements OnInit{
    @Input() email: string;
    @Input() weekid: number;
    @Input() year: number;
    @Input() loggedIn: boolean;

    nameBtnSign: string = 'Submit Timesheet';
    nameBtnUnsign: string = 'Retract Timesheet';
    userSigned: boolean = true;

    showPreview: boolean = false;
    signBtnName: string = this.nameBtnSign;
    signBtnDisabled: boolean = false;
    isSupervisor: boolean = false;
    loadingProgress: boolean = false;

    weeks: Map<number, TsWeek> = new Map();
    days: Map<number, TsDay> = new Map();
    weekly: TsWeekly;
    previewImgUrl: any;
    currentWeekId: number;

    weekHours: number = 40;
    remainingWeekHours: number = this.weekHours;
    darpaAllocationPct: number = 100;
    remainingDarpaHours: number = this.weekHours * (this.darpaAllocationPct / 100);
    darpaWarn: boolean = false;

    darpaMins: number = 0;
    sickMins: number = 0;
    holidayMins: number = 0;
    ptoMins: number = 0;
    gAMins: number = 0;
    iRDMins: number = 0;
    totalMins: number = 0;
    daysSubscription: Subscription = new Subscription();

    constructor(
        private tsweeksService: TsweeksService,
        private tsdayssService: TsdaysService,
        private tsweekliesService: TsweeklyService,
        private oauthService: OAuthService,
        private user: UserService,
        @Inject(DOCUMENT) private document: Document,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef) {

        if (oauthService.hasValidAccessToken()) {

            console.log(this.oauthService.getIdToken());

            this.email = localStorage.getItem(EMAIL_ATTR);

            user.getUser().subscribe(result => {

                this.darpaAllocationPct = result.darpaAllocationPct;

            });
            const dateTimeNow = Date.now();
            this.getTsWeeks(dateTimeNow);

            // this.activeSession = true;
        }
    }

    // broken out to allow testing
    getTsWeeks(dateTimeNow: number) {
        console.log('Current time is', dateTimeNow);

        this.tsweeksService.getWeeks().subscribe(
            (weekdata: TsWeek) => {
                this.weeks.set(weekdata.id, weekdata);

                if ((this.weekid === undefined || this.year === undefined) &&
                    weekdata.begin < dateTimeNow && weekdata.end + msInDay - 1 > dateTimeNow) {

                    this.currentWeekId = weekdata.id;
                    this.weekid = weekdata.weekNo;
                    this.year = weekdata.year;

                    const newDate = new Date(weekdata.begin);
                    this.tsdayssService.date = new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate());
                    console.log('Current week is', new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate()));
                }
            },
            error => console.log('error getting weeks', error),
            () => {
                this.changeWeek(0);
                this.changeWeekAlreadySigned(0);
            }
        );
    }

    ngOnInit(): void {}

    changeWeek(delta: number) {
        if (!this.daysSubscription.closed) {
            this.daysSubscription.unsubscribe();
        }

        if (this.weeks.get(this.currentWeekId + delta) === undefined) {
            return;
        }

        this.resetTotals();
        this.resetHours();
        this.currentWeekId = this.currentWeekId + delta;
        const newDate = new Date(this.weeks.get(this.currentWeekId).begin);
        this.tsdayssService.date = new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate());
        this.days.clear();
        this.daysSubscription = this.tsdayssService.getDays(this.email, this.currentWeekId).subscribe(

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

        this.userSigned = false;
        this.showPreview = false;
        this.weekly = undefined;
        this.previewImgUrl = undefined;
        this.tsweekliesService.getWeeklies(this.email, this.currentWeekId).subscribe(
            (weekly: TsWeekly) => {

                this.weekly = weekly;

                if (this.weekly){

                    if (this.weekly.supervisorSigned){
                        this.showPreview = true;
                    }
                    else if ((this.weekly.userSigned != null && this.weekly.userSigned.length > 0)){

                        this.userSigned = true;
                        this.signBtnName = this.nameBtnUnsign;
                    }
                    else {
                        this.userSigned = false;
                        this.signBtnName = this.nameBtnSign;
                    }
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

                if (this.darpaAllocationPct === 0){
                    this.userSigned = true;
                    this.darpaWarn = false;
                    this.signBtnDisabled = true;
                }
            }
        );
    }

    isWeekend(dayMs: number): boolean {
        const date = new Date(dayMs);
        return date.getUTCDay() === 6 || date.getUTCDay() === 0;
    }

    isOnfDay(dayMs: number, currentWeekId: number): boolean{

        const date = new Date(dayMs);

        for (const el of this.weeks.get(currentWeekId).onfDays){
            const onfDay = new Date(el.date);

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

            if (this.totalMins === 0){
                return;
            }

            userSigned = true;
            this.userSigned = true;
            this.snackBar.open('Redirecting to Docusign', 'Dismiss', {duration: 10000});
        }

        this.tsweekliesService.sign(this.email, this.currentWeekId, userSigned).subscribe(
            (result) => {

                if (result.viewRequest !== null) {
                    this.document.location.href = result.viewRequest;
                }

                if (this.signBtnName === this.nameBtnSign) {
                    this.signBtnName = this.nameBtnUnsign;
                }else {
                    this.signBtnName = this.nameBtnSign;
                }

                this.loadingProgress = false;
                this.signBtnDisabled = false;

                if (userSigned === false){
                    this.userSigned = false;
                }
            }, (error) => {

                this.snackBar.open(error.error.message, 'Dismiss', {duration: 10000});
                this.loadingProgress = false;
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
        this.totalMins = 0;
    }

    getTotal() {
        this.totalMins = 0;
        this.totalMins += this.darpaMins;
        this.totalMins += this.sickMins;
        this.totalMins += this.holidayMins;
        this.totalMins += this.ptoMins;
        this.totalMins += this.gAMins;
        this.totalMins += this.iRDMins;
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
        this.getTotal();
        this.checkHoursAllocated();
        this.cdr.detectChanges();
    }

    resetHours(){
        this.weekHours = 40;
    }

    checkHoursAllocated() {

        if (this.darpaAllocationPct > 0) {

            const remainingDarpaHours = this.weekHours * (this.darpaAllocationPct / 100) - this.darpaMins;
            const leeway = (this.weekHours * (this.darpaAllocationPct / 100)) * 0.10;
            const darpaHoursCompleted = this.weekHours * (this.darpaAllocationPct / 100) - remainingDarpaHours;
            const remainingMinusLeeway = this.weekHours * (this.darpaAllocationPct / 100) - leeway;
            const remainingPlusLeeway = this.weekHours * (this.darpaAllocationPct / 100) + leeway;

            if (darpaHoursCompleted >= remainingMinusLeeway && darpaHoursCompleted <= remainingPlusLeeway) {
                this.darpaWarn = false;
            } else if (darpaHoursCompleted < remainingMinusLeeway || darpaHoursCompleted > remainingPlusLeeway) {
                this.darpaWarn = true;
            }
        }
    }
}
