import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';

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
    private router: Router
  ) { }

  loading: Boolean = false;
  user: User = this.userService.GetActualUser();

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
    this.profileForm.controls.Email.setValue(this.user.Email);
    this.profileForm.controls.ImageUrl.setValue(this.user.ImageUrl ?? "");
    this.profileForm.controls.KeepLogin.setValue(this.user.KeepLogin === true);
    this.profileForm.controls.Name.setValue(this.user.Name ?? "");
    this.profileForm.controls.UserName.setValue(this.user.UserName ?? "");
  }

  async onSubmit(): Promise<void> {
    if(this.profileForm.valid){
      this.loading = true;
      var editedUser: User = {
        Email: this.profileForm.controls.Email.value ?? this.user.Email,
        KeepLogin: this.profileForm.controls.KeepLogin.value ?? this.user.KeepLogin,
        Password: this.profileForm.controls.Password.value ?? "",
        OldPassword: this.profileForm.controls.OldPassword.value ?? "",
        Name: this.profileForm.controls.Name.value ?? this.user.Name,
        ImageUrl: this.profileForm.controls.ImageUrl.value ?? this.user.ImageUrl,
        UserName: this.profileForm.controls.UserName.value ?? this.user.UserName 
      }

      var result = await this.userService.UpdateUser(editedUser);
      await this.dozedexService.RefreshPage(this.router.url);

      alert(result);
    }
    else{
      alert("Verifique os campos obrigatórios e tente novamente")
    }
    this.loading = false;
  }
}
