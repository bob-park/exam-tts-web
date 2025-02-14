import { NextRequest } from 'next/server';

const { MOCK_SERVER_HOST } = process.env;

const API_PREFIX = '/api';

export async function middleware(req: NextRequest) {
  const { nextUrl, body, method, headers } = req;
  const { pathname } = nextUrl;

  const requestUrl = pathname.substring(API_PREFIX.length);

  const params = nextUrl.searchParams;

  return await apiCall(requestUrl, method, headers, params, body);
}

async function apiCall(
  url: string,
  method: string,
  headers: Headers,
  params?: URLSearchParams,
  body?: BodyInit | null,
) {
  return fetch(`${MOCK_SERVER_HOST}${url}${params ? `?${params}` : ''}`, {
    method,
    headers: {
      'Content-Type': headers.get('Content-Type') || '',
    },
    body,
  });
}
export const config = {
  matcher: [],
};
