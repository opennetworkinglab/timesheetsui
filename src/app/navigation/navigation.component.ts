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
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {

    email: string;
    supervisor: boolean;
    value: boolean = false;
    title = 'Timesheets';

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    constructor(private breakpointObserver: BreakpointObserver,
                private oAuthService: OAuthService,
                private router: Router,
                private userService: UserService,
                @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit(): void {

        this.userService.getUser().subscribe(result => {
            this.email = result.email;
            this.supervisor = result.isSupervisor;
        });
    }

    async logout() {

        await this.oAuthService.revokeTokenAndLogout({
            client_id: this.oAuthService.clientId,
            returnTo: this.oAuthService.redirectUri
        }, true);

        this.router.navigate(['']).then(() => {
            document.location.reload();
        });
    }
}
