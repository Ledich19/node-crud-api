import { IncomingMessage } from "http";

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