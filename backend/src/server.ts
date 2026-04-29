import { app } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const start = async () => {
  await connectDb();

  const PORT = process.env.PORT || env.port || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Working ✅" });
});
};
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Working ✅" });
});

start();


