import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    public NotFoundImageURL: string = "assets/defaults/images/not%20found/default.gif";
    public DefaultSkillImageURI: string = "assets/defaults/images/skill/default.gif";
    public DefaultBreedImageURI: string = "assets/defaults/images/breed/default.png";

    ValidImage(url: string): number {
        if (url.indexOf("/d/") !== -1 && url.indexOf("/view") !== -1) {
            return 1;
        }
        else if (url.indexOf("default_skill_image") !== -1) {
            return 2;
        }
        else if (url.indexOf("https://") !== -1) {
            return 3;
        }
        else {
            return 404;
        }
    }

    GetImageID(url: string): string {
        let index: number = url.indexOf("/d/");
        let lastIndex: number = url.indexOf("/view");

        if (this.ValidImage(url)) {
            let result: string = url.substring(index + 3, lastIndex);
            return result;
        }
        else {
            return "";
        }
    }

    GetFullImageURL(url: string): string {
        var validImage: number = this.ValidImage(url);

        switch (validImage) {
            case 1:
                let imageID: string = this.GetImageID(url);
                return `https://drive.google.com/uc?export=view&id=${imageID}`;
            case 2:
                return this.DefaultSkillImageURI;
            case 3:
                return url;
            default:
                return this.NotFoundImageURL;
        }
    }
}