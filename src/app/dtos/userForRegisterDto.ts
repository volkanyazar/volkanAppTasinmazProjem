import { IDto } from "../ents/abstracts/IDto";

export class UserForRegisterDto implements IDto{
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    role:string;
    adres:string;

}