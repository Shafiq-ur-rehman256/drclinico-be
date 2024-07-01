import { IsNotEmpty, IsNumber, Min } from "class-validator";


export class BookAppointmentDto{

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    patient_id: number;


    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    doctor_id: number;

    @IsNotEmpty()
    selected_slot_time: string;

    @IsNotEmpty()
    scheduled_date: string;
}

export class StartAppointmentDto{

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    appointment_id: number;
    
}