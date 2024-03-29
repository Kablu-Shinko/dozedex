import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
// import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../assets/dialog/dialog.component';
import { DialogData } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private dozedexService: DozedexService,
    private router: Router,
    public dialog: MatDialog,
    private audioService: AudioService
  ) { }
  
  Area: string = "Perfil de usuário"
  loading: boolean = false;
  btnLoading: boolean = false;
  user: User = this.userService.GetUser();
  profilePictureURL: string = "";
  actualPassword: string = "";

  profileForm = this.formBuilder.group({
    Email: [''],
    Name: [''],
    UserName: [''],
    Password: [''],
    OldPassword: [''],
    ImageUrl: [''],
    KeepLogin: [false]
  });

  ngOnInit(): void {
    this.loading = true;
    this.profileForm.controls.Email.setValue(this.user.Email);
    this.profileForm.controls.ImageUrl.setValue(this.user.ImageUrl ?? "");
    this.profileForm.controls.KeepLogin.setValue(this.user.KeepLogin === true);
    this.profileForm.controls.Name.setValue(this.user.Name ?? "");
    this.profileForm.controls.UserName.setValue(this.user.UserName ?? "");
    this.loading = false;
  }

  async onSubmit(): Promise<void> {
    this.btnLoading = true;
    if(this.profileForm.valid){
      this.loading = true;
      var editedUser: User = {
        Email: this.profileForm.controls.Email.value ?? this.user.Email,
        KeepLogin: this.profileForm.controls.KeepLogin.value ?? this.user.KeepLogin,
        Password: this.profileForm.controls.Password.value ?? "",
        OldPassword: this.profileForm.controls.OldPassword.value ?? "",
        Name: this.profileForm.controls.Name.value ?? this.user.Name,
        ImageUrl: this.user.ImageUrl,
        UserName: this.profileForm.controls.UserName.value ?? this.user.UserName 
      }

      var result = await this.userService.UpdateUser(editedUser);
      await this.dozedexService.RefreshPage(this.router.url);

      alert(result ?? "Dados atualizados!");
    }
    else{
      alert("Verifique os campos obrigatórios e tente novamente")
    }
    this.btnLoading = false;
  }

  async SaveUrl(newUrl: string, actualPassword: string): Promise<string>{
    var editedUser: User = {
      Email: this.user.Email,
      KeepLogin: this.user.KeepLogin,
      Password: "",
      OldPassword: actualPassword,
      Name: this.user.Name,
      ImageUrl: newUrl,
      UserName: this.user.UserName 
    }

    var result = await this.userService.UpdateUser(editedUser);
    await this.dozedexService.RefreshPage(this.router.url);

    return result;
  }

  openDialog(): void {
    this.SelectItem();
    const data: DialogData = {
      Title: "Trocar url da imagem",
      Description: "insira abaixo a url da nova imagem",
      FunctionDescription: "Atualizar",
      Inputs: [
        {
          Label: "Nova URL",
          Input: this.profilePictureURL,
          Type: "text"
        },
        {
          Label: "Senha atual",
          Input: this.actualPassword,
          Type: "password"
        }
      ],
      Function: async (inputs: string[]) => { 
        this.SelectItem();
        await this.SaveUrl(inputs[0], inputs[1]); 
        this.dialog.closeAll(); 
      }
    }
    
    this.dialog.open(DialogComponent, {
      width: '400px',
      data: data
    });
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }

  ChangeItem(): void {
    this.audioService.ChangeItem();
  }
}