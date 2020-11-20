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

import {Component, OnInit, ViewChild} from '@angular/core';
import {User, UserService} from '../user.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

    listData: MatTableDataSource<User>;
    userArray = [];
    displayedColumns = ['email', 'lastName', 'darpaAllocationPct', 'isSupervisor', 'isActive', 'actions'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchKey: string;

    hidden = false;

    constructor(private userService: UserService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {

        this.userService.getUsers().subscribe((item: User) => {
                setTimeout(() => {
                    this.hidden = true;
                });

                this.userArray.push(item);
            },
            (error) => {
            },
            () => {
                this.listData = new MatTableDataSource<User>(this.userArray);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
            });
    }

    onSearchClear(){
        this.searchKey = '';
        this.applyFilter();
    }

    applyFilter() {
        this.listData.filter = this.searchKey.trim().toLowerCase();
    }

    onCreate(){
        // this.dialog.open()
    }
}

