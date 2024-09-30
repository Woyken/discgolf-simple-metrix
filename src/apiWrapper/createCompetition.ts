// Create training
// GET requests
// https://discgolfmetrix.com/?u=competition_add&create_training=1&courseid=35233
// https://discgolfmetrix.com/?u=competition_add&create_training=1&competitiontype=1&courseid=0&custom_course=9&parentid=&record_type=

// Create competition (not training)
// POST requests
// https://discgolfmetrix.com/?u=competition_add&competitiontype=3&courseid=&custom_course=9&parentid=&record_type=2
// multiday_value=0&date=2024-09-30&time=09%3A19&start_date=2024-09-30&end_date=2024-09-30&name=Competition+name&comment=&game_mode=r&accesslevel=0&payment_yes=0&SaveEdit=Create+and+continue+edit
// https://discgolfmetrix.com/?u=competition_add&competitiontype=3&courseid=&custom_course=9&parentid=&record_type=2
// multiday_value=0&date=2024-09-30&time=09%3A18&start_date=2024-09-30&end_date=2024-09-30&name=Competition+name&comment=&game_mode=r&accesslevel=0&payment_yes=0&SaveStart=Create+and+start

import { getCookie } from "vinxi/http";
import { discGolfMetrixUrl } from "./urlBase";
import { redirect } from "@solidjs/router";
import { getDomParser } from "./domParser";

export async function discGolfMetrixCreateCompetition(
  courseId: number,
  training: boolean
) {
  "use server";

  const token = getCookie("token");
  if (!token) return redirect("/login");

  const url = new URL("/?u=competition_add", discGolfMetrixUrl);
  if (training) url.searchParams.set("create_training", "1");
  url.searchParams.set("courseid", courseId.toString());

  const response = await fetch(url, {
    headers: {
      Cookie: token,
    },
    method: "GET",
  });
  if (!response.ok) throw new Error("Competition creation failed");

  const text = await response.text();
  const DOMParser = await getDomParser();
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(text, "text/html");
  const competitionIdStr = [...parsedHtml.querySelectorAll(".breadcrumbs a")]
    .at(-1)
    ?.getAttribute("href")
    ?.split("/")
    .at(-1);
  if (!competitionIdStr) throw new Error("missing competition id");
  const competitionId = parseInt(competitionIdStr);

  return {
    competitionId,
  };
}
