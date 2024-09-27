import { getCookie } from "vinxi/http";
import { getDomParser } from "./domParser";
import { cache, redirect } from "@solidjs/router";
import { discGolfMetrixUrl } from "./urlBase";

export const discGolfMetrixViewResults = cache(
  async (competitionId: string) => {
    "use server";

    const token = getCookie("token");
    if (!token) return redirect("/login") as never;

    const response = await fetch(
      new URL(
        `/${encodeURIComponent(competitionId)}&view=result`,
        discGolfMetrixUrl
      ),
      {
        headers: {
          Cookie: token,
        },
      }
    );
    if (!response.ok) throw new Error("Request failed");

    const text = await response.text();
    const DOMParser = await getDomParser();
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(text, "text/html");
    const table = parsedHtml.getElementById("id_results");
    if (!table) throw new Error("Table not found");
    const rows = table.querySelectorAll(":scope > tbody > tr");
    const firstRow = rows[0];
    const holesParList = [...firstRow.querySelectorAll("td.center")].map(
      (x) => {
        if (x.textContent === null) throw new Error("text content missing");
        return parseInt(x.textContent);
      }
    );

    const players = [...rows].slice(1).map((row) => {
      const [
        positionEl,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nameEl,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        scoreEl,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        playedHolesEl,
        ...scoresElAndMore
        // // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // dbogeyEl,
        // // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // bogeyEl,
        // // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // score2El,
        // // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // resultEl,
      ] = row.querySelectorAll("td");
      const scoresEl = scoresElAndMore.slice(0, scoresElAndMore.length - 2);

      if (!positionEl.textContent) throw new Error("!positionEl.textContent");
      const position = parseInt(positionEl.textContent);
      const playerCell = row.querySelector(".player-cell");
      if (!playerCell) throw new Error("missing player cell");
      const name = playerCell.textContent?.trim();
      if (!name) throw new Error("player name not found");
      const playerIdStr = playerCell
        .querySelector(".profile-link")
        ?.getAttribute("href")
        ?.split("/")
        .at(-1);
      const playerId = playerIdStr ? parseInt(playerIdStr) : undefined;

      const scores = scoresEl.map((x) => {
        if (x.textContent === null) return undefined;
        return parseInt(x.textContent);
      });

      return { playerId, name, position, scores };
    });

    return {
      holesParList,
      players,
    };
  },
  "viewResults"
);
