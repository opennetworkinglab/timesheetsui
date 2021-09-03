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

import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {User, UserService} from '../user.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, MatSortable, Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {TsWeek, TsweeksService} from '../tsweeks.service';
import {msInDay} from '../user-times/user-times.component';
import {TsweeklyService} from '../tsweekly.service';
import {EMAIL_ATTR} from '../app.component';
import {MatDialog} from '@angular/material/dialog';
import {PopupTextComponent} from './popup-text/popup-text.component';
import {MatSnackBar} from '@angular/material/snack-bar';

class TempUser{
    email: string;
    name: string;
    alloc: number;
    darpa = 0;
    ird = 0;
    ga = 0;
    pto = 0;
    sick = 0;
    holiday = 0;
    total = 0;
    userSigned: Date;
    supervisorCheck = false;
    supervisorSigned: Date;
    tsPreview: string;
    usercheck = 0;
}

@Component({
  selector: 'app-users-signed',
  templateUrl: './users-signed.component.html',
  styleUrls: ['./users-signed.component.css']
})
export class UsersSignedComponent implements OnInit {

    weeks: Map<number, TsWeek> = new Map();
    @Input() weekid: number;
    @Input() year: number;
    currentWeekId: number;
    loadingProgress = false;

    listData: MatTableDataSource<TempUser>;
    userArray = [];
    displayedColumns = ['name', 'alloc',
        'darpa',
        'ird',
        'ga',
        'pto',
        'sick',
        'holiday',
        'total',
        'userSigned', 'supervisorSigned'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    searchKey: string;
    hidden = false;
    @Output() totalSigned = 0;

    data = '';
    selectedRowIndex = -1;

    constructor(private userService: UserService,
                private tsweeksService: TsweeksService,
                private tsweeklyService: TsweeklyService,
                private snackBar: MatSnackBar,
                private dialog: MatDialog,
                private tsWeeklyService: TsweeklyService
    ) {
    }

    ngOnInit(): void {

        const dateTimeNow = Date.now();

        this.tsweeksService.getWeeks().subscribe(

            (weekdata: TsWeek) => {
                this.weeks.set(weekdata.id, weekdata);

                if ((this.weekid === undefined || this.year === undefined) &&
                    weekdata.begin < dateTimeNow && weekdata.end + msInDay - 1 > dateTimeNow) {

                    this.currentWeekId = weekdata.id;
                    this.weekid = weekdata.weekNo;
                    this.year = weekdata.year;
                }
            },
            error => console.log('error getting weeks', error),
            () => {

                this.getUsersAndWeekly();
            });
    }

    getUsersAndWeekly(){
        this.userArray = [];
        this.tsweeklyService.getUsersAndWeekly(this.currentWeekId).subscribe(result => {

                result.forEach(user => {

                    const tempUser = new TempUser();
                    tempUser.email = user.email;
                    tempUser.name = user.name;
                    tempUser.alloc = user.alloc;
                    tempUser.tsPreview = user.preview;

                    if (user.userSigned) {
                        tempUser.userSigned = new Date(user.userSigned);
                    }

                    if (user.times) {

                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < user.times.length; i++) {

                            // tslint:disable-next-line:prefer-for-of
                            for (let j = 0; j < user.times[i].length; j++) {

                                if (user.times[i][j].name === 'Darpa HR001120C0107') {

                                    tempUser.darpa += user.times[i][j].minutes / 60;
                                }
                                if (user.times[i][j].name === 'Sick') {

                                    tempUser.sick += user.times[i][j].minutes / 60;
                                }
                                if (user.times[i][j].name === 'Holiday') {

                                    tempUser.holiday += user.times[i][j].minutes / 60;
                                }
                                if (user.times[i][j].name === 'PTO') {

                                    tempUser.pto += user.times[i][j].minutes / 60;
                                }
                                if (user.times[i][j].name === 'G_A') {

                                    tempUser.ga += user.times[i][j].minutes / 60;
                                }
                                if (user.times[i][j].name === 'IR_D') {

                                    tempUser.ird += user.times[i][j].minutes / 60;
                                }

                                tempUser.total += user.times[i][j].minutes / 60;
                            }
                        }
                    }
                    else{
                        this.defaultTimes(tempUser);
                    }

                    if (user.email !== localStorage.getItem(EMAIL_ATTR)){

                        tempUser.supervisorCheck = true;
                    }

                    if (user.supervisorSigned){
                        tempUser.supervisorSigned = new Date(user.supervisorSigned);
                    }

                    if (user.supervisor === localStorage.getItem(EMAIL_ATTR)){
                        tempUser.usercheck = 1;
                    }
                    this.userArray.push(tempUser);
                });
            },
            () => {
            },
            () => {

                if (this.userArray.length > 0){
                    this.hidden = true;
                }
                this.listData = new MatTableDataSource<TempUser>(this.userArray);

                // sort approved user users to the top/
                this.sort.sort(({ id: 'usercheck', start: 'desc'}) as MatSortable);

                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;

                // const sortState: Sort = { active: 'Alloc', direction: 'desc'};
                // this.sort.active = sortState.active;
                // this.sort.direction = sortState.direction;
                // this.sort.sortChange.emit(sortState);

                this.userArray.forEach((user: TempUser) => {

                    if (!user.userSigned){
                        this.data += user.email + '\n';
                    }
                });
            });
    }

    defaultTimes(tempUser: TempUser){

        tempUser.darpa = 0;
        tempUser.ird = 0;
        tempUser.holiday = 0;
        tempUser.sick = 0;
        tempUser.pto = 0;
        tempUser.total = 0;
    }

    approverSign(userEmail){
        this.loadingProgress = true;
        this.tsweeklyService.signSheetApprover(userEmail, this.currentWeekId).subscribe(result => {
            this.getUsersAndWeekly();
            this.loadingProgress = false;
        });
    }

    approverUnsign(userEmail){
        this.loadingProgress = true;
        this.tsweeklyService.unsignSheetApprover(userEmail, this.currentWeekId).subscribe( result => {
            this.getUsersAndWeekly();
            this.loadingProgress = false;
        });
    }

    onSearchClear() {
        this.searchKey = '';
        this.applyFilter();
    }

    applyFilter() {
        this.listData.filter = this.searchKey.trim().toLowerCase();
    }

    changeWeek(delta: number) {

        this.userArray = [];
        this.totalSigned = 0;
        this.data = '';

        if (this.weeks.get(this.currentWeekId + delta) === undefined) {
            return;
        }

        this.currentWeekId = this.currentWeekId + delta;

        this.getUsersAndWeekly();
    }

    onReject(userEmail: string){

        const dialog = this.dialog.open(PopupTextComponent, {
            data: {
                isReminder: false
            }
        });

        dialog.afterClosed().subscribe(
            (result) => {
                if ( result !== undefined ) {
                    this.tsWeeklyService.rejectTimeSheet(userEmail, this.currentWeekId, result.data).subscribe(() => {

                        this.snackBar.open('Timesheet Rejected', 'Dismiss', {duration: 5000});
                    }, error => {
                        console.log(error);
                    }, () => {
                        this.getUsersAndWeekly();
                    });
                }
            },
            () => {

            }, () => {
            });
    }

    onReminder(userEmail: string) {

        const dialog = this.dialog.open(PopupTextComponent, {
            data: {
                isReminder: true,
                begin: this.weeks.get(this.currentWeekId).begin,
                end: this.weeks.get(this.currentWeekId).end
            }
        });

        dialog.afterClosed().subscribe(
            (result) => {

                if ( result !== undefined ) {

                    this.tsweeklyService.sendReminder(userEmail, this.currentWeekId, result.data).subscribe(() => {

                        this.snackBar.open('Reminder Sent', 'Dismiss', {duration: 5000});
                    }, error => {
                        console.log(error);
                    }, () => {
                        this.getUsersAndWeekly();
                    });
                }
            },
            () => {

            }, () => {
            });
    }

    onViewTimesheet(tsPreview: string) {
        window.open(tsPreview);
    }
    highlightRow(row){
        this.selectedRowIndex = row.id;
    }

    sortYourUsers(){
        const sortState: Sort = { active: 'usercheck', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
    }
}
