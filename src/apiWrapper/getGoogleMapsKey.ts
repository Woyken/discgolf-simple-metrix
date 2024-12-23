import { query } from '@solidjs/router';
import { getDomParser } from './domParser';
import { discGolfMetrixUrl } from './urlBase';

export const discGolfMetrixGetGoogleMapsKey = query(
  async (courseId: string) => {
    'use server';

    const url = new URL('/?u=map', discGolfMetrixUrl);
    url.searchParams.set('ID', courseId);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Request failed');

    const text = await response.text();
    const domParser = await getDomParser();
    const parser = new domParser();
    const parsedHtml = parser.parseFromString(text, 'text/html');

    const googleMapsScriptUrlStr = [
      ...parsedHtml.querySelectorAll('head>script'),
    ]
      .map((x) => x.getAttribute('src'))
      .filter((x) => x?.startsWith('https://maps.googleapis.com'))[0];
    if (!googleMapsScriptUrlStr) throw new Error('Missing google maps script');
    // Something like this:
    // https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&key=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const googleMapsScriptUrl = new URL(googleMapsScriptUrlStr);
    const googleMapsApiKey = googleMapsScriptUrl.searchParams.get('key');
    if (!googleMapsApiKey) throw new Error('Missing google maps api key');

    return {
      googleMapsApiKey,
    };
  },
  'getGoogleMapsKey',
);
