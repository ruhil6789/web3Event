import { Request, Response } from "express";
import { ethers } from "ethers";
import erc20ABI from "../abi/ERC20.json";
import dotenv from "dotenv";
import amqp from "amqplib";
import mongoose from "mongoose";
import { checkAndStore } from "../../consumer";
dotenv.config();

const QUEUE_NAME = "biatch";
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC || "");
let EVENTS;

export const fetchEvents = async () => {
  let contract = new ethers.Contract(process.env.USDT_ADDRESS || "", erc20ABI, provider);
  let eventFilter = contract?.filters?.Transfer();
  let events = await contract?.queryFilter(eventFilter);
  EVENTS = events;
  await feedToRabbitMQ(EVENTS);
  try {
    await checkAndStore();
  } catch (error) {
    console.log(error);
  }
};

const feedToRabbitMQ = async (res: any) => {
  try {
    let connection = await amqp.connect("amqp://guest:guest@127.0.0.1:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(res)));
  } catch (error) {
    console.log(error);
  }
};

const connectDB = async () => {
  let options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  };
  const connect = await mongoose.connect(
    "mongodb://localhost:27017/usersdb",
    options
  );
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });
  mongoose.set("strictQuery", false);
};