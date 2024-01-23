import { Response } from "express";
import { UserRequest } from "../shared/types";
import fs from "fs";
import config from "config";
import axios from "axios";
import path from "path/posix";
import logger from "../shared/logger";

export function parseMessage(object: any, template: string) {
  // regular expression to match placeholders like {{field}}
  const placeholderRegex = /{{(.*?)}}/g;

  // Use a replace function to replace placeholders with corresponding values
  const parsedMessage = template.replace(
    placeholderRegex,
    (match, fieldName) => {
      // The fieldName variable contains the field name inside the placeholder
      // Check if the field exists in the event object
      if (object.hasOwnProperty(fieldName)) {
        return object[fieldName]; // Replace with the field's value
      } else {
        // Placeholder not found in event, leave it unchanged
        return match;
      }
    }
  );

  return parsedMessage;
}

export function isValidURL(url: string): boolean {
  try {
    // Attempt to create a URL object
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export const registry = (
  registryBaseUrl: string,
  serviceName: string,
  serviceVersion: string,
  servicePort: number
) => ({
  register: async () => {
    try {
      await axios.put(
        `${registryBaseUrl}/register/${serviceName}/${serviceVersion}/${servicePort}`
      );
    } catch (error) {
      logger.error(error);
    }
  },
  unregister: async () => {
    try {
      const response = await axios.delete(
        `${registryBaseUrl}/register/${serviceName}/${serviceVersion}/${servicePort}`
      );
    } catch (error) {
      logger.error(error);
    }
  },
});
