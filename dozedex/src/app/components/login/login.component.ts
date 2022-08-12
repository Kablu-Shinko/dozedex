import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';
import { Auth } from 'src/app/interfaces/auth.interface';
import { DozedexService } from 'src/app/services/dozedex.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private dozedexService: DozedexService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private imageService: ImageService
  ) 
  {}
  
  loading: boolean = false;
  title = 'Login Dozedex';
  backgroundImagePath: string = this.imageService.GetFullImageURL('https://drive.google.com/file/d/1-98A51dnUZ2m7KG8ZNv_DdOXKq3NtqHe/view?usp=sharing');

  loginForm = this.formBuilder.group({
    Email: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
    Password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
    KeepLogin: [false]
  });

  ngOnInit(): void {
  }

  async onSubmit(){
    if(this.loginForm.valid){
      this.loading = true;
      var loggedUser: User = {
        Email: this.loginForm.controls.Email.value ?? '',
        Password: this.loginForm.controls.Password.value ?? '',
        KeepLogin: this.loginForm.controls.KeepLogin.value ?? false
      }

      var response: Auth;

      try{
         response = await this.dozedexService.VerifyUser(loggedUser);
      }
      catch{
        response = {     
          auth: false,
          token: "" 
        }
      }
      
      if(response.auth){
        this.router.navigate(['/home']);
      }
      else{
        alert("Verifique os dados e tente novamente");
      }
    }
    else{
      alert("Verifique os dados e tente novamente")
    }
    this.loading = false;
  }
}
