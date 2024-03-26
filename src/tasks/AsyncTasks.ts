import logger from "../shared/logger";
import MessageBroker from "../shared/MessageBroker";
import { configuration, messageBroker } from "../utils";

class AsyncTasks {
  async deleteFileAsync(ids: any[]) {
    try {
      console.log("PUBLISHING ROLLBACK MESSAGE");

      const channel = await MessageBroker.createChannel(
        messageBroker.url,
        messageBroker.exchanges.hive.name,
        "direct"
      );

      MessageBroker.publishMessage(
        channel,
        messageBroker.exchanges.hive.name,
        "hive-files-service:1.0.0",
        {
          action: "DELETE",
          from: {
            name: configuration.name,
            version: configuration.version,
          },
          resource: "file-upload",
          to: {
            name: "hive-files-service:1.0.0",
            version: "1.0.0",
          },
          data: {
            _ids: ids,
          },
        }
      );

      channel.close();
    } catch (error) {
      logger.error("ERROR PUBLISHING ROLLBACK: " + error);
    }
  }
}

export default AsyncTasks;
