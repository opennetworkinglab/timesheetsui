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

import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-day',
    templateUrl: './day.component.html',
    styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
    @Input() email: string;
    @Input() day: string;
    @Input() weekend: boolean;

    @Input() workedMins: number = undefined;
    @Input() ngpaMins: number = undefined;
    @Input() adminMins: number = undefined;
    @Input() fundrMins: number = undefined;
    @Input() salesmMins: number = undefined;
    @Input() otherMins: number = undefined;
    @Input() leavesickMins: number = undefined;
    @Input() leaveptoMins: number = undefined;
    @Input() holidayMins: number = undefined;
    @Input() timeIn1: number = 0;
    @Input() timeOut1: number = 0;
    @Input() timeIn2: number = 0;
    @Input() timeOut2: number = 0;
    @Input() regMins: number = 0;
    @Input() otMins: number = 0;

    totalHours: number = 0;

    constructor() {
    }

    ngOnInit(): void {
        this.updateTotal('', 0);
    }

    updateTotal(name: string, value: number) {
        // console.log('updated', name, value, typeof value, typeof Number(value), Number(value));
        if (value === undefined) {
            return;
        }
        switch (name) {
            case 'workedMins':
                this.workedMins = Number(value);
                break;
            case 'ngpaMins':
                this.ngpaMins = Number(value);
                break;
            case 'adminMins':
                this.adminMins = Number(value);
                break;
            case 'fundrMins':
                this.fundrMins = Number(value);
                break;
            case 'salesmMins':
                this.salesmMins = Number(value);
                break;
            case 'otherMins':
                this.otherMins = Number(value);
                break;
            case 'leavesickMins':
                this.leavesickMins = Number(value);
                break;
            case 'leaveptoMins':
                this.leaveptoMins = Number(value);
                break;
            case 'holidayMins':
                this.holidayMins = Number(value);
                break;
            default:
        }
        this.totalHours = 0;
        this.totalHours += (this.workedMins === undefined ? 0 : this.workedMins);
        this.totalHours += (this.ngpaMins === undefined ? 0 : this.ngpaMins);
        this.totalHours += (this.adminMins === undefined ? 0 : this.adminMins);
        this.totalHours += (this.fundrMins === undefined ? 0 : this.fundrMins);
        this.totalHours += (this.salesmMins === undefined ? 0 : this.salesmMins);
        this.totalHours += (this.otherMins === undefined ? 0 : this.otherMins);
        this.totalHours += (this.leavesickMins === undefined ? 0 : this.leavesickMins);
        this.totalHours += (this.leaveptoMins === undefined ? 0 : this.leaveptoMins);
        this.totalHours += (this.holidayMins === undefined ? 0 : this.holidayMins);
        this.totalHours /= 60;
    }

}
