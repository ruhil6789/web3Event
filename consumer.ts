import amqp from "amqplib";
import mongoose, { ConnectOptions } from "mongoose";
import userModel from "./src/models/userSchema";

const QUEUE_NAME = "biatch";

const consume = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@127.0.0.1:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    return new Promise((resolve) => {
      channel.consume(
        QUEUE_NAME,
        (events: any) => {
          const fetchedEvents = JSON.parse(events.content.toString());
          resolve(fetchedEvents);
        },
        { noAck: true }
      );
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const checkAndStore = async () => {
  let fetchedEvents: any = await consume();
  await connectDB();

  let dataLen: any = fetchedEvents.length;

  for (let i = 0; i < dataLen; i++) {
    let val = (Number(parseInt(fetchedEvents[i].args[2].hex, 16)))/1e18;
    
    if (val > 1000000) {
      await storeEvents(fetchedEvents[i].args[0], val);
    }

  }
};

const connectDB = async () => {
  const options: any = { useNewUrlParser: true, useUnifiedTopology: true };
  const url = "mongodb://localhost:27017/userData";
  mongoose
    .connect(url, options)
    .then((err: any) => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

const storeEvents = async (userAddresss: any, amount: any) => {
  await userModel.create({
    userAddress: userAddresss,
    userTransferAmount: amount,
  });
};
