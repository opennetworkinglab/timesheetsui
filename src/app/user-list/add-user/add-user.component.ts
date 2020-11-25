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

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User, UserService} from '../../user.service';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, AfterViewInit {

    loginForm: FormGroup;
    emailRegx = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(opennetworking)\.org$/;
    nameRegx = /^([a-zA-Z'\-]{1,40})$/;
    darpaRegx = /^(100|[0-9][0-9]?)$/;

    user: User = undefined;

    addUserBtnDisabled = false;
    isSupervisorSelect: boolean;
    editedUser = false;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AddUserComponent>
    ) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
            firstName: [null, [Validators.required, Validators.pattern(this.nameRegx)]],
            lastName: [null, [Validators.required, Validators.pattern(this.nameRegx)]],
            darpaAllocationPct: [null, [Validators.required, Validators.pattern(this.darpaRegx)]],
            supervisorEmail: [null, [Validators.required, Validators.pattern(this.emailRegx)]]
        });

        this.user = this.userService.getEditUser();

        if (this.user) {
            this.loginForm.setValue({
                email: this.user.email,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                darpaAllocationPct: this.user.darpaAllocationPct,
                supervisorEmail: this.user.supervisorEmail
            });
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {

            if (this.user){
                this.editedUser = true;
                this.isSupervisorSelect = this.user.isSupervisor;
            }
            else {
                this.isSupervisorSelect = false;
            }

        });
    }

    onIsSupervisorSelect(event: MatSlideToggleChange){
        this.isSupervisorSelect = event.checked;
    }

    submit() {

        if (!this.loginForm.valid) {
            return;
        }

        if (this.user) {

            const body = {
                firstName: this.loginForm.value.firstName,
                lastName: this.loginForm.value.lastName,
                darpaAllocationPct: this.loginForm.value.darpaAllocationPct,
                supervisorEmail: this.loginForm.value.supervisorEmail,
                isSupervisor: this.isSupervisorSelect,
            };

            this.userService.updateUser(this.loginForm.value.email, body).subscribe(result => {
                this.snackBar.open('User has been updated', 'Dismiss', {duration: 5000});
                this.dialogRef.close();
            }, error => {
                this.snackBar.open('Error with updating user.', 'Dismiss', {duration: 5000});
                this.dialogRef.close();
            });
            return;
        }

        const user: User = {
            email: this.loginForm.value.email,
            firstName: this.loginForm.value.firstName,
            lastName: this.loginForm.value.lastName,
            darpaAllocationPct: this.loginForm.value.darpaAllocationPct,
            supervisorEmail: this.loginForm.value.supervisorEmail,
            isSupervisor: this.isSupervisorSelect,
            isActive: true,
            projects: undefined
        };
        this.addUserBtnDisabled = true;

        this.userService.createUser(user).subscribe(result => {

                this.snackBar.open(result.message, 'Dismiss', {duration: 5000});
                this.addUserBtnDisabled = false;
                this.dialogRef.close();
            },
            error => {

                this.snackBar.open(error.error.message, 'Dismiss', {duration: 5000});
                this.addUserBtnDisabled = false;
                this.dialogRef.close();
            });
    }
}
