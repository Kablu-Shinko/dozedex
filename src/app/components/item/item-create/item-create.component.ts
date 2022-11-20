import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DialogComponent } from '../../assets/dialog/dialog.component';
import { DialogData } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/interfaces/item.interface';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private dozedexService: DozedexService,
    private itemService: ItemService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  Area: string = "";
  Key: number = 0;
  btnLoading: boolean = false;
  itemImagePath: string = '';
  loading: boolean = false;
  
  item: Item = {
    ShortDescription: '',
    ImagePath: '',
    Name: '',
    LongDescription: '',
    ImageUrl: '',
    Key: -1,
    Status: false
  };

  itemForm = this.formBuilder.group({
    Name: [''],
    ShortDescription: [''],
    LongDescription: ['']
  });

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.Area = "";
    this.Key = this.itemService.GetItemKey();

    if(this.Key > 0){
      this.Area = "Itens > Edição";
      this.item = await this.itemService.GetOne(this.Key);
    }
    else{
      this.Area = "Itens > Criação";
    }

    this.item.ImagePath = this.imageService.GetFullImageURL(this.item.ImagePath ?? '');
    this.itemImagePath = this.item.ImagePath;
    this.InitForm();
    this.loading = false;
  }

  InitForm(): void{
    this.itemForm.controls.Name.setValue(this.item.Name);
    this.itemForm.controls.ShortDescription.setValue(this.item.ShortDescription);
    this.itemForm.controls.LongDescription.setValue(this.item.LongDescription ?? "");
  }

  async onSubmit(): Promise<void>{
    if(this.itemForm.valid){
      this.btnLoading = true;
      var editedItem: Item = {
        Name: this.itemForm.controls.Name.value ?? this.item.Name,
        ImageUrl: this.item.ImageUrl,
        ShortDescription: this.itemForm.controls.ShortDescription.value ?? this.item.ShortDescription,
        LongDescription: this.itemForm.controls.LongDescription.value ?? this.item.LongDescription,
        ImagePath: '',
        Key: this.item.Key ?? -1,
        Status: this.item.Status ?? false
      }

      var result: string = '';

      if(editedItem.Key === -1){
        result = await this.itemService.AddItem(editedItem);
      }
      else{
        result = await this.itemService.UpdateItem(editedItem);
      }

      await this.dozedexService.RefreshPage(this.router.url);

      alert(result);
    }
    else{
      alert("Verifique os campos e tente novamente")
    }
    this.btnLoading = false;
    this.router.navigate(['item/list']);
  }

  async SaveUrl(newUrl: string): Promise<string>{
    var editedItem: Item = {
      Name: this.item.Name,
      ImageUrl: newUrl,
      ShortDescription: this.item.ShortDescription,
      LongDescription: this.item.LongDescription,
      Key: this.item.Key,
      Status: this.item.Status,
      ImagePath: this.item.ImagePath
    }

    if(editedItem.Key === undefined || editedItem.Key === -1){
      this.item.ImageUrl = newUrl;
      return "agora complete o cadastro";
    }

    var result = await this.itemService.UpdateItem(editedItem);
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
          Input: this.itemImagePath,
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
