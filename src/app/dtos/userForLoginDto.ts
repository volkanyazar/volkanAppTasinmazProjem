import { IDto } from "../ents/abstracts/IDto";

export class UserForLoginDto implements IDto{
    email:string;
    password:string;
    
}