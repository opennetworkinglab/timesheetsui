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
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {User, UserService} from '../user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, AfterViewInit {

    loginForm: FormGroup;
    emailRegx = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(opennetworking)\.org$/;
    nameRegx = /^([a-zA-Z \-]{1,40})$/;
    darpaRegx = /^(100|[0-9][0-9]?)$/;

    addUserBtnDisabled = false;
    selected: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
            firstName: [null, [Validators.required, Validators.pattern(this.nameRegx)]],
            lastName: [null, [Validators.required, Validators.pattern(this.nameRegx)]],
            darpaAllocationPct: [null, [Validators.required, Validators.pattern(this.darpaRegx)]],
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.selected = false;
        });
    }

    submit() {

        if (!this.loginForm.valid) {
            return;
        }

        const user: User = {
            email: this.loginForm.value.email,
            firstName: this.loginForm.value.firstName,
            lastName: this.loginForm.value.lastName,
            darpaAllocationPct: this.loginForm.value.darpaAllocationPct,
            supervisorEmail: undefined,
            isSupervisor: this.selected,
            isActive: true,
            projects: undefined
        };
        this.addUserBtnDisabled = true;

        this.userService.createUser(user).subscribe(result => {

            this.snackBar.open(result.message, 'Dismiss', {duration: 5000});
            this.addUserBtnDisabled = false;
        },
        error => {

            this.snackBar.open(error.error.message, 'Dismiss', {duration: 5000});
            this.addUserBtnDisabled = false;
        });
    }
}
