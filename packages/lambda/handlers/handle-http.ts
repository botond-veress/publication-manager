import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyHandlerV2WithLambdaAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { EventHandler, handleEvent } from "./handle-event";
import { handleError } from "./handle-error";
import { createSuccessResponse, createJsonResponse } from "./response";

export const handleHttp = <E = APIGatewayProxyEventV2>(
  callback: EventHandler<E, unknown>
): EventHandler<E, APIGatewayProxyStructuredResultV2> => {
  return handleEvent(async (event, context) => {
    return Promise.resolve()
      .then(() => callback(event, context))
      .then(createSuccessResponse)
      .catch((error) => {
        const handledError = handleError(error);

        return createJsonResponse({
          statusCode: handledError.statusCode,
          body: JSON.stringify(handledError.serialize()),
        });
      });
  });
};

export const handleAuthorizedHttp = <T>(
  callback: EventHandler<
    APIGatewayProxyEventV2WithLambdaAuthorizer<T | undefined>,
    unknown
  >
): APIGatewayProxyHandlerV2WithLambdaAuthorizer<T | undefined> => {
  return handleHttp(callback);
};
