import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-pulsing-button',
  templateUrl: './pulsing-button.component.html',
  styleUrls: ['./pulsing-button.component.css']
})
export class PulsingButtonComponent implements OnInit {

  @Input() pulsingButtonClass: string = "";
  @Input() loading: boolean = false;
  @Input() text: string = "";

  constructor() { }

  ngOnInit(): void {
  }
}
