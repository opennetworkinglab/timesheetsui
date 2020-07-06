import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @Input() email: string;
  @Input() day: string;
  @Input() workedMins: number = 0;
  @Input() ngpaHours: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
