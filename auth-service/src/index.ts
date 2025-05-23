import { createServer } from "./server";
import * as fs from "node:fs";
import * as https from "node:https";
import * as http from "node:http";
const path = require("path");

// Paths to SSL certificate files
const keyPath = path.resolve(__dirname, "../key.pem");
const certPath = path.resolve(__dirname, "../cert.pem");

const app = createServer();

// Define ports
const HTTP_PORT = 80; // HTTP port for redirection
const HTTPS_PORT = 443; // HTTPS port

if (process.env.NODE_ENV !== "production") {
  // Development mode: Use HTTP
  app.listen(3000, () => {
    console.log(`Development server running on http://localhost:3000`);
  });
} else {
  // Production mode: Use HTTPS
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  // Start HTTPS server
  https.createServer(options, app).listen(3010, () => {
    console.log(`Production server running on https://localhost:3000`);
  });

  // Redirect HTTP to HTTPS
  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://node32.cs.colman.ac.il${req.url}`,
      });
      res.end();
    })
    .listen(HTTP_PORT, () => {
      console.log(
        `HTTP redirection server running on http://node32.cs.colman.ac.il`
      );
    });
}
