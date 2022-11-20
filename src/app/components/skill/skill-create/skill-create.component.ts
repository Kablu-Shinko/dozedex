import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../assets/dialog/dialog.component';
import { DialogData } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { SkillService } from 'src/app/services/skill.service';
import { Skill } from 'src/app/interfaces/skill.interface';

@Component({
  selector: 'app-skill-create',
  templateUrl: './skill-create.component.html',
  styleUrls: ['./skill-create.component.css']
})
export class SkillCreateComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private dozedexService: DozedexService,
    private skillService: SkillService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  Area: string = "";
  Key: number = 0;
  loading: boolean = false;
  skillImagePath: string = '';
  defaultSkillImageUrl: string = 'https://drive.google.com/file/d/10ya4XnetYlQNaEZYJTr9Pwe4xFe2SIEq/view?usp=sharing';
  btnLoading: boolean = false;

  skill: Skill = {
    ShortDescription: '',
    Name: '',
    LongDescription: '',
    ImageUrl: '',
    ImagePath: '',
    Key: -1,
    Status: false
  };

  skillForm = this.formBuilder.group({
    Name: [''],
    ShortDescription: [''],
    LongDescription: ['']
  });

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.Area = "";
    this.Key = this.skillService.GetSkillKey();

    if(this.Key > 0){
      this.Area = "Habilidades > Edição";
      this.skill = await this.skillService.GetOne(this.Key);
    }
    else{
      this.Area = "Habilidades > Criação";
    }
    this.skill.ImagePath = this.imageService.GetFullImageURL(this.skill.ImageUrl ?? this.defaultSkillImageUrl);
    this.skillImagePath = this.skill.ImagePath;
    console.table(this.skill);
    this.InitForm();
    this.loading = false;
  }

  InitForm(): void{
    this.skillForm.controls.Name.setValue(this.skill.Name);
    this.skillForm.controls.ShortDescription.setValue(this.skill.ShortDescription);
    this.skillForm.controls.LongDescription.setValue(this.skill.LongDescription);
  }

  async onSubmit(): Promise<void>{
    if(this.skillForm.valid){
      this.btnLoading = true;
      var editedskill: Skill = {
        Name: this.skillForm.controls.Name.value ?? this.skill.Name,
        ShortDescription: this.skillForm.controls.ShortDescription.value ?? this.skill.ShortDescription,
        LongDescription: this.skillForm.controls.LongDescription.value ?? this.skill.LongDescription,
        ImageUrl: this.skill.ImageUrl ?? this.defaultSkillImageUrl,
        Key: this.skill.Key ?? -1,
        Status: this.skill.Status ?? false
      }

      var result: string = '';

      if(editedskill.Key === -1){
        result = await this.skillService.AddSkill(editedskill);
      }
      else{
        result = await this.skillService.UpdateSkill(editedskill);
      }

      await this.dozedexService.RefreshPage(this.router.url);

      alert(result);
    }
    else{
      alert("Verifique os campos e tente novamente")
    }
    this.btnLoading = false;
    this.router.navigate(['skill/list']);
  }

  async SaveUrl(newUrl: string): Promise<string>{
    var editedSkill: Skill = {
      Name: this.skill.Name,
      ImageUrl: newUrl,
      ShortDescription: this.skill.ShortDescription,
      LongDescription: this.skill.LongDescription,
      Key: this.skill.Key,
      Status: this.skill.Status,
      ImagePath: this.skill.ImagePath
    }

    if(editedSkill.Key === undefined || editedSkill.Key === -1){
      this.skill.ImageUrl = newUrl;
      return "agora complete o cadastro";
    }

    var result = await this.skillService.UpdateSkill(editedSkill);
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
          Input: this.skillImagePath,
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
