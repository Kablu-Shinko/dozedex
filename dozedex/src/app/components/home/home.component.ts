import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardOption } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { DozedexService } from 'src/app/services/dozedex.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
      private router: Router,
      private dozedexService: DozedexService
    ) { }
  
  CardOptions: CardOption[] = [
    {
      Title: "Personagens",
      Description: "Lista de personagens",
      Function: () => this.router.navigate(['/characters/list'])
    },
    {
      Title: "Raças",
      Description: "Lista das raças conhecidas até então",
      Function: () => this.dozedexService.notImplemented()
    },
    {
      Title: "Mundos",
      Description: "Mundos atualmente conhecidos e seu estado atual",
      Function: () => this.dozedexService.notImplemented()
    },
    {
      Title: "Itens",
      Description: "Itens conhecidos",
      Function: () => this.dozedexService.notImplemented()
    }
  ]

  ngOnInit(): void {
  }

}
