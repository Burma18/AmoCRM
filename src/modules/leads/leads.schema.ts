import { z } from "zod";
import { generateSchema } from "@anatine/zod-openapi";

const getAllLeads = {
  response: z.union([
    z.object({
      success: z.literal(true),
      data: z.unknown(),
    }),
    z.object({
      success: z.literal(false),
      data: z.string(),
    }),
  ]),
};

const getAllLeadsSchema = {
  response: {
    200: generateSchema(getAllLeads.response),
    500: generateSchema(getAllLeads.response),
  },
};

const getOneLead = {
  params: z.object({
    name: z.string(),
  }),
  response: z.union([
    z.object({
      success: z.literal(true),
      data: z.unknown(),
    }),
    z.object({
      success: z.literal(false),
      data: z.string(),
    }),
  ]),
};

const getOneLeadSchema = {
  params: generateSchema(getOneLead.params),
  response: {
    200: generateSchema(getOneLead.response),
    500: generateSchema(getOneLead.response),
  },
};

// {
//     "user": {
//         "firstName": "Elkhan",
//         "lastName": "Sharshenbekov",
//         "email": "boss.armsport@gmail.com"
//     },
//     "phone": "+996990385056",
//     "traffic": "TikTok"
// }

const createLead = {
  body: z.object({
    user: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
    }),
    phone: z.string(),
    traffic: z.string().optional(),
  }),
  response: z.union([
    z.object({
      success: z.literal(true),
      data: z.unknown(),
    }),
    z.object({
      success: z.literal(false),
      data: z.string(),
    }),
  ]),
};

const createLeadSchema = {
  body: generateSchema(createLead.body),
  response: {
    200: generateSchema(createLead.response),
    500: generateSchema(createLead.response),
  },
};

const updateLead = {
  body: z.object({
    user: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
    }),
    phone: z.string(),
    traffic: z.string().optional(),
  }),
  response: z.union([
    z.object({
      success: z.literal(true),
      data: z.unknown(),
    }),
    z.object({
      success: z.literal(false),
      data: z.string(),
    }),
  ]),
};

const updateLeadSchema = {
  body: generateSchema(updateLead.body),
  response: {
    200: generateSchema(updateLead.response),
    500: generateSchema(updateLead.response),
  },
};

export default {
  getAllLeads,
  getAllLeadsSchema,
  getOneLead,
  getOneLeadSchema,
  createLead,
  createLeadSchema,
  updateLead,
  updateLeadSchema,
};
