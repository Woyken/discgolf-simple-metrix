import { query, redirect } from '@solidjs/router';
import { getCookie } from 'vinxi/http';
import { getDomParser } from './domParser';
import { discGolfMetrixUrl } from './urlBase';

export const discGolfMetrixViewResults = query(
  async (competitionId: string) => {
    'use server';

    const token = getCookie('token');
    if (!token) return redirect('/login') as never;

    const response = await fetch(
      new URL(
        `/${encodeURIComponent(competitionId)}&view=result`,
        discGolfMetrixUrl,
      ),
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
    const courseLinkEl = [
      ...parsedHtml.querySelectorAll('.main-header a'),
    ].filter((x) => x.getAttribute('href')?.startsWith('/course/'))[0];

    const courseId = courseLinkEl.getAttribute('href')?.split('/').at(-1);
    const courseName = courseLinkEl.textContent;
    if (courseId === undefined) throw new Error('courseId not found');
    if (courseName === null) throw new Error('courseName not found');

    const table = parsedHtml.getElementById('id_results');
    if (!table) throw new Error('Table not found');
    const rows = table.querySelectorAll(':scope > tbody > tr');
    const firstRow = rows[0];
    const holesParList = [...firstRow.querySelectorAll('td.center')].map(
      (x) => {
        if (x.textContent === null) throw new Error('text content missing');
        return Number.parseInt(x.textContent);
      },
    );

    const players = [...rows].slice(1).map((row) => {
      const [
        positionEl,
        // biome-ignore lint/correctness/noUnusedVariables: spacing out results
        nameEl,
        // biome-ignore lint/correctness/noUnusedVariables: spacing out results
        scoreEl,
        // biome-ignore lint/correctness/noUnusedVariables: spacing out results
        playedHolesEl,
        ...scoresElAndMore
        // // biome-ignore lint/correctness/noUnusedVariables: spacing out results
        // dbogeyEl,
        // // biome-ignore lint/correctness/noUnusedVariables: spacing out results
        // bogeyEl,
        // // biome-ignore lint/correctness/noUnusedVariables: spacing out results
        // score2El,
        // // biome-ignore lint/correctness/noUnusedVariables: spacing out results
        // resultEl,
      ] = row.querySelectorAll('td');
      const scoresEl = scoresElAndMore.slice(0, scoresElAndMore.length - 2);

      if (!positionEl.textContent) throw new Error('!positionEl.textContent');
      const position = Number.parseInt(positionEl.textContent);
      const playerCell = row.querySelector('.player-cell');
      if (!playerCell) throw new Error('missing player cell');
      const name = playerCell.textContent?.trim();
      if (!name) throw new Error('player name not found');
      const playerIdStr = playerCell
        .querySelector('.profile-link')
        ?.getAttribute('href')
        ?.split('/')
        .at(-1);
      const playerId = playerIdStr ? Number.parseInt(playerIdStr) : undefined;

      const scores = scoresEl.map((x) => {
        if (x.textContent == null) return undefined;

        const score = Number.parseInt(x.textContent);
        return Number.isNaN(score) ? undefined : score;
      });

      return { playerId, name, position, scores };
    });

    return {
      holesParList,
      players,
      courseId,
      courseName,
    };
  },
  'viewResults',
);
