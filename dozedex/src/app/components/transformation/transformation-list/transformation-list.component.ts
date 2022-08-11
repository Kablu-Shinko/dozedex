import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breed } from 'src/app/interfaces/breed.interface';
import { Transformation } from 'src/app/interfaces/transformation.interface';
import { BreedService } from 'src/app/services/breed.service';
import { TransformationService } from 'src/app/services/transformation.service';

@Component({
  selector: 'app-transformation-list',
  templateUrl: './transformation-list.component.html',
  styleUrls: ['./transformation-list.component.css']
})
export class TransformationListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private transformationService: TransformationService,
    private router: Router
  ) { }

  Area: string = "Transformações";
  transformations: Transformation[] = [];
  fullList: Transformation[] = [];

  async ngOnInit(): Promise<void> {
    var list: Transformation[] = await this.transformationService.GetAllTransformations();
    this.fullList = list;
    this.transformations = list;
  } 

  SearchBreed(search: string){
    this.transformations = [];

    this.fullList.forEach((breed: Transformation) =>{
      if(breed.Name.toLowerCase().indexOf(search.toLowerCase()) != -1){
        this.transformations.push(breed);
      }
    })
  }
  
  GoToEdit(key: number | undefined): void{
    this.transformationService.SetTransformationKey(key ?? 0);
    this.router.navigate(['transformation/create']);
  }

  GoToDetails(key: number | undefined): void{
    this.transformationService.SetTransformationKey(key ?? 0);
    this.router.navigate(['transformation/details']);
  }

  AddNew(){
    this.transformationService.ResetKey();
    this.router.navigate(['transformation/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    await this.transformationService.Inactive(key);
  }
}
