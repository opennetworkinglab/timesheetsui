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
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {TsWeek, TsweeksService} from '../tsweeks.service';
import {msInDay} from '../user-times/user-times.component';
import {TsweeklyService} from '../tsweekly.service';

class TempUser{
    email: string;
    name: string;
    userSigned: boolean;
    supervisorSigned: boolean;
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

    listData: MatTableDataSource<TempUser>;
    userArray = [];
    displayedColumns = ['email', 'name', 'userSigned', 'supervisorSigned'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    searchKey: string;
    hidden = false;
    @Output() totalSigned = 0;

    data = '';

    constructor(private userService: UserService,
                private tsweeksService: TsweeksService,
                private tsweeklyService: TsweeklyService) {
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

                this.tsweeklyService.getUsersAndWeekly(this.currentWeekId).subscribe(result => {

                        result.forEach(user => {
                            this.userArray.push(user);
                        });
                    },
                    () => {
                    },
                    () => {

                        if (this.userArray.length > 0){
                            this.hidden = true;
                        }
                        this.listData = new MatTableDataSource<TempUser>(this.userArray);
                        this.listData.sort = this.sort;
                        this.listData.paginator = this.paginator;

                        this.userArray.forEach((user: TempUser) => {

                            if (user.userSigned === false){
                                this.data += user.email + '\n';
                            }
                        });
                    });
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

        this.tsweeklyService.getUsersAndWeekly(this.currentWeekId).subscribe(result => {

                result.forEach(user => {
                    this.userArray.push(user);
                });
            },
            () => {
            },
            () => {

                if (this.userArray.length > 0){
                    this.hidden = true;
                }
                this.listData = new MatTableDataSource<TempUser>(this.userArray);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;

                this.userArray.forEach((user: TempUser) => {

                    if (user.userSigned === false){
                        this.data += user.email + '\n';
                    }
                });
            });

    }
}
