import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'src/app/interfaces/character.interface';
import { DozedexService } from 'src/app/services/dozedex.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.css']
})
export class CharactersListComponent implements OnInit {

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private dozedexService: DozedexService
  ) { }

  Area: string = "Personagens";
  characters: Character[] = [];
  fullList: Character[] = [];
  loading: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    var list: Character[] = await this.characterService.GetAllCharactersMinified();
    this.fullList = list;
    this.characters = list;
    this.loading = false;
  } 

  SearchCharacter(search: string){
    this.characters = [];

    this.fullList.forEach((character: Character) =>{
      if((character.Name.toLowerCase().indexOf(search.toLowerCase()) != -1)
        || (character.ShortDescription.toLowerCase().indexOf(search.toLowerCase()) != -1)
      ){
        this.characters.push(character);
      }
    })
  }
  
  GoToEdit(key: number | undefined): void{
    this.characterService.SetCharacterKey(key ?? 0);
    this.router.navigate(['character/edit']);
  }

  GoToDetails(key: number | undefined): void{
    this.characterService.SetCharacterKey(key ?? 0);
    this.router.navigate(['character/details']);
  }

  AddNew(){
    this.characterService.ResetKey();
    this.router.navigate(['character/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    await this.characterService.Inactive(key);
    await this.dozedexService.RefreshPage(this.router.url);
  }
}
