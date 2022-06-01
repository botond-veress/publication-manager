import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { UnauthorizedError } from '../errors';

export const ensureBasicAuth = async (event: APIGatewayProxyEventV2, credentials: string) => {
  if (event.headers?.['authorization'] === `Basic ${credentials}`) return;

  throw new UnauthorizedError();
};
