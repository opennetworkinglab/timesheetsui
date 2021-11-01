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

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {TsdaysService} from '../tsdays.service';
import {min} from 'rxjs/operators';

export interface Time {
    name: string;
    minutes: number;
}

@Component({
    selector: 'app-day',
    templateUrl: './day.component.html',
    styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, OnChanges {
    @Input() email: string;
    @Input() day: string;
    @Input() date: string;
    @Input() weekend: boolean;
    @Input() onfDay: boolean;
    @Input() tabIndex: number;

    @Input() times: Time[];
    @Input() userSigned: boolean;

    @Input() darpaMins: number = 0;
    @Input() sickMins: number = 0;
    @Input() holidayMins: number = 0;
    @Input() ptoMins: number = 0;
    @Input() gAMins: number = 0;
    @Input() iRDMins: number = 0;

    @Input() dayId: number;
    @Input() darpaAllocationPct: number;
    remainingTime: number = 8;

    totalHours: number = 0;

    @Output() projectTimeChange: EventEmitter<{name, minutes}> = new EventEmitter<{name, minutes}>();

    constructor(private tsdaysService: TsdaysService) {
    }

    ngOnInit(): void {

        this.updateTotal('', 0);
        //  if any time has been set for anything for a day. This will be set to true
        //  This will not be set to true for 0 hours
        let timeSet = false;

        if (this.times !== undefined) {

            for (const time of this.times) {

                switch (time.name) {
                    case 'Darpa HR001120C0107':
                        if (time.minutes !== 0) {
                            this.darpaMins = time.minutes;
                            timeSet = true;
                        }
                        break;
                    case 'Sick':
                        if (time.minutes !== 0) {
                            this.sickMins = time.minutes;
                            timeSet = true;
                        }
                        break;
                    case 'Holiday':
                        if (time.minutes !== 0) {
                            this.holidayMins = time.minutes;
                            timeSet = true;
                        }
                        break;
                    case 'PTO':
                        if (time.minutes !== 0) {
                            this.ptoMins = time.minutes;
                            timeSet = true;
                        }
                        break;
                    case 'G_A':
                        if (time.minutes !== 0) {
                            this.gAMins = time.minutes;
                            timeSet = true;
                        }
                        break;
                    case 'IR_D':
                        if (time.minutes !== 0) {
                            this.iRDMins = time.minutes;
                            timeSet = true;
                        }
                        break;
                    default:
                }
                this.updateTotal(time.name, time.minutes);
                this.projectTimeChange.emit({ name: time.name, minutes: time.minutes });
            }
        }

        // If timeSet is true will not set onf holiday as hours are already allocated for that day.
        if (this.onfDay && timeSet === false) {
            this.holidayMins = 480;
            this.updateTotal('Holiday', 480);
            this.tsdaysService.updateTimeInDay(this.email, this.day, 'Holiday', 480);
            this.projectTimeChange.emit({ name: 'Holiday', minutes: 480});
        }

    }

    ngOnChanges(val) {
        // console.log(val);
    }



    update(project, minutes) {

        const oldMinutes = this.getOldMinutes(project);

        if (minutes !== undefined) {
            if (minutes === ''){
                minutes = 0;
            }
            this.updateTotal(project, minutes);
            this.tsdaysService.updateTimeInDay(this.email, this.day, project, minutes);

            if (oldMinutes - minutes > 0) {
                minutes = (oldMinutes - minutes) * -1;
            }
            else{
                minutes = (oldMinutes - minutes) * -1;
            }

            this.projectTimeChange.emit({name: project, minutes});
        }
    }

    getOldMinutes(name) {
        switch (name) {
            case 'Darpa HR001120C0107':
                return this.darpaMins;
                break;
            case 'Sick':
                return this.sickMins;
                break;
            case 'Holiday':
                return this.holidayMins;
                break;
            case 'PTO':
                return this.ptoMins;
                break;
            case 'G_A':
                return this.gAMins;
                break;
            case 'IR_D':
                return this.iRDMins;
                break;
            default:
        }
    }

    updateTotal(name: string, value: number) {

        if (value === undefined) {
            return;
        }

        name.replace('&', '_');
        switch (name) {
            case 'Darpa HR001120C0107':
                this.darpaMins = Number(value);
                break;
            case 'Sick':
                this.sickMins = Number(value);
                break;
            case 'Holiday':
                this.holidayMins = Number(value);
                break;
            case 'PTO':
                this.ptoMins = Number(value);
                break;
            case 'G_A':
                this.gAMins = Number(value);
                break;
            case 'IR_D':
                this.iRDMins = Number(value);
                break;
            default:
        }

        this.totalHours = 0;
        this.totalHours += (this.darpaMins === undefined ? 0 : this.darpaMins);
        this.totalHours += (this.sickMins === undefined ? 0 : this.sickMins);
        this.totalHours += (this.ptoMins === undefined ? 0 : this.ptoMins);
        this.totalHours += (this.holidayMins === undefined ? 0 : this.holidayMins);
        this.totalHours += (this.gAMins === undefined ? 0 : this.gAMins);
        this.totalHours += (this.iRDMins === undefined ? 0 : this.iRDMins);
        this.totalHours /= 60;
    }

    updateRemainingTime(minutes){
        if (minutes < 0){
            minutes = 0;
        }
        this.remainingTime = minutes;
    }
}
