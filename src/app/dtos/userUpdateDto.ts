import { IDto } from "../ents/abstracts/IDto";

export class UserUpdateDto implements IDto{
    userId:number;
    firstName:string;
    lastName:string;
    email:string;
    activePassword:string;
    newPassword:string;
}