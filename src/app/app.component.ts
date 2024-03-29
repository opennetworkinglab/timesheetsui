/*
 * Copyright 2020-present Open Networking Foundation
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

import {Component, OnInit} from '@angular/core';
import {authConfig} from '../environments/environment';
import {OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import {UserService} from './user.service';

export const USERNAME_ATTR = 'username';
export const EMAIL_ATTR = 'email';
export const APPROVER_NAME_ATTR = 'approvername';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    ready: boolean = false;
    name: string;
    supervisorName: string;

    constructor(private oauthService: OAuthService,
                private router: Router,
                private userService: UserService) { }


    async ngOnInit(): Promise<void> {

        let validToken = false;

        if (authConfig.issuer !== undefined) {

            this.oauthService.configure(authConfig);

            if (this.oauthService.hasValidAccessToken()) {
                validToken = true;
            }

            const loggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin();

            if (loggedIn) {

                localStorage.setItem(EMAIL_ATTR, this.oauthService.getIdentityClaims()[EMAIL_ATTR]);
                localStorage.setItem(USERNAME_ATTR, this.oauthService.getIdentityClaims()[`name`]);
                localStorage.setItem('accessToken', this.oauthService.getIdToken());
                localStorage.setItem('idToken', this.oauthService.getAccessToken());

                console.log('Logged in', this.oauthService.hasValidIdToken(),
                    'as', localStorage.getItem(USERNAME_ATTR),
                    '(' + localStorage.getItem(EMAIL_ATTR) + ')');


                this.userService.getUser().subscribe(user => {

                    this.ready = true;

                    this.userService.getSupervisor().subscribe(supervisor => {
                        this.supervisorName = supervisor.firstName + ' ' + supervisor.lastName;
                        localStorage.setItem(APPROVER_NAME_ATTR, this.supervisorName);

                        if (!validToken) {
                            this.router.navigate(['']).then(() => {
                                console.log('Redirected');
                            });
                        }
                    });
                },
                error => {
                    console.log('You are not part of Timesheets. Contact your supervisor');
                });
            }
        }
    }
}
