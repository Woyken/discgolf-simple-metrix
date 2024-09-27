import { getCookie } from "vinxi/http";
import { getDomParser } from "./domParser";
import { cache, redirect } from "@solidjs/router";
import { z } from "vinxi";
import { discGolfMetrixUrl } from "./urlBase";

export const discGolfMetrixGetPlayer = cache(async (playerIdMaybe: number) => {
  "use server";
  const playerId = z.number().parse(playerIdMaybe);
  const token = getCookie("token");
  if (!token) throw redirect("/login");

  const response = await fetch(
    new URL(`/player/${playerId}`, discGolfMetrixUrl),
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
  const profilePictureEl = parsedHtml.querySelector("div.profile-face");
  if (!profilePictureEl) throw new Error("missing profile picture element");
  const playerName = parsedHtml.querySelector(
    "div.profile-name h1"
  )?.textContent;
  if (!playerName) throw new Error("missing profile name");

  const profilePictureUrl = getProfilePictureUrl(profilePictureEl);

  return {
    profilePictureUrl,
    playerName,
  };
}, "getPlayer");
function getProfilePictureUrl(profilePictureEl: Element) {
  if (
    !!profilePictureEl?.classList.contains("no-face") ||
    !profilePictureEl?.getAttribute("style")
  )
    return undefined;

  const urlStr = profilePictureEl.getAttribute("style")?.split("'")[1];
  if (!urlStr) return undefined;
  return new URL(urlStr, discGolfMetrixUrl);
}
