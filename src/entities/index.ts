import { Donations } from "./Donations.entity";
import { Appointments } from "./appointment.entity";
import { Chats } from "./chats.entity";
import { Conversations } from "./conversation.entity";
import { DoctorAvailableSlots } from "./doctorAvailableSlots.entity";
import { Doctors } from "./doctors.entity";
import { Logs } from "./logs.entity";
import { Notifications } from "./notification.entity";
import { Patients } from "./patients.entity";
import { Prescription } from "./prescription.entity";
import { PrescriptionDetail } from "./prescriptionDetail.eneitiy";

const entities = [Doctors, Patients, Chats, Notifications, Appointments, Donations, Logs, DoctorAvailableSlots, Conversations, Prescription, PrescriptionDetail]

export default entities;