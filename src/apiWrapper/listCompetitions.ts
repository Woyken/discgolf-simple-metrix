import { query, redirect } from '@solidjs/router';
import { getCookie } from 'vinxi/http';
import { getDomParser } from './domParser';
import { discGolfMetrixUrl } from './urlBase';

export const discGolfMetrixGetCompetitionsList = query(
  async (nextPageParam?: { from: number; to: number }, type?: 'training') => {
    'use server';

    const token = getCookie('token');
    if (!token) return redirect('/login');

    const url = new URL('/competitions_list_server.php', discGolfMetrixUrl);
    url.searchParams.set('my_all', '1');
    url.searchParams.set('type', type === 'training' ? 't' : '');
    if (nextPageParam?.from)
      url.searchParams.set('from', nextPageParam.from.toString());
    if (nextPageParam?.to)
      url.searchParams.set('to', nextPageParam.to.toString());

    const response = await fetch(url, {
      headers: {
        cookie: token,
      },
    });
    if (!response.ok) throw new Error('Request failed');

    const text = await response.text();
    const domParser = await getDomParser();
    const parser = new domParser();
    const parsedHtml = parser.parseFromString(text, 'text/html');
    const entriesElements = parsedHtml.querySelectorAll(
      '#competition_list2>table>tbody>tr',
    );
    const nextPaginationEl = parsedHtml.querySelector('.pagination-next');
    if (!nextPaginationEl) throw new Error('Missing pagination el');
    const nextPageUrl = nextPaginationEl.querySelector('a')?.href;

    let nextPageParams: { from: number; to: number } | undefined;
    if (nextPageUrl) {
      const url = new URL(nextPageUrl, 'https://example.com');
      const fromStr = url.searchParams.get('from');
      if (!fromStr) throw new Error('missing from');
      const from = Number.parseInt(fromStr);
      const toStr = url.searchParams.get('to');
      if (!toStr) throw new Error('missing to');
      const to = Number.parseInt(toStr);
      nextPageParams = { from, to };
    }

    const items = [...entriesElements].map((entryElement) => {
      const onClickStr = entryElement.getAttribute('onclick');
      if (!onClickStr) throw new Error('Missing onClick');
      const id = Number.parseInt(onClickStr.split('/')[1]);
      if (Number.isNaN(id)) throw new Error('NaN');

      const [
        nameAndLocationEl,
        dateEl,
        typeEl,
        courseNameEl,
        playersEl,
        // divisionsEl,
        // commentEl,
      ] = entryElement.querySelectorAll('td');

      const competitionName = nameAndLocationEl.querySelector('b')?.textContent;
      if (!competitionName) throw new Error('missing competition name');
      const locationName = [...nameAndLocationEl.childNodes].at(
        -1,
      )?.textContent;
      if (!locationName) throw new Error('missing location name');
      const date = dateEl.textContent?.trim();
      if (!date) throw new Error('missing date');
      const isTraining = typeEl.textContent?.trim() === 'Training';
      const playerCountStr = playersEl.textContent?.trim();
      if (!playerCountStr) throw new Error('missing playerCount');
      const playerCount = Number.parseInt(playerCountStr);
      const courseName = courseNameEl.textContent?.trim();
      if (!courseName) throw new Error('missing courseName');

      return {
        id,
        date,
        isTraining,
        playerCount,
        courseName,
        competitionName,
        locationName,
      };
    });

    return {
      items,
      nextPageParams,
    };
  },
  'competitionList',
);
