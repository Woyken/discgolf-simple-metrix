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

export async function discGolfMetrixUpdateCompetitionScores2(
  props: {
    competitionParticipantId: string;
    holeIndex: number;
    result: number;
    // Did the drive land inside the 3m circle?
    bullseyeHit?: boolean;
    // Did the drive land inside the 10m circle?
    greenHits?: boolean;
    // Did you putt IN to the basket from outside the 10m circle?
    outsideCirclePutt?: boolean;
    // How many throws between 3m and 10m circles?
    insideCirclePutts?: number;
    // Was your last putt from inside the 3m circle?
    insideBullseyePutt?: boolean;
    // How many penalties including OBs?
    penalties?: number;
  }[]
) {
  "use server";

  const token = getCookie("token");
  if (!token) return redirect("/login");

  const url = new URL("/score3_savechanges.php", discGolfMetrixUrl);

  const params = props
    .map((prop) => {
      const paramCompetitionParticipantId = prop.competitionParticipantId;
      const paramHoleIndex = prop.holeIndex;
      const paramResult = prop.result;
      const paramUnknownField1 = "";
      const paramGreenHit =
        prop.greenHits == null ? "" : prop.greenHits ? 1 : 0;
      const paramOutsideCirclePutt =
        prop.outsideCirclePutt == null ? "" : prop.outsideCirclePutt ? 1 : 0;
      const paramInsideCirclePutts = prop.insideCirclePutts ?? "";
      const paramBullseyeHit =
        prop.bullseyeHit == null ? "" : prop.bullseyeHit ? 1 : 0;
      const paramInsideBullseyePutt =
        prop.insideBullseyePutt == null ? "" : prop.insideBullseyePutt ? 1 : 0;
      const paramPenalties = prop.penalties ?? "";
      const paramUnknownField2 = 0;

      return `${paramCompetitionParticipantId},${paramHoleIndex},${paramResult},${paramUnknownField1},${paramGreenHit},${paramOutsideCirclePutt},${paramInsideCirclePutts},${paramBullseyeHit},${paramInsideBullseyePutt},${paramPenalties},${paramUnknownField2}`;
    })
    .join(";");
  url.searchParams.set("changes", params);

  const response = await fetch(url, {
    headers: {
      Cookie: token,
    },
    method: "GET",
  });
  if (!response.ok) throw new Error("Competition update failed");
}

// changes=12479966,2,6,,0,1,3,1,1,9,0
//         id,hole,res,?,grh,ocp,icp,bue,ibp,pen,?

// https://discgolfmetrix.com/?u=competition_score_desktop&ID=3140089&selected_group=&metrix_mode=1&player=0

// tee_count=7&competitor_count=2&metrix_mode=1&tee_no%5B%5D=1&tee_no%5B%5D=2&tee_no%5B%5D=3&tee_no%5B%5D=4&tee_no%5B%5D=5&tee_no%5B%5D=6&tee_no%5B%5D=7&scorecard_id%5B%5D=12278261&score%5B%5D=6&score%5B%5D=4&score%5B%5D=4&score%5B%5D=3&score%5B%5D=3&score%5B%5D=4&score%5B%5D=&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=0&icp%5B%5D=&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=0&penalties%5B%5D=&scorecard_id%5B%5D=12278271&score%5B%5D=3&score%5B%5D=3&score%5B%5D=3&score%5B%5D=3&score%5B%5D=3&score%5B%5D=&score%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&icp%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&penalties%5B%5D=&ActionSave=Save

export async function discGolfMetrixUpdateCompetitionScores(
  competitionId: number
) {
  "use server";

  const token = getCookie("token");
  if (!token) return redirect("/login");

  const url = new URL("/?u=competition_score_desktop", discGolfMetrixUrl);

  url.searchParams.set("ID", competitionId.toString());
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
