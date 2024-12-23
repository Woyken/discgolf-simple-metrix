// https://discgolfmetrix.com/?=&ID=3177876
import { query, redirect } from '@solidjs/router';
import { getCookie } from 'vinxi/http';
import { getDomParser } from './domParser.ts';
import { discGolfMetrixUrl } from './urlBase.ts';

function dropUntil<T>(iter: Iterable<T>, until: (i: T) => boolean) {
  return {
    *[Symbol.iterator]() {
      let conditionReached = false;
      for (const i of iter) {
        if (conditionReached) {
          yield i;
          continue;
        }
        const isCondition = until(i);
        if (!isCondition) continue;
        if (isCondition) {
          conditionReached = true;
          yield i;
        }
      }
    },
  };
}

function takeUntil<T>(iter: Iterable<T>, until: (i: T) => boolean) {
  return {
    *[Symbol.iterator]() {
      for (const i of iter) {
        const isCondition = until(i);
        if (!isCondition) return;
        yield i;
      }
    },
  };
}

export const discGolfMetrixGetGroups = query(async (competitionId: string) => {
  'use server';
  const token = getCookie('token');
  if (!token) throw redirect('/login');

  const url = new URL('/', discGolfMetrixUrl);
  url.searchParams.set('u', 'scorecard_groups');
  url.searchParams.set('ID', competitionId);

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

  const contentEl = parsedHtml.getElementById('content');
  if (!contentEl) throw new Error('missing content element');

  const tableRows = contentEl.querySelectorAll('table tr');
  const rowsAndCells = tableRows
    .values()
    .map((row) => ({ row, cells: row.querySelectorAll('td') }));

  const groupWithParticipants = Iterator.from({
    *[Symbol.iterator]() {
      for (const rowAndCells of rowsAndCells) {
        if (rowAndCells.cells[0].innerText !== '') continue;
        // This is group header
        let i = 0;
        for (const groupIdEl of rowAndCells.cells.values().drop(1)) {
          i++;
          const groupId = groupIdEl.innerText;
          const nextRows = Iterator.from(
            takeUntil(
              Iterator.from(
                dropUntil(rowsAndCells, (rc) => rc.row === rowAndCells.row),
              ).drop(1),
              (nr) => nr.cells[0].innerText === '',
            ),
          );
          for (const nextRow of nextRows) {
            const c = nextRow.cells[i + 1];
            const user = c.innerText;
            yield { groupId, user };
          }
        }
      }
    },
  });

  return {
    groupWithParticipants,
  };
}, 'getGroups');
