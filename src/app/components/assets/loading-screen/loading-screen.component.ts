import { Component, OnInit, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {

  constructor() { }

  @Input() Progress: number = 0;
  @Input() HasProgressStatus: boolean = false;
  @Input() Color: ThemePalette = "primary";
  @Input() Area: string = 'Carregando...'

  ngOnInit(): void {
  }

}
