import { query } from '@solidjs/router';
import { discGolfMetrixUrl } from './urlBase';

const accessTokenRegex = /mapboxgl\.accessToken[^'"]+['"]([^'"]+)['"]/m;

export const discGolfMetrixGetMapboxAccessToken = query(async () => {
  'use server';
  const url = new URL('/throws_viewer.js', discGolfMetrixUrl);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Request failed');

  const text = await response.text();
  const match = text.match(accessTokenRegex);
  const accessToken = match?.[0];
  if (!accessToken) throw new Error('Missing access token');

  return { accessToken };
}, 'discGolfMetrixGetMapboxAccessToken');
