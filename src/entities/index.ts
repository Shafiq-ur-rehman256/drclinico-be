import { Donations } from "./Donations.entity";
import { Appointments } from "./appointment.entity";
import { Chats } from "./chats.entity";
import { DoctorAvailableSlots } from "./doctorAvailableSlots.entity";
import { DoctorProfile } from "./doctorProfile.entity";
import { Doctors } from "./doctors.entity";
import { Logs } from "./logs.entity";
import { Notifications } from "./notification.entity";
import { Patients } from "./patients.entity";

const entities = [Doctors, Patients, Chats, Notifications, Appointments, Donations, Logs, DoctorProfile, DoctorAvailableSlots]

export default entities;