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

import { Injectable } from '@angular/core';
import {TIMESHEETS_REST_URL} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {map, mergeMap} from 'rxjs/operators';
import {from} from 'rxjs';
import {EMAIL_ATTR} from './app.component';

export interface User {
    email: string;
    firstName: string;
    lastName: string;
    supervisorEmail: string;
    darpaAllocationPct: number;
    isSupervisor: boolean;
    isActive: boolean;
    projects: Project[];
}

export interface Project {
    name: string;
    priority: number;
}

export interface AddUserReply {
    statusCode: number;
    message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

    configUrl = TIMESHEETS_REST_URL + '/auth';
    editUser: User = undefined;

    constructor(private http: HttpClient,
                private oAuthService: OAuthService) {
    }

    createUser(user: User){

        console.log('Creating User info');

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.post(this.configUrl + '/createuser', user, {headers: httpHeaders}).pipe(
            // tslint:disable-next-line:new-parens
            map((item: AddUserReply) => new class implements AddUserReply {
                statusCode = item.statusCode;
                message = item.message;
            })
        );
    }

    updateUser(email, body){

        console.log('Updating User info');

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.patch(this.configUrl + '/' + email, body, {headers: httpHeaders}).pipe(
            // tslint:disable-next-line:new-parens
            map((item: AddUserReply) => new class implements AddUserReply {
                statusCode = item.statusCode;
                message = item.message;
            })
        );
    }

    getSupervisor() {

        console.log('Getting Supervisor info');

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get<User>(this.configUrl + '/supervisor', {headers: httpHeaders}).pipe(
            // tslint:disable-next-line:new-parens
            map((item: User) => new class implements User {

                email: string = item.email;
                firstName: string = item.firstName;
                lastName: string = item.lastName;
                supervisorEmail: string = item.supervisorEmail;
                darpaAllocationPct: number = item.darpaAllocationPct;
                isSupervisor: boolean = item.isSupervisor;
                isActive: boolean = item.isActive;
                projects: Project[] = item.projects;
            })
        );
    }

    getUser(){

        console.log('Getting User info');

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get<User>(this.configUrl, {headers: httpHeaders}).pipe(
            // tslint:disable-next-line:new-parens
            map((item: User) => new class implements User {

                email: string = item.email;
                firstName: string = item.firstName;
                lastName: string = item.lastName;
                supervisorEmail: string = item.supervisorEmail;
                darpaAllocationPct: number = item.darpaAllocationPct;
                isSupervisor: boolean = item.isSupervisor;
                isActive: boolean = item.isActive;
                projects: Project[] = item.projects;
            })
        );
    }

    getUsers() {

        console.log('Getting Users info');

        const token = 'Bearer ' + this.oAuthService.getIdToken();
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: token
        });

        return this.http.get<User[]>(this.configUrl + '/users', {headers: httpHeaders}).pipe(
            mergeMap((items: User[]) => from(items)),
            // tslint:disable-next-line:new-parens
            map((item: User) => new class implements User {

                email: string = item.email;
                firstName: string = item.firstName;
                lastName: string = item.lastName;
                supervisorEmail: string = item.supervisorEmail;
                darpaAllocationPct: number = item.darpaAllocationPct;
                isSupervisor: boolean = item.isSupervisor;
                isActive: boolean = item.isActive;
                projects: Project[] = item.projects;
            })
        );
    }

    setEditUser(user: User){
        this.editUser = user;
    }

    getEditUser(){
        return this.editUser;
    }
}
