import { Body, Controller, Get, Inject, Param, Post, Request } from '@nestjs/common';
import { Request as request } from 'express';
import { ChatsService } from './chats.service';
import { DoctorSendMsgDto, PatientSendMsgDto } from './chats.dto';

@Controller('chats')
export class ChatsController {
    constructor(
        @Inject('CHAT-SERVICE') private readonly _chats: ChatsService 
    ){}

    // DOCTOR
    @Get('doctor/conversations')
    getAllConversationForDoctor(@Request() req: request){
        return this._chats.getAllConversationForDoctor(req);
    }

    @Post('doctor/sendMessage')
    doctorSendMessage(@Body() body: DoctorSendMsgDto, @Request() req:request){
        return this._chats.doctorSendMessage(body, req);
    }

    @Get('doctor/chat/:patient_id')
    getAllChatsOfPatient(@Param('patient_id') patient_id: string, @Request() req: request){
        return this._chats.getAllChatsOfPatient(patient_id, req);
    }

    // PATIENT
    @Get('patient/conversations')
    getAllConversationForPatient(@Request() req: request){
        return this._chats.getAllConversationForPatient(req);
    }

    @Post('patient/sendMessage')
    patientSendMessage(@Body() body: PatientSendMsgDto, @Request() req:request){
        return this._chats.patientSendMessage(body, req);
    }

    @Get('patient/chat/:doctor_id')
    getAllChatsOfDoctor(@Param('doctor_id') doctor_id: string, @Request() req: request){
        return this._chats.getAllChatsOfDoctor(doctor_id, req)
    }
}
