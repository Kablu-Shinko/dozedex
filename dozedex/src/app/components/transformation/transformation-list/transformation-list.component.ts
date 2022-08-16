import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transformation } from 'src/app/interfaces/transformation.interface';
import { DozedexService } from 'src/app/services/dozedex.service';
import { TransformationService } from 'src/app/services/transformation.service';

@Component({
  selector: 'app-transformation-list',
  templateUrl: './transformation-list.component.html',
  styleUrls: ['./transformation-list.component.css']
})
export class TransformationListComponent implements OnInit {

  constructor(
    private transformationService: TransformationService,
    private router: Router,
    private dozedexService: DozedexService
  ) { }

  Area: string = "Transformações";
  transformations: Transformation[] = [];
  fullList: Transformation[] = [];
  loading: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    var list: Transformation[] = await this.transformationService.GetAllTransformations();
    this.fullList = list;
    this.transformations = list;
    this.loading = false;
  } 

  SearchTransformation(search: string){
    this.transformations = [];

    this.fullList.forEach((transformation: Transformation) =>{
      if((transformation.Name.toLowerCase().indexOf(search.toLowerCase()) != -1)
        || (transformation.ShortDescription.toLowerCase().indexOf(search.toLowerCase()) != -1)
      ){
        this.transformations.push(transformation);
      }
    })
  }
  
  GoToEdit(key: number | undefined): void{
    this.transformationService.SetTransformationKey(key ?? 0);
    this.router.navigate(['transformation/edit']);
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
    await this.dozedexService.RefreshPage(this.router.url);
  }
}
