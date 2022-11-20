import { Character } from "./character.interface"

export interface Guild{
    Key?: number,
    Name: string,
    Initials?: string,
    ShortDescription: string,
    LongDescription?: string,
    CharacterKeys?: number[],
    Characters?: Character[],
    ImageUrl?: string,
    ImagePath?: string,
    Status?: boolean 
}