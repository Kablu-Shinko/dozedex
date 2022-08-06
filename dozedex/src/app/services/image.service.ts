import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ImageService{
    private NotFoundImageURL = "https://cdn.glitch.com/0e4d1ff3-5897-47c5-9711-d026c01539b8%2Fbddfd6e4434f42662b009295c9bab86e.gif?v=1573157191712"; 

    ValidImage(url: string): number{
        if(url.indexOf("/d/") !== -1 && url.indexOf("/view") !== -1){
            return 1;
        }
        else if(url.indexOf("https://") !== -1){
            return 2;
        }
        else{
            return 404;
        }
    }

    GetImageID(url: string): string{
        let index: number = url.indexOf("/d/");
        let lastIndex: number = url.indexOf("/view");

        if(this.ValidImage(url)){
          let result: string = url.substring(index + 3, lastIndex);
          return result;
        }
        else{
            return "";
        }
    }

    GetFullImageURL(url: string): string {
        var validImage: number = this.ValidImage(url);

        switch(validImage){
            case 1:
                let imageID: string = this.GetImageID(url);
                return `https://drive.google.com/uc?export=view&id=${imageID}`;
            case 2:
                return url;
            default:
                return this.NotFoundImageURL;
        }
    }
}