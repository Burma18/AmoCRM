import { FastifyInstance } from "fastify";
import { Client } from "amocrm-js";
import fp from "fastify-plugin";

interface tokenType {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface tokenConvertType {
  tokenType: string;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const amoCRM = async (app: FastifyInstance) => {
  // ! config amoCRM
  const client_amoCRM = new Client({
    domain: "https://burmawedevxco.kommo.com",
    auth: {
      client_id: "637ac1c5-2e20-41fe-942f-64e94ef1df2d",
      client_secret:
        "9MC6baLOk8YB8qMUo9rg3DIDpzWKl1QkYEbqmxan2mX1cgisWi0e4PPZO81mRnXd",
      redirect_uri: "https://wedevx.co",
      code: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjgzYmFmZjViMjBmYjEyNThlYmI2NDU1YWJjNjE4MWFkMTc5MDJlMzk3OTYzNjhmN2EzNDdlMmY1MWNlNmUyYTc0MTMzZmI0YjRiZmMxYmY5In0.eyJhdWQiOiI2MzdhYzFjNS0yZTIwLTQxZmUtOTQyZi02NGU5NGVmMWRmMmQiLCJqdGkiOiI4M2JhZmY1YjIwZmIxMjU4ZWJiNjQ1NWFiYzYxODFhZDE3OTAyZTM5Nzk2MzY4ZjdhMzQ3ZTJmNTFjZTZlMmE3NDEzM2ZiNGI0YmZjMWJmOSIsImlhdCI6MTY5MzMxMzc5NCwibmJmIjoxNjkzMzEzNzk0LCJleHAiOjE2OTM0MDAxOTQsInN1YiI6IjEwMDI5MzgzIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNjQwNzg3LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOiJ2MiIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.i9vrPDhNXy2bxUQI2jllVJKNMSu0xYm-hQAV7HLkT5hNHrudOLYWgdP6d3oeRabj2Wahi_oTE_VA1mgjkNrH5DZfZYSucMtvAtzH0RMR3kSqOuofnnmdkCW0usmOmyZAASklFEM-9zIDzh4a7DwWOlba_MwWBLJNo0zM28PY76aLWCKkPkO7lMPltOfRU50aLZPLyNlCh3dhrDbwDGrqyPSyhPsDT4srgIuehqWcOwNTnspM-xUOTJxL1KrCxuT9z29VJMDa43U4TyLS_bbPnoQzQECzO9QnxK42ltT2-kzs3diIIsfntrugvHxGmWAUqVTGm34V-z2cp0wsbTn6FQ",
    },
  });

  // ! forced token update (if there were no requests earlier)
  const updateConnection = async () => {
    if (!client_amoCRM.connection.isTokenExpired()) {
      return;
    } else {
      await client_amoCRM.connection.update();
    }
  };

  // ! save token
  let renewTimeout: NodeJS.Timeout;
  // If "change" detects any modifications in the "token," it will update the token in Supabase
  client_amoCRM.token.on("change", async () => {
    const token: tokenType = client_amoCRM.token.getValue() as tokenType;
    const tokenConvert: tokenConvertType = {
      tokenType: token.token_type,
      expiresIn: token.expires_in,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: token.expires_at,
    } as tokenConvertType;

    try {
      const existingData = await app.prisma.amoCRM.findUnique({
        where: { id: 1 },
      });
      if (existingData) {
        await app.prisma.amoCRM.update({
          where: { id: 1 },
          data: tokenConvert,
        });
      } else {
        await app.prisma.amoCRM.create({
          data: tokenConvert,
        });
      }
    } catch (error) {
      console.log(error);
    }

    // token renewal upon expiration
    const expiresIn = (token?.expires_in ?? 0) * 1000;
    clearTimeout(renewTimeout);
    renewTimeout = setTimeout(updateConnection, expiresIn);
  });

  // ! get token
  try {
    const data = await app.prisma.amoCRM.findUnique({ where: { id: 1 } });
    if (data) {
      // Convert Decimal to number
      const tokenData: tokenType = {
        token_type: data.tokenType,
        expires_in: +data.expiresIn,
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        expires_at: +data.expiresAt,
      } as tokenType;

      client_amoCRM.token.setValue(tokenData);
    } else {
      console.log("The token does not exist!");
    }
  } catch (error) {
    console.log(`${error}`);
  }

  // ! connect to amoCRM
  try {
    console.log("Connecting to amoCRM...");
    const status = await client_amoCRM.connection.connect();
    console.log({ status });
    console.log("Successfully connected 🦄");
  } catch (err) {
    console.log(`${err}`);
  }

  app.decorate("client_amoCRM", client_amoCRM);
};

export default fp(amoCRM);
