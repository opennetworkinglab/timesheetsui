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

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User, UserService} from '../../user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TsweeklyService} from '../../tsweekly.service';
import {log} from 'util';

@Component({
  selector: 'app-popup-text',
  templateUrl: './popup-text.component.html',
  styleUrls: ['./popup-text.component.css']
})
export class PopupTextComponent implements OnInit {

    loginForm: FormGroup;

    user: User = undefined;

    addUserBtnDisabled = false;
    editedUser = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<PopupTextComponent>,
        private tsWeeklyService: TsweeklyService
    ) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            comment: [null, []]
        });
    }

    submit() {

        if ( !this.loginForm.value.comment ) {
            this.snackBar.open('Comment needs to be added', 'Dismiss', { duration: 5000 });
        }
        else if ( this.loginForm.value.comment.length < 5 ){
            this.snackBar.open('Meaningful comment needs to be added', 'Dismiss', { duration: 5000 });
        }

        this.tsWeeklyService.rejectTimeSheet(this.data.email, this.data.weekId, this.loginForm.value.comment).subscribe(result => {
            console.log(result);
            this.dialogRef.close();
        }, error => {
            console.log(error);
            this.dialogRef.close();
        });
    }
}
