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

import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {User, UserService} from '../user.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {AddUserComponent} from './add-user/add-user.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

    email: string;
    listData: MatTableDataSource<User>;
    userArray = [];
    displayedColumns = ['email', 'lastName', 'darpaAllocationPct', 'isSupervisor', 'isActive', 'supervisorEmail', 'actions'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchKey: string;

    hidden = false;

    constructor(private userService: UserService,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private changeDetectorRefs: ChangeDetectorRef) {
    }

    ngOnInit(): void {

        this.userService.getUser().subscribe(user => {
           this.email = user.email;
        });

        this.userService.getUsers().subscribe((item: User) => {
                setTimeout(() => {
                    this.hidden = true;
                });

                this.userArray.push(item);
            },
            () => {
            },
            () => {
                // Testing code
                // tslint:disable-next-line:new-parens
                // const user = new class implements User{
                //     darpaAllocationPct = 50;
                //     email = 'gohj@opennetworking.org';
                //     firstName = 'Bob';
                //     isActive = true;
                //     isSupervisor: false;
                //     lastName = 'James';
                //     projects = undefined;
                //     supervisorEmail = undefined;
                // };
                // this.userArray.push(user);

                this.listData = new MatTableDataSource<User>(this.userArray);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
            });
    }

    onSearchClear() {
        this.searchKey = '';
        this.applyFilter();
    }

    applyFilter() {
        this.listData.filter = this.searchKey.trim().toLowerCase();
    }

    onCreate() {

        const dialog = this.dialog.open(AddUserComponent);
        dialog.afterClosed().subscribe(result => {
            this.userArray = [];
            this.userService.getUsers().subscribe((item: User) => {
                    setTimeout(() => {
                        this.hidden = true;
                    });

                    this.userArray.push(item);
                },
                () => {
                },
                () => {
                    this.listData = new MatTableDataSource<User>(this.userArray);
                    this.listData.sort = this.sort;
                    this.listData.paginator = this.paginator;
                    this.changeDetectorRefs.detectChanges();
                });
        });
    }

    onEdit(row) {

        this.userService.setEditUser(row);

        const dialog = this.dialog.open(AddUserComponent);
        dialog.afterClosed().subscribe(result => {
            this.userArray = [];
            this.userService.getUsers().subscribe((item: User) => {
                    setTimeout(() => {
                        this.hidden = true;
                    });

                    this.userArray.push(item);
                },
                () => {
                },
                () => {
                    this.listData = new MatTableDataSource<User>(this.userArray);
                    this.listData.sort = this.sort;
                    this.listData.paginator = this.paginator;
                    this.changeDetectorRefs.detectChanges();
                    this.userService.setEditUser(undefined);
                });
        });
    }

    updateUser(row, event) {

        const body = {
            isActive: event.checked,
        };

        this.userService.updateUser(row.email, body).subscribe(result => {
            if (body.isActive) {
                this.snackBar.open('User is active', 'Dismiss', {duration: 5000});
            } else {
                this.snackBar.open('User is no longer active', 'Dismiss', {duration: 5000});
            }
        }, error => {
            console.log(error);
        });
    }
}

