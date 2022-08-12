import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breed } from 'src/app/interfaces/breed.interface';
import { BreedService } from 'src/app/services/breed.service';
import { DozedexService } from 'src/app/services/dozedex.service';

@Component({
  selector: 'app-breed-list',
  templateUrl: './breed-list.component.html',
  styleUrls: ['./breed-list.component.css']
})

export class BreedListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private breedService: BreedService,
    private router: Router,
    private dozedexService: DozedexService
  ) { }

  Area: string = "Raças";
  breeds: Breed[] = [];
  fullList: Breed[] = [];

  async ngOnInit(): Promise<void> {
    var list: Breed[] = await this.breedService.GetAllBreeds();
    this.fullList = list;
    this.breeds = list;
  } 

  SearchBreed(search: string){
    this.breeds = [];

    this.fullList.forEach((breed: Breed) =>{
      if((breed.Name.toLowerCase().indexOf(search.toLowerCase()) != -1)
        || (breed.Description.toLowerCase().indexOf(search.toLowerCase()) != -1)
      ){
        this.breeds.push(breed);
      }
    })
  }
  
  GoToEdit(key: number | undefined): void{
    this.breedService.SetBreedKey(key ?? 0);
    this.router.navigate(['breed/create']);
  }

  AddNew(){
    this.breedService.ResetKey();
    this.router.navigate(['breed/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    await this.breedService.Inactive(key);
    alert("Excluido");
    await this.dozedexService.RefreshPage(this.router.url);
  }
}
