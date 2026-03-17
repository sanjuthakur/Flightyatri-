import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  // Log startup metadata for deploy diagnostics.
  console.log(`FlightYatri API running on port ${env.PORT} (${env.NODE_ENV})`);
});

