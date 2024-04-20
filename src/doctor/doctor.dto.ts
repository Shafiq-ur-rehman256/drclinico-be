import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";


export class signupDto{

    @IsNotEmpty()
    full_name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    phone_number: string;

    @IsNotEmpty()
    cnic: string;

    @IsNotEmpty()
    license_number: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    specialization: string;

    
}

export class UpdateDocProfileDto{

    @IsNotEmpty()
    @Min(1)
    @IsNumber()
    doctor_id: number;
    
    @IsNotEmpty()
    about_me: string;

    @IsNotEmpty()
    available_start: Date;

    @IsNotEmpty()
    available_end: Date;

}

export class authenticateDto{

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

}


export class VerifyOtpDto{

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp_code: string

}

export class SerializeDoctor {

    @Expose()
    full_name: string;

    @Expose()
    email: string;

    @Expose()
    id: number;

    @Expose()
    phone_number: string;

    @Expose()
    cnic: string;

    @Expose()
    license_number: string;

    @Expose()
    specialization: string;

    @Exclude()
    password: string

    constructor(
        partial: Partial<SerializeDoctor>
    ){
        return plainToClass(SerializeDoctor, partial, {excludeExtraneousValues: true})
    }
}