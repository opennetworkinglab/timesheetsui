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

export const USERNAME_ATTR = 'username';
export const EMAIL_ATTR = 'email';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    ready: boolean = false;

    constructor(private oauthService: OAuthService,
                private router: Router) { }


    async ngOnInit(): Promise<void> {

        if (authConfig.issuer !== undefined) {

            this.oauthService.configure(authConfig);

            const loggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin();

            if (loggedIn) {

                localStorage.setItem(EMAIL_ATTR, this.oauthService.getIdentityClaims()[EMAIL_ATTR]);
                localStorage.setItem(USERNAME_ATTR, this.oauthService.getIdentityClaims()[`name`]);
                localStorage.setItem('accessToken', this.oauthService.getIdToken());
                localStorage.setItem('idToken', this.oauthService.getAccessToken());
                console.log('Logged in', this.oauthService.hasValidIdToken(),
                    'as', localStorage.getItem(USERNAME_ATTR),
                    '(' + localStorage.getItem(EMAIL_ATTR) + ')');

                this.ready = true;

                // this.router.navigate([localStorage.getItem(EMAIL_ATTR)]).then(() => {
                //     console.log('Redirected');
                // });
            }
        }
    }
}
