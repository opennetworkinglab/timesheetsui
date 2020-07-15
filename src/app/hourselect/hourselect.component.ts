import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-hourselect',
  templateUrl: './hourselect.component.html',
  styleUrls: ['./hourselect.component.css']
})
export class HourselectComponent {
  @Input() mins: number = 0;
  @Output() updatedEvent = new EventEmitter<number>();

  constructor() { }
}
