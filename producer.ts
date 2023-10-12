import * as amqp from 'amqplib/callback_api';

const QUEUE_NAME = 'hello';

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const msg = 'Hello, World!';

    channel.assertQueue(QUEUE_NAME, {
      durable: false,
    });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(msg));

    console.log(`[x] Sent '${msg}'`);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
