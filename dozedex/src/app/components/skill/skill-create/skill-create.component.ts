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
  
  skill: Skill = {
    ShortDescription: '',
    Name: '',
    LongDescription: '',
    Key: -1,
    Status: false
  };

  skillForm = this.formBuilder.group({
    Name: [''],
    ShortDescription: [''],
    LongDescription: ['']
  });

  async ngOnInit(): Promise<void> {
    this.Area = "";
    this.Key = this.skillService.GetSkillKey();

    if(this.Key > 0){
      this.Area = "Habilidades > Edição";
      this.skill = await this.skillService.GetOne(this.Key);
    }
    else{
      this.Area = "Habilidades > Criação";
    }

    this.InitForm();
  }

  InitForm(): void{
    this.skillForm.controls.Name.setValue(this.skill.Name);
    this.skillForm.controls.ShortDescription.setValue(this.skill.ShortDescription);
    this.skillForm.controls.LongDescription.setValue(this.skill.LongDescription);
  }

  async onSubmit(): Promise<void>{
    if(this.skillForm.valid){
      this.loading = true;
      var editedskill: Skill = {
        Name: this.skillForm.controls.Name.value ?? this.skill.Name,
        ShortDescription: this.skillForm.controls.ShortDescription.value ?? this.skill.ShortDescription,
        LongDescription: this.skillForm.controls.LongDescription.value ?? this.skill.LongDescription,
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
    this.loading = false;
    this.router.navigate(['skill/list']);
  }
}
