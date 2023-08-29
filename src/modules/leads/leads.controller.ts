import { z } from "zod";
import clientsSchema from "./leads.schema";
import { RouteHandler } from "fastify";

const getAllLeads: RouteHandler<{
  Reply: z.TypeOf<typeof clientsSchema.getAllLeads.response>;
}> = async (req, res) => {
  try {
    const result = await req.server.client_amoCRM.request.get("/api/v4/leads");

    return res.status(200).send({
      success: true,
      data: result.data,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      data: "Error getting all users from AmoCRM",
    });
  }
};

const getOneLead: RouteHandler<{
  Params: z.TypeOf<typeof clientsSchema.getOneLead.params>;
  Reply: z.TypeOf<typeof clientsSchema.getOneLead.response>;
}> = async (req, res) => {
  const encodedName = req.params.name;
  const name = decodeURIComponent(encodedName);

  console.log("name :", name);
  try {
    const result = await req.server.client_amoCRM.request.get(
      `/api/v4/leads?filter[name]=${encodeURIComponent(name)}`,
      {
        "order[updated_at]": "desc",
        limit: 1,
      }
    );

    return res.status(200).send({
      success: true,
      data: result.data,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      data: "Error getting the user from AmoCRM",
    });
  }
};

const createLead: RouteHandler<{
  Body: z.TypeOf<typeof clientsSchema.createLead.body>;
  Reply: z.TypeOf<typeof clientsSchema.createLead.response>;
}> = async (req, res) => {
  try {
    const requestData = req.body;
    const result = await req.server.client_amoCRM.request.post(
      "/api/v4/leads/complex",
      requestData
    );

    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      data: "Error creating the user for AmoCRM",
    });
  }
};

const updateLead: RouteHandler<{
  Body: z.TypeOf<typeof clientsSchema.updateLead.body>;
  Reply: z.TypeOf<typeof clientsSchema.updateLead.response>;
}> = async (req, res) => {
  try {
    const requestData = req.body;
    const result = await req.server.client_amoCRM.request.patch(
      "/api/v4/leads",
      requestData
    );

    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      data: "Error updating the user in AmoCRM",
    });
  }
};

export default {
  getAllLeads,
  getOneLead,
  createLead,
  updateLead,
};
