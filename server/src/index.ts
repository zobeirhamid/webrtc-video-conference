import { createServer } from "http";
import { createApplication } from "./app";

const httpServer = createServer();

createApplication(httpServer, {
  cors: {
    origin: ["https://zobeirhamid.github.io", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const port: number = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(port);
