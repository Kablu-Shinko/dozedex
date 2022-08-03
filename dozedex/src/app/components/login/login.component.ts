import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { Auth } from 'src/app/interfaces/auth.interface';
import { DozedexService } from 'src/app/services/dozedex.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'Login';
  user: User = {
    Email: "",
    ImageUrl: "",
    Name: "",
    Password: "",
    UserName: ""
  };

  constructor(private dozedexService: DozedexService) {
  }

  ngOnInit(): void {
  }

  async onSubmit(data:User){
    var teste: Auth =  await this.dozedexService.VerifyUser(data);
    if(teste.auth){
      alert("deveria logar")
    }
    else{
      alert("não deveria logar")
    }
  }
}
