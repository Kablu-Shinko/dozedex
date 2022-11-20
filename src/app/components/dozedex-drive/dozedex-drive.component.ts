import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dozedex-drive',
  templateUrl: './dozedex-drive.component.html',
  styleUrls: ['./dozedex-drive.component.css']
})
export class DozedexDriveComponent implements OnInit {

  constructor() { }

  Area: string = "Dozedex Drive";

  ngOnInit(): void {
  }

  GoTo4Shared(): void {
    window.open("https://www.4shared.com/folder/VuchRFqi/Dozedex_drive.html");
  }

}
