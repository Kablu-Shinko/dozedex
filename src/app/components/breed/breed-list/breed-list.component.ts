import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breed } from 'src/app/interfaces/breed.interface';
import { AudioService } from 'src/app/services/audio.service';
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
    private dozedexService: DozedexService,
    private audioService: AudioService
  ) { }

  Area: string = "Raças";
  breeds: Breed[] = [];
  fullList: Breed[] = [];
  loading: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    var list: Breed[] = await this.breedService.GetAllBreeds();
    this.fullList = list;
    this.breeds = list;
    this.loading = false;
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
    this.SelectItem();
    this.breedService.SetBreedKey(key ?? 0);
    this.router.navigate(['breed/edit']);
  }

  AddNew(){
    this.SelectItem();
    this.breedService.ResetKey();
    this.router.navigate(['breed/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    this.SelectItem();
    await this.breedService.Inactive(key);
    alert("Excluido");
    await this.dozedexService.RefreshPage(this.router.url);
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }

  ChangeItem(): void {
    this.audioService.ChangeItem();
  }
}
