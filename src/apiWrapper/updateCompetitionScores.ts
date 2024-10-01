import { getCookie } from "vinxi/http";
import { discGolfMetrixUrl } from "./urlBase";
import { redirect } from "@solidjs/router";
import { getDomParser } from "./domParser";

// https://discgolfmetrix.com/score3_savechanges.php?changes=12278261,5,3,0,,,,,0
//                                                           /\ player in competition id
//                                                                   /\ hole number
//                                                                     /\ throw count

// multiple players
// https://discgolfmetrix.com/score3_savechanges.php?changes=12278284,2,3,0,,,,,0;12278285,2,4,0,,,,,0

// https://discgolfmetrix.com/?u=competition_score_desktop&ID=3140089&selected_group=&metrix_mode=1&player=0
// tee_count=7&competitor_count=2&metrix_mode=1&tee_no%5B%5D=1&tee_no%5B%5D=2&tee_no%5B%5D=3&tee_no%5B%5D=4&tee_no%5B%5D=5&tee_no%5B%5D=6&tee_no%5B%5D=7&scorecard_id%5B%5D=12278261&score%5B%5D=6&score%5B%5D=4&score%5B%5D=4&score%5B%5D=3&score%5B%5D=3&score%5B%5D=4&score%5B%5D=&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=&scorecard_id%5B%5D=12278271&score%5B%5D=3&score%5B%5D=3&score%5B%5D=3&score%5B%5D=3&score%5B%5D=3&score%5B%5D=&score%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&ActionSave=Save

export async function discGolfMetrixUpdateCompetitionScores(courseId: number) {
  "use server";

  const token = getCookie("token");
  if (!token) return redirect("/login");

  const url = new URL("/?u=competition_score_desktop", discGolfMetrixUrl);

  url.searchParams.set("ID", courseId.toString());
  // TODO support groups?
  url.searchParams.set("selected_group", "");
  // TODO remove?
  url.searchParams.set("metrix_mode", "1");
  // TODO what is this?
  url.searchParams.set("player", "0");

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

  return {};
}
