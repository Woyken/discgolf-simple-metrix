import { query, redirect } from '@solidjs/router';
import { number, parse } from 'valibot';
import { getCookie } from 'vinxi/http';
import { getDomParser } from './domParser.ts';
import { discGolfMetrixUrl } from './urlBase.ts';

// TODO Faster endpoint to find player and it's avatar image:
// https://discgolfmetrix.com/?u=player_stat&value=karolis%20uz
// And request
// https://discgolfmetrix.com/find_user_server.php?value=karolis%20uz

export const discGolfMetrixGetPlayer = query(async (playerIdMaybe: number) => {
  'use server';
  const playerId = parse(number(), playerIdMaybe);
  const token = getCookie('token');
  if (!token) throw redirect('/login');

  const response = await fetch(
    new URL(`/player/${playerId}`, discGolfMetrixUrl),
    {
      headers: {
        cookie: token,
      },
    },
  );
  if (!response.ok) throw new Error('Request failed');

  const text = await response.text();
  const domParser = await getDomParser();
  const parser = new domParser();
  const parsedHtml = parser.parseFromString(text, 'text/html');
  const profilePictureEl = parsedHtml.querySelector('div.profile-face');
  if (!profilePictureEl) throw new Error('missing profile picture element');
  const playerName = parsedHtml.querySelector(
    'div.profile-name h1',
  )?.textContent;
  if (!playerName) throw new Error('missing profile name');

  const profilePictureUrl = getProfilePictureUrl(profilePictureEl);

  return {
    profilePictureUrl,
    playerName,
  };
}, 'getPlayer');
function getProfilePictureUrl(profilePictureEl: Element) {
  if (
    !!profilePictureEl?.classList.contains('no-face') ||
    !profilePictureEl?.getAttribute('style')
  )
    return undefined;

  const urlStr = profilePictureEl.getAttribute('style')?.split("'")[1];
  if (!urlStr) return undefined;
  return new URL(urlStr, discGolfMetrixUrl);
}
