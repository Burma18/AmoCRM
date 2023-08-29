import { FastifyInstance } from "fastify";
import clientsSchema from "./leads.schema";
import clientsController from "./leads.controller";

export default async function leads(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: clientsSchema.getAllLeadsSchema,
    },
    clientsController.getAllLeads
  );

  app.get(
    `/:name`,
    {
      schema: clientsSchema.getOneLeadSchema,
    },
    clientsController.getOneLead
  );

  app.post(
    "/",
    {
      schema: clientsSchema.createLeadSchema,
    },
    clientsController.createLead
  );

  app.patch(
    "/",
    {
      schema: clientsSchema.updateLeadSchema,
    },
    clientsController.updateLead
  );
}
