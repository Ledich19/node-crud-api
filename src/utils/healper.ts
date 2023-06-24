import { IncomingMessage } from "http";

export const isUUID = (value: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(value);
};

export const getDataFromRequest = (request: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    let requestData = '';

    request.on('data', (chunk) => {
      requestData += chunk;
    });

    request.on('end', () => {
      resolve(requestData);
    });

    request.on('error', (error) => {
      reject(error);
    });
  });
};