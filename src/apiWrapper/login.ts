import { type SessionConfig, setCookie, updateSession } from 'vinxi/http';
import { discGolfMetrixUrl } from './urlBase.ts';

type Session = {
  token: string;
  expiresAt: number;
};

const sessionConfig = {
  password:
    'process.env.SESSION_SECRETprocess.env.SESSION_SECRETprocess.env.SESSION_SECRETprocess.env.SESSION_SECRET',
} satisfies SessionConfig;

export async function discGolfMetrixLogin(email: string, password: string) {
  'use server';

  const formData = new URLSearchParams();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('Login', 'Login');
  const response = await fetch(new URL('/?u=login', discGolfMetrixUrl), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
    method: 'POST',
  });
  if (!response.ok) throw new Error('Login failed');
  const cookies = response.headers.getSetCookie();
  const rmhCookie = cookies.filter((x) => x.startsWith('RMH'))[0];
  if (!rmhCookie) throw new Error('Login failed'); // RMH cookie missing in response, todo parse page, maybe we can find error text in there?
  const rmhSplit = rmhCookie.split(';').map((x) => x.trim());
  const token = rmhSplit[0];
  const rhmMaxAge = rmhSplit.filter((x) => x.startsWith('Max-Age'))[0];
  if (!rhmMaxAge) throw new Error('RMH cookie missing Max-Age');
  const maxAgeNum = Number.parseInt(rhmMaxAge.split('=')[1]);
  if (Number.isNaN(maxAgeNum)) throw new Error('RHM Max-Age not a number');
  const expiresAt = Date.now() + maxAgeNum * 1000;

  await updateSession<Session>(sessionConfig, (d) => {
    d.expiresAt = expiresAt;
    d.token = token;
    return d;
  });

  // TODO sessions is not great for this long lasting token.
  // Let's use cookies
  setCookie('token', token, {
    expires: new Date(expiresAt),
  });
}
