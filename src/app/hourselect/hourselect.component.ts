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
            if (this.mins === 0) {

                let num = 8.00;

                // 0 is passed for darpaAllocationPct for not Darpa projects. This only allows the darpa time to be the percent of darpa
                if (this.isDarpaTime) {

                    num = (this.normalDayHours * this.darpaAllocationPct) / 100;
                    const numInt = Math.floor(num);
                    if (num - numInt !== 0 && num - numInt < 0.5) {
                        num = numInt + 0.5;
                    } else if (num - numInt !== 0 && num - numInt > 0.5) {
                        num = numInt + 1;
                    }
                }
                // This was way easier then what I was trying. DON'T COMPLICATE THE PROBLEM!
                else if (this.darpaAllocationPct !== 100) {

                    num = (this.normalDayHours * (100 - this.darpaAllocationPct)) / 100;
                    const numInt = Math.floor(num);
                    if (num - numInt !== 0 && num - numInt < 0.5) {
                        num = numInt;
                    } else if (num - numInt !== 0 && num - numInt > 0.5) {
                        num = numInt + 0.5;
                    }
                }
                else {
                    // if darpa is 100 percent and you click a non darpa project, will default to 0
                    return;
                }

                const option = select.find('option:contains(' + num + ')');
                const optionTop = option.offset().top;
                const selectTop = select.offset().top;
                select.scrollTop(select.scrollTop() + (optionTop - selectTop));
                option.prop('selected', true);

                this.updatedEvent.emit(num * 60);
            }
        });
    }
}
