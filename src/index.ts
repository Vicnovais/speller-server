import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import { initHttpLogger } from "./framework/middlewares/MorganMiddleware";
import Logger from "./framework/logger";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { Server } from "socket.io";
import { createServer } from "node:http";

global.__basedir = __dirname;

const initServer = async () => {
  const app = express();
  initHttpLogger(app);

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  const serialPort = new SerialPort({
    path: "COM5",
    baudRate: 115200,
  });

  serialPort.on("open", () => {
    console.log("Serial port opened at 115200 baud.");
  });

  serialPort.on("error", (err) => {
    console.error("Serial Port Error:", err);
  });

  SerialPort.list().then(
    (ports) => ports.forEach((port) => console.log(port.path)),
    (err) => console.error(err)
  );

  const parser = serialPort.pipe(new ReadlineParser());

  parser.on("data", (data) => {
    console.log(data);
    io.emit("serial:data", data);
  });

  process.on("uncaughtException", (error) => {
    Logger.error(error);
  });

  process.on("unhandledRejection", (error) => {
    Logger.error(error);
  });

  io.on("connection", () => {
    Logger.info("User connected");
  });

  const port = 3001;
  server.listen(port, () => {
    Logger.info(`Now listening on port ${port}`);
  });
};

initServer();
