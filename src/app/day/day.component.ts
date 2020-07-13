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

  @Input() workedMins: number = 0;
  @Input() ngpaMins: number = 0;
  @Input() adminMins: number = 0;
  @Input() fundrMins: number = 0;
  @Input() salesmMins: number = 0;
  @Input() otherMins: number = 0;
  @Input() leavesickMins: number = 0;
  @Input() leaveptoMins: number = 0;
  @Input() holidayMins: number = 0;
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
    this.updateTotal();
  }

  updateTotal() {
    this.totalHours = (this.workedMins +
      this.ngpaMins + this.adminMins +
      this.fundrMins + this.salesmMins +
      this.otherMins + this.leavesickMins +
      this.leaveptoMins + this.holidayMins) / 60;
  }

}
