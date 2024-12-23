import { query, redirect } from '@solidjs/router';
import { getCookie } from 'vinxi/http';
import { getDomParser } from './domParser.ts';
import { discGolfMetrixUrl } from './urlBase.ts';

export const discGolfMetrixGetAccountSettings = query(async () => {
  'use server';

  const token = getCookie('token');
  if (!token) return redirect('/login');

  const response = await fetch(new URL('/?u=account_edit', discGolfMetrixUrl), {
    headers: {
      cookie: token,
    },
  });
  if (!response.ok) throw new Error('Request failed');

  const text = await response.text();
  const domParser = await getDomParser();
  const parser = new domParser();
  const parsedHtml = parser.parseFromString(text, 'text/html');

  const imageUrlStr = parsedHtml
    .querySelector('.input-placeholder img')
    ?.getAttribute('src');
  const imageUrl = imageUrlStr
    ? new URL(imageUrlStr, discGolfMetrixUrl)
    : undefined;

  const firstName = parsedHtml
    .getElementById('id_firstname')
    ?.getAttribute('value');
  const lastName = parsedHtml
    .getElementById('id_lastname')
    ?.getAttribute('value');
  const name = parsedHtml.getElementById('id_name')?.getAttribute('value');
  const nickname = parsedHtml
    .getElementById('id_nickname')
    ?.getAttribute('value');
  const email = parsedHtml.getElementById('id_email')?.getAttribute('value');

  const userIdStr = [...parsedHtml.querySelectorAll('form label')]
    .filter((x) => x.textContent?.includes('MetrixID:'))[0]
    ?.querySelector('.input-group-field')?.textContent;
  if (!userIdStr) throw new Error('User id missing');
  const userId = Number.parseInt(userIdStr);

  return {
    userId,
    imageUrl,
    firstName,
    lastName,
    name,
    nickname,
    email,
  };
}, 'accountSettings');
