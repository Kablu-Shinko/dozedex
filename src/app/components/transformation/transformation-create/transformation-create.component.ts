import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../assets/dialog/dialog.component';
import { DialogData } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { TransformationService } from 'src/app/services/transformation.service';
import { Transformation } from 'src/app/interfaces/transformation.interface';

@Component({
  selector: 'app-transformation-create',
  templateUrl: './transformation-create.component.html',
  styleUrls: ['./transformation-create.component.css']
})
export class TransformationCreateComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private dozedexService: DozedexService,
    private transformationService: TransformationService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  Area: string = "";
  Key: number = 0;
  btnLoading: boolean = false;
  transformationImagePath: string = '';
  loading: boolean = false;
  
  transformation: Transformation = {
    ShortDescription: '',
    ImagePath: '',
    Name: '',
    LongDescription: '',
    ImageUrl: '',
    Key: -1,
    Status: false
  };

  transformationForm = this.formBuilder.group({
    Name: [''],
    ShortDescription: [''],
    LongDescription: ['']
  });

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.Area = "";
    this.Key = this.transformationService.GetTransformationKey();

    if(this.Key > 0){
      this.Area = "Transformações > Edição";
      this.transformation = await this.transformationService.GetOne(this.Key);
    }
    else{
      this.Area = "Transformações > Criação";
    }

    this.transformation.ImagePath = this.imageService.GetFullImageURL(this.transformation.ImagePath ?? '');
    this.transformationImagePath = this.transformation.ImagePath;
    this.InitForm();
    this.loading = false;
  }

  InitForm(): void{
    this.transformationForm.controls.Name.setValue(this.transformation.Name);
    this.transformationForm.controls.ShortDescription.setValue(this.transformation.ShortDescription);
    this.transformationForm.controls.LongDescription.setValue(this.transformation.LongDescription ?? "");
  }

  async onSubmit(): Promise<void>{
    this.btnLoading = true;
    if(this.transformationForm.valid){
      var editedTransformation: Transformation = {
        Name: this.transformationForm.controls.Name.value ?? this.transformation.Name,
        ImageUrl: this.transformation.ImageUrl,
        ShortDescription: this.transformationForm.controls.ShortDescription.value ?? this.transformation.ShortDescription,
        LongDescription: this.transformationForm.controls.LongDescription.value ?? this.transformation.LongDescription,
        ImagePath: '',
        Key: this.transformation.Key ?? -1,
        Status: this.transformation.Status ?? false
      }

      var result: string = '';

      if(editedTransformation.Key === -1){
        result = await this.transformationService.AddTransformation(editedTransformation);
      }
      else{
        result = await this.transformationService.UpdateTransformation(editedTransformation);
      }

      await this.dozedexService.RefreshPage(this.router.url);

      alert(result);
    }
    else{
      alert("Verifique os campos e tente novamente")
    }
    this.btnLoading = false;
    this.router.navigate(['transformation/list']);
  }

  async SaveUrl(newUrl: string): Promise<string>{
    var editedTransformation: Transformation = {
      Name: this.transformation.Name,
      ImageUrl: newUrl,
      ShortDescription: this.transformation.ShortDescription,
      LongDescription: this.transformation.LongDescription,
      Key: this.transformation.Key,
      Status: this.transformation.Status,
      ImagePath: this.transformation.ImagePath
    }

    if(editedTransformation.Key === undefined || editedTransformation.Key === -1){
      this.transformation.ImageUrl = newUrl;
      return "agora complete o cadastro";
    }

    var result = await this.transformationService.UpdateTransformation(editedTransformation);
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
          Input: this.transformationImagePath,
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
