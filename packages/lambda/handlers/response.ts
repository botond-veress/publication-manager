import { APIGatewayProxyResult } from 'aws-lambda';

export const createJsonResponse = (result: APIGatewayProxyResult) => ({
  ...result,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    ...result.headers
  }
});

export const createSuccessResponse = <T>(data: T) =>
  createJsonResponse({
    statusCode: data ? 200 : 204,
    body: data ? JSON.stringify(data) : ''
  });
