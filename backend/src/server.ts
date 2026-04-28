import { app } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const start = async () => {
  await connectDb();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on http://localhost:${env.port}`);
  });
};

start();
