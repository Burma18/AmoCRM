import { FastifyInstance } from "fastify";
import exercisesControllers from "../controllers/exercises.controllers";
import controller from "../controllers/controller";
import smscontrollers from "../modules/sendSms/sendSms";
import leads from "../modules/leads/leads.routes";

const routes = async (app: FastifyInstance) => {
  // app.register(leads, {
  //   prefix: "/",
  // });

  app.get("/:name", controller.getByQuery);
  app.get("/getAll", controller.get);
  app.post("/api/v1/send-sms", smscontrollers.sendSmsCodeVerify);
  app.post("/api/v1/submissions", exercisesControllers.createSubmission);
};

export default routes;
