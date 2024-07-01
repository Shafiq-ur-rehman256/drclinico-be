import { IsBoolean, IsNotEmpty } from "class-validator";


export class DoctorSendMsgDto{

    message: string;

    attachment: string;

    @IsNotEmpty()
    message_type: string;

    @IsNotEmpty()
    @IsBoolean()
    message_from_doctor: Boolean;

    @IsNotEmpty()
    appointment_id: number;

    @IsNotEmpty()
    doc_id: number;

    @IsNotEmpty()
    pat_id: number;

    @IsNotEmpty()
    conversation_id: number;

}

export class PatientSendMsgDto{

    message: string;

    attachment: string;

    @IsNotEmpty()
    message_type: string;

    @IsNotEmpty()
    @IsBoolean()
    message_from_doctor: Boolean;

    @IsNotEmpty()
    appointment_id: number;

    @IsNotEmpty()
    doc_id: number;

    @IsNotEmpty()
    pat_id: number;

    @IsNotEmpty()
    conversation_id: number;

}