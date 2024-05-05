import { Exclude, Expose, plainToClass, Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsNumber, Min, MinLength, ValidateNested } from "class-validator";


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

class Slot {

    @IsNotEmpty()
    day_name: string;

    start: string;

    end: string;

}
export class AvailableSlotsDto{

    @IsNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => Slot)
    slots: Slot[];

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