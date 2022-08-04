import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  options: {
    Title: string,
    Description: string,
    Path: string
  }[] = [
    {
      Title: "Personagens",
      Description: "Lista de personagens",
      Path: "/characters/list"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
