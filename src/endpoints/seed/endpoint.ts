import type { Endpoint } from "payload";

import { seed } from ".";

// Mounted at POST /api/seed; used by the seed button on the admin dashboard
export const seedEndpoint: Endpoint = {
  path: "/seed",
  method: "post",
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: "Action forbidden." }, { status: 403 });
    }

    try {
      await seed({ payload: req.payload, req });

      return Response.json({ success: true });
    } catch (err) {
      req.payload.logger.error({ err, msg: "Error seeding data" });
      return Response.json({ error: "Error seeding data." }, { status: 500 });
    }
  },
};
