import { router } from "@/lib/trpc";
import { bookAppointmentProcedure } from "./appointment/book";
import { findAppointmentProcedure } from "./appointment/find";
import { readAppointmentProcedure } from "./appointment/read";
import { searchAppointmentProcedure } from "./appointment/search";

export const appointmentSchedulingRoutes = router({
  bookAppointment: bookAppointmentProcedure,
  findAppointment: findAppointmentProcedure,
  readAppointment: readAppointmentProcedure,
  searchAppointment: searchAppointmentProcedure,
});
