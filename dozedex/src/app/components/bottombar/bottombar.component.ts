import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bottombar',
  templateUrl: './bottombar.component.html',
  styleUrls: ['./bottombar.component.css']
})
export class BottombarComponent implements OnInit {

  constructor(
    private userService: UserService,
    private imageService: ImageService
  ) { }

  user: User = this.userService.GetActualUser();
  friend: User = {Email:"", KeepLogin:false, Password: ""}

  async ngOnInit(): Promise<void> {
    this.getFriend();
  }

  verifyAccount(): string{
    return this.user.UserName === "Kabu" ? "outroluis777@gmail.com" : "luanchrystian2@gmail.com";
  }

  async getFriend(){
    this.friend = await this.userService.GetUserByEmail(this.verifyAccount());
    this.friend.ImagePath = this.imageService.GetFullImageURL(this.friend.ImageUrl ?? "");
  }

  mensagem(){
    var aleatorio:number = Number((Math.random() * (Math.random() * 100)).toFixed(0));

    if(aleatorio > 0 && aleatorio <= 10){
      alert("nah")
    }

    if(aleatorio > 10 && aleatorio <= 20){
      alert("nop")
    }

    if(aleatorio > 20 && aleatorio <= 30){
      alert("naaaa noup")
    }

    if(aleatorio > 30 && aleatorio <= 40){
      alert("*bocejos*")
    }

    if(aleatorio> 40 && aleatorio <= 50){
      alert("alixia: eu não faria isso se fosse voce")
    }

    if(aleatorio > 50){
      alert("'----'")
    }
  }
}
