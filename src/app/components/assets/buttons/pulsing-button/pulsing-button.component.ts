import { Component, OnInit, Input} from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-pulsing-button',
  templateUrl: './pulsing-button.component.html',
  styleUrls: ['./pulsing-button.component.css']
})
export class PulsingButtonComponent implements OnInit {

  @Input() pulsingButtonClass: string = "";
  @Input() loading: boolean = false;
  @Input() text: string = "";

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }
}
