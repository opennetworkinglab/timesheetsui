import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @Input() email: string;
  @Input() day: string;
  workedHours: number = 0;
  ngpaHours: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
