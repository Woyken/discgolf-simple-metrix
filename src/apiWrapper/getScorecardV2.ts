import { query, redirect } from "@solidjs/router";
import { discGolfMetrixUrl } from "./urlBase";
import { getCookie } from "vinxi/http";
import { getDomParser } from "./domParser";

export const discGolfMetrixGetScorecardV2 = query(
  async (
    competitionId: string,
    view: "result" | "info" | "news",
    // Looks like local time: 2024-12-17 14:40:41, got from hidden input when page was loaded
    sinceDateTime: string,
    playerId: number,
    classId: string | undefined,
    groupId: string | undefined
  ) => {
    "use server";
    const token = getCookie("token");
    if (!token) throw redirect("/login");

    const url = new URL(`/scorecard_server2.php`, discGolfMetrixUrl);
    url.searchParams.set("ID", competitionId);
    url.searchParams.set("view", view);
    url.searchParams.set("DateTime", sinceDateTime);
    url.searchParams.set("player", playerId.toString());
    url.searchParams.set("class", classId ?? "");
    url.searchParams.set("pool", groupId ?? "");

    const response = await fetch(url, {
      headers: {
        Cookie: token,
      },
    });
    if (!response.ok) throw new Error("Request failed");

    const text = await response.text();
    const DOMParser = await getDomParser();
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(text, "text/html");

    // TODO Parse the html to usable content
    return {
      parsedHtml,
    };
  },
  "getScorecard v2"
);
