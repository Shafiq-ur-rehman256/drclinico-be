import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from 'src/entities/doctors.entity';
import { ResponseService } from 'src/shared/services/response/response.service';
import { IsNull, Repository } from 'typeorm';
import { SerializeDoctor, UpdateDocProfileDto, VerifyOtpDto, authenticateDto, signupDto } from './doctor.dto';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import * as rsg from 'randomstring';
import { MailService } from 'src/mail/mail.service';
import { DoctorProfile } from 'src/entities/doctorProfile.entity';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(Doctors) private _doctorRepo: Repository<Doctors>,
        @InjectRepository(DoctorProfile) private _doctorProfileRepo: Repository<DoctorProfile>,
        @Inject('RES-SERVICE') private _res: ResponseService,
        @Inject('JWT-SERVICE') private _jwt: JwtService,
        @Inject('MAILER-SERVICE') private _mailer: MailService,
    ) { }

    async doctorSignup(body: signupDto, req: Request) {
        try {

            const { full_name, email, cnic, license_number, password, phone_number, specialization } = body;
            const findDoctor = await this._doctorRepo.findOne({
                where: [
                    { deleted_at: IsNull(), email: email },
                    { deleted_at: IsNull(), cnic: cnic },
                    { deleted_at: IsNull(), license_number: license_number },
                ]
            })

            if (findDoctor) {
                throw new HttpException("Doctor already created with these details!", HttpStatus.BAD_REQUEST);
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // generate OTP
            const otpCode = rsg.generate({
                length: 5
            })

            // set otp expiry
            const otpExpiry: any = new Date();
            otpExpiry.setSeconds(otpExpiry.getSeconds() + 300); // Set expiration time 5 minutes from now

            // send otp to doctor
            await this._mailer.sendOtpToDoc({ to: email , otp_code: otpCode})

            const DOCTOR = {
                full_name,
                email,
                cnic,
                license_number,
                password: hashPassword,
                phone_number,
                specialization,
                otp_expiry: otpExpiry,
                otp_code: otpCode
            }

            const createDoc = this._doctorRepo.create(DOCTOR);
            await this._doctorRepo.save(createDoc);

            return this._res.generateRes(HttpStatus.OK, [], "Sign up sucessfull", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async updateDoctorProfile(body: UpdateDocProfileDto, req: Request){
        try {
            
            const { doctor_id, about_me, available_end, available_start } = body;

            const doctor = await this._doctorRepo.findOne({
                where: {
                    id: doctor_id,
                    account_verified: true
                },
                relations: {
                    profile: true
                }
            })

            if (!doctor.profile) {
                
                const profile = this._doctorProfileRepo.create({
                    about_me: about_me,
                    available_end: available_end,
                    available_start: available_start
                })

                await this._doctorProfileRepo.save(profile);

                await this._doctorRepo.createQueryBuilder()
                .update()
                .set({
                    profile: profile
                })
                .where("id = :id", {id: doctor_id})
                .execute()

                const data = {
                    about_me,
                    available_end,
                    available_start
                }
                return this._res.generateRes(HttpStatus.OK, data, "Profile updated", req);

            }else{

                await this._doctorProfileRepo.createQueryBuilder()
                .update()
                .set({
                    about_me: about_me,
                    available_end: available_end,
                    available_start: available_start
                })
                .where("id = :id", {id: doctor.profile.id})
                .execute()

                const data = {
                    about_me,
                    available_end,
                    available_start
                }
                return this._res.generateRes(HttpStatus.OK, data, "Profile updated", req);
            }

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async doctorAuthenticate(body: authenticateDto, req: Request) {
        try {
            console.log(body);
            const { email, password } = body;

            const findOne = await this._doctorRepo.findOne({
                where: {
                    email: email,
                    account_verified: true,
                    email_verified: true,
                    deleted_at: IsNull()
                }
            })
            console.log(findOne);
            if (!findOne) {
                throw new HttpException("Invalid email provided!", HttpStatus.BAD_REQUEST)
            }

            const { password:EncryptedPass } = findOne;

            // match password
            const isMatch = await bcrypt.compare(password, EncryptedPass);
            if(!isMatch){
                throw new HttpException("Invalid email or password!", HttpStatus.BAD_REQUEST)
            }

            // create auth token
            const payload = {
                id: findOne.id,
                email: findOne.email
            }
            const token = await this._jwt.generateToken(payload);

            await this._doctorRepo.createQueryBuilder()
            .update()
            .set({
                auth_token: token,
                status: 'ONLINE'
            })
            .where("id = :id", {id: findOne.id})
            .execute()
            
            const serializeDoctor = new SerializeDoctor(findOne)

            const data = {
                ...serializeDoctor,
                auth_token: token
            }

            console.log(data);

            return this._res.generateRes(HttpStatus.OK, data, "Doctor authenticate sucessfully!", req)

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async verifyDoctorOtp(body: VerifyOtpDto, req: Request){
        try {
            
            const { email } = body;

            const findOne = await this._doctorRepo.findOne({
                where: {
                    deleted_at: IsNull(),
                    email: email
                }
            })

            if(!findOne){
                throw new HttpException("Invalid email provided!", HttpStatus.BAD_REQUEST);
            }

            const { otp_code, otp_expiry } = findOne;

            if( otp_code != body.otp_code || new Date(otp_expiry) < new Date()){
                throw new HttpException("OTP expired or invalid otp provided!", HttpStatus.BAD_REQUEST)
            }

            await this._doctorRepo.createQueryBuilder()
            .update()
            .set({
                email_verified: true
            })
            .where("id =:id", {id: findOne.id})
            .execute()

            return this._res.generateRes(HttpStatus.OK, [], "OTP VERIFIED", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async getAllActiveDoctorList(req: Request){
        try {
            
            const activeDoctorList = await this._doctorRepo.find({
                where: {
                    account_verified: true,
                    status: 'ONLINE'
                },
                select: {
                    id: true,
                    full_name: true,
                    specialization: true,
                    status: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, activeDoctorList, "Active Doctor List", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }
}
