import { Injectable } from '@angular/core';
import {TIMESHEETS_REST_URL} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {map} from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class UserService {

    configUrl = TIMESHEETS_REST_URL + '/auth';

    constructor(private http: HttpClient,
                private oAuthService: OAuthService) {
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
}
