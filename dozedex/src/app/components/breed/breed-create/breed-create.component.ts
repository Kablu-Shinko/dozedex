import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { interval, firstValueFrom } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import { Breed } from 'src/app/interfaces/breed.interface';
import { BreedService } from 'src/app/services/breed.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../../assets/dialog/dialog.component';
import { DialogData } from 'src/app/interfaces/small-interfaces/small-interfaces';

@Component({
  selector: 'app-breed-create',
  templateUrl: './breed-create.component.html',
  styleUrls: ['./breed-create.component.css']
})
export class BreedCreateComponent implements OnInit {

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private breedService: BreedService,
    private formBuilder: FormBuilder,
    private dozedexService: DozedexService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  Area: string = "";
  Key: number = 0;
  loading: boolean = false;
  breedImagePath: string = '';
  
  breed: Breed = {
    Description: '',
    ImagePath: '',
    Name: '',
    ShowImage: false
  };

  breedForm = this.formBuilder.group({
    Name: [''],
    Description: ['']
  });

  async ngOnInit(): Promise<void> {
    this.Area = "";
    this.Key = this.breedService.GetBreedKey();

    if(this.Key > 0){
      this.Area = "Raças > Edição";
      this.breed = await this.breedService.GetOne(this.Key);
    }
    else{
      this.Area = "Raças > Criação";
    }

    this.breed.ImagePath = this.imageService.GetFullImageURL(this.breed.ImagePath);
    this.breedImagePath = this.breed.ImagePath;
    this.InitForm();
  }

  InitForm(): void{
    this.breedForm.controls.Name.setValue(this.breed.Name);
    this.breedForm.controls.Description.setValue(this.breed.Description);
  }

  async onSubmit(): Promise<void>{
    if(this.breedForm.valid){
      this.loading = true;
      var editedBreed: Breed = {
        Name: this.breedForm.controls.Name.value ?? this.breed.Name,
        ImageUrl: this.breed.ImageUrl,
        Description: this.breedForm.controls.Description.value ?? this.breed.Description,
        ImagePath: '',
        ShowImage: true,
        Key: this.breed.Key ?? -1,
        Status: this.breed.Status ?? false
      }

      var result: string = '';

      if(editedBreed.Key === -1){
        result = await this.breedService.AddBreed(editedBreed);
      }
      else{
        result = await this.breedService.UpdateBreed(editedBreed);
      }

      await this.dozedexService.RefreshPage(this.router.url);

      alert(result);
    }
    else{
      alert("Verifique os campos e tente novamente")
    }
    this.loading = false;
    this.router.navigate(['breed/list']);
  }

  async SaveUrl(newUrl: string): Promise<string>{
    var editedBreed: Breed = {
      Name: this.breed.Name,
      ImageUrl: newUrl,
      Description: this.breed.Description,
      Key: this.breed.Key,
      ShowImage: true,
      Status: this.breed.Status,
      ImagePath: this.breed.ImagePath
    }

    if(editedBreed.Key === undefined || editedBreed.Key === -1){
      this.breed.ImageUrl = newUrl;
      return "agora complete o cadastro";
    }

    var result = await this.breedService.UpdateBreed(editedBreed);
    await this.dozedexService.RefreshPage(this.router.url);

    return result;
  }

  openDialog(): void {
    const data: DialogData = {
      Title: "Trocar url da imagem",
      Description: "insira abaixo a url da nova imagem",
      FunctionDescription: "Atualizar",
      Inputs: [
        {
          Label: "Nova URL",
          Input: this.breedImagePath,
          Type: "text"
        }
      ],
      Function: async (inputs: string[]) => { 
        let response = await this.SaveUrl(inputs[0]); 
        this.dialog.closeAll();
        return response; 
      }
    }
    
    this.dialog.open(DialogComponent, {
      width: '400px',
      data: data
    });
  }
}
