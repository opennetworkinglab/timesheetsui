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
    AfterViewInit,
    Component,
    EventEmitter,
    Input, OnInit,
    Output,
} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-hourselect',
    templateUrl: './hourselect.component.html',
    styleUrls: ['./hourselect.component.css']
})
export class HourselectComponent implements OnInit, AfterViewInit{
    @Input() mins: number = 0;
    @Output() updatedEvent = new EventEmitter<number>();
    @Input() userSigned: boolean;
    @Input() id: string;
    @Input() darpaAllocationPct: number;
    @Input() tabIndex: number;

    @Input() isDarpaTime = false;

    value;

    normalDayHours: number = 8;
    oldRemainingMins: number = 0; // Keeps track of the old remaining mins.
    @Input() remainingTime: number;
    @Output() updateRemainingTime = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {

        if (this.isDarpaTime){
            setTimeout(() => {
                this.value = 0.00;
            });
        }

        const select = $('#' + this.id);
        $(select).mousedown(() => {

            // Only jumps to 8 when there is no value selected
            if (this.mins === 0 && this.remainingTime > 0) {

                let num = 8.00;
                let remainingTime = this.remainingTime;

                // 0 is passed for darpaAllocationPct for not Darpa projects. This only allows the darpa time to be the percent of darpa
                if (this.isDarpaTime) {

                    num = (this.normalDayHours * this.darpaAllocationPct) / 100;
                    const numInt = Math.floor(num);
                    if (num - numInt !== 0 && num - numInt < 0.5) {
                        num = numInt + 0.5;
                    } else if (num - numInt !== 0 && num - numInt > 0.5) {
                        num = numInt + 1;
                    }
                    remainingTime = remainingTime - num;
                    this.oldRemainingMins = num * 60
                }
                // This was way easier then what I was trying. DON'T COMPLICATE THE PROBLEM!
                else {
                    num = this.remainingTime;
                    const numInt = Math.floor(num);
                    if (num - numInt !== 0 && num - numInt < 0.5) {
                        num = numInt;
                    } else if (num - numInt !== 0 && num - numInt > 0.5) {
                        num = numInt + 0.5;
                    }
                    this.oldRemainingMins = num * 60;
                    remainingTime = remainingTime - num;
                }

                const option = select.find('option:contains(' + num + ')');
                const optionTop = option.offset().top;
                const selectTop = select.offset().top;
                select.scrollTop(select.scrollTop() + (optionTop - selectTop));
                option.prop('selected', true);

                this.updateRemainingTime.emit(remainingTime);
                this.updatedEvent.emit(num * 60);
            }
        });
    }

    updateEvents(mins){

        this.updatedEvent.emit(mins);

        // if old remaining mins is higher will add the difference to the remaining mins
        if (this.oldRemainingMins > mins) {

            mins = this.oldRemainingMins - mins;
            this.oldRemainingMins = mins;
            mins = this.remainingTime + mins;
            this.updateRemainingTime.emit(mins / 60);
        }
        else if (mins > this.oldRemainingMins ){
            this.oldRemainingMins = mins;
            mins = this.remainingTime - mins;
            this.updateRemainingTime.emit(mins / 60);
        }
    }
}
