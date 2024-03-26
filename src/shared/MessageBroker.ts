import amqp, { Channel, Message } from "amqplib";

const createChannel = async (
  url: string,
  exchange: string,
  type: "direct" | "topic" | "headers" | "fanout" = "direct"
) => {
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, type);
    return channel;
  } catch (error) {
    throw error;
  }
};

const publishMessage = async (
  channel: Channel,
  exchange: string,
  bindingKey: string,
  message: MessagePayload
) => {
  try {
    channel.publish(
      exchange,
      bindingKey, //routes message to sepecific queue
      Buffer.from(JSON.stringify(message))
    );
  } catch (error) {
    throw error;
  }
};

const subscribeMessage = async (
  channel: Channel,
  exchange: string,
  bindingKey: string,
  queue: string,
  handler?: (data?: MessagePayload) => void
) => {
  try {
    const _queue = await channel.assertQueue(queue);
    channel.bindQueue(_queue.queue, exchange, bindingKey);
    console.log(
      " [*] Waiting for messages in %s. To exit press CTRL+C",
      _queue.queue
    );
    channel.consume(_queue.queue, (data) => {
      // console.log("Received data", data?.content.toString());
      handler?.(data ? JSON.parse(data?.content.toString()) : undefined);
      channel.ack(data as Message);
    });
  } catch (error) {
    throw error;
  }
};

export default {
  createChannel,
  publishMessage,
  subscribeMessage,
};

export interface MessagePayload {
  action: "GET" | "DELETE" | "POST" | "PUT";
  resource: string;
  from: {
    name: string;
    version: string;
    instanceId?: string;
  };
  to: {
    name: string;
    version: string;
    instanceId?: string;
  };
  data: Record<string, any>;
}
