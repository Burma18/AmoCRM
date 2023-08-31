import { FastifyInstance } from "fastify";
import exercisesControllers from "../controllers/exercises.controllers";
import controller from "../controllers/controller";
import otherControllers from "../controllers/other.controllers";

const routes = async (app: FastifyInstance) => {
  app.get("/:name", controller.getByQuery);
  app.get("/getAll", controller.get);
  app.post("/api/v1/send-sms", otherControllers.sendSmsCodeVerify);
  app.post("/api/v1/submissions", exercisesControllers.createSubmission);
};

export default routes;
