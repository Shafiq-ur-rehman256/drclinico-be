import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class PatientSignUpDto{

    @IsNotEmpty()
    full_name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    cnic: string;

    @IsNotEmpty()
    phone_number: string;

    @IsNotEmpty()
    password: string;

}

export class PatientVerificationDto{

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp_code: string;

}

export class AuthenticatePatientDto{

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

}

export class SerializePatient {

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

    @Exclude()
    password: string

    constructor(
        partial: Partial<SerializePatient>
    ){
        return plainToClass(SerializePatient, partial, {excludeExtraneousValues: true})
    }
}