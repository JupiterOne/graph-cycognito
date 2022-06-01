import { URL, URLSearchParams } from 'url';
import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { AssetData, AssetType, Issue } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

class ResponseError extends IntegrationProviderAPIError {
  response: Response;
  constructor(options) {
    super(options);
    this.response = options.response;
  }
}

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly paginateEntitiesPerPage = 500;
  private readonly baseUri = 'https://api.platform.cycognito.com/v1';

  private withBaseUri = (path: string, params?: Record<string, string>) => {
    const url = new URL(`${this.baseUri}/${path}`);
    url.search = new URLSearchParams(params).toString();
    return url.toString();
  };

  public async request<T>(
    uri: string,
    method: 'GET' | 'HEAD' | 'POST' = 'POST',
    body: Object = [],
  ): Promise<T> {
    try {
      const result = await retry<Response>(
        async () => {
          const response = await fetch(uri, {
            method,
            headers: {
              Authorization: this.config.accessToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          if (!response.ok) {
            throw new ResponseError({
              endpoint: uri,
              status: response.status,
              statusText: response.statusText,
              response,
            });
          }
          return response;
        },
        {
          // CyCognito documentation has no info on rate limiting
          // use exponential backoff with default config
          delay: 3000,
          factor: 2,
          maxAttempts: 10,
        },
      );
      return (await result.json()) as T;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const endpoint = this.withBaseUri('issues', { count: '0', offset: '0' });
    try {
      await this.request<Issue[]>(endpoint);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async iterateEntities<T>(
    path: string,
    iteratee: ResourceIteratee<T>,
  ) {
    let page = 0;
    let length = 0;

    do {
      const endpoint = this.withBaseUri(path, {
        count: `${this.paginateEntitiesPerPage}`,
        offset: `${page}`,
      });

      const body = await this.request<T[]>(endpoint);

      for (const data of body) {
        await iteratee(data);
      }

      page += 1;
      length = body.length;
    } while (length > 0);
  }

  public async iterateAssets<T extends AssetData>(
    type: AssetType,
    iteratee: ResourceIteratee<T>,
  ) {
    await this.iterateEntities<T>(`assets/${type}`, iteratee);
  }

  public async iterateIssues(iteratee: ResourceIteratee<Issue>) {
    await this.iterateEntities<Issue>('issues', iteratee);
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
