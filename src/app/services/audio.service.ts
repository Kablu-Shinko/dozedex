import { Injectable, OnInit } from '@angular/core';
import { DozedexService } from './dozedex.service';

@Injectable({
    providedIn: 'root'
})

export class AudioService{

    soundEnabled: boolean = this.dozedexService.EnabledSystemSounds();

    constructor(
        private dozedexService: DozedexService
    ){
    }

    private PlayAudio(audio: HTMLAudioElement){
        if(this.soundEnabled) audio.play();
    }



    ChangeItem(): void{
        let audio: HTMLAudioElement = new Audio("./assets/songs/change-selected-item/arrow-whoosh.wav");
        this.PlayAudio(audio);
    }

    SelectItem(): void{
        let audio: HTMLAudioElement = new Audio("./assets/songs/click-on-item/click-on-item.mp3");
        this.PlayAudio(audio);
    }

    LoginSuccess(): void{
        let audio: HTMLAudioElement = new Audio("./assets/songs/login-success/login-success.mp3");
        this.PlayAudio(audio);
    }

    GetLoginSuccess(): HTMLAudioElement {
        let audio: HTMLAudioElement = new Audio("./assets/songs/login-success/login-success.mp3");
        return audio;
    }

    TurnedOn(): void{
        let audio: HTMLAudioElement = new Audio("./assets/songs/turned-on/turned-on.mp3");
        this.PlayAudio(audio);
    }

    EnableSound(): void{
        this.dozedexService.EnableSystemSounds();
        this.soundEnabled = this.dozedexService.EnabledSystemSounds();

        if(this.soundEnabled) {
            this.SelectItem();
            alert("sons do sistema foram ativados")
        }
        else{
            alert("sons do sistema foram desativados");
        } 
    }
}