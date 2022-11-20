import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dozedex-spacer',
  templateUrl: './dozedex-spacer.component.html',
  styleUrls: ['./dozedex-spacer.component.css']
})
export class DozedexSpacerComponent implements OnInit {

  @Input() rows: number = 2;
  _rows: string[] = [];

  constructor() { }

  ngOnInit(): void {
    for(let i: number = 0; i < this.rows; i++){
      this._rows.push('row');
    }
  }
}
