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

    constructor() {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {

        const select = $('#' + this.id);
        $(select).mousedown(() => {

            const option = select.find('option:contains(\'8.00\')');
            const optionTop = option.offset().top;
            const selectTop = select.offset().top;
            select.scrollTop(select.scrollTop() + (optionTop - selectTop));
            option.prop('selected', true);
            this.updatedEvent.emit(480);
        });
    }
}
