import { Breed } from "./breed.interface";
import { Item } from "./item.interface";
import { Skill } from "./skill.interface";
import { Attachment } from "./small-interfaces/small-interfaces";
import { Transformation } from "./transformation.interface";

export interface Character {
    Key?: number, //identifier
    Name: string,
    Age?: string,
    ImageUrl?: string,
    ImagePath?: string,
    Appearence?: string,
    Attachments?: Array<Attachment>,
    Breed?: Array<Breed>, //get those from keys
    Parents?: Array<Character>, //get those from keys
    Skills?: Array<Skill>, //get those from keys
    Transformations?: Array<Transformation>,//get those from keys
    Items?: Array<Item>,
    BreedKeys: Array<number>,
    ParentsKeys?: Array<number>,
    SkillsKeys?: Array<number>,
    TransformationKeys?: Array<number>, 
    ItemKeys?: Array<number>,
    ShortDescription: string,
    LongDescription?: string,
    Personality?: string,
    Height?: number,
    Weight?: number,
    HairColor?: string,
    LeftEyeColor?: string,
    RightEyeColor?: string,
    SkinColor?: string,
    Status?: Boolean
}