import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, Min, MinLength } from "class-validator";


export class AssignPrescriptionDto{

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    doctor_id: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    patient_id: number;

    @IsArray()
    @Type(() => PrescriptionDetail)
    prescription_detail: PrescriptionDetail[];

}

class PrescriptionDetail {

    @IsNotEmpty()
    medicine_name: string;

    @IsNotEmpty()
    time: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    number_of_doze: number;


}