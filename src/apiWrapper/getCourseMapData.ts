import { cache } from "@solidjs/router";
import { discGolfMetrixUrl } from "./urlBase";

type MapJsonResponse = {
  Name: string;
  CenterCoordinates: string;
  UserID: string;
  HasMap: string;
  Tracks: Array<{
    Name: number;
    NameAlt: null | string;
    Par: string;
    Length: string;
    Tee: string;
    Basket: string;
    Line: Array<string>;
    LineSmooth: Array<string>;
    TeeRectangle: Array<string>;
    Dropzones: Array<Array<string>>;
    DropzonesLocation: Array<string>;
    DropzonesLine: Array<Array<string>>;
    Obs: Array<Array<string>>;
    Fairway: Array<string>;
    Label: string;
    Test?: number;
  }>;
  Obs: Array<{
    Points: Array<string>;
    Basket: string;
  }>;
  Dropzones: Array<{
    Location: string;
    Flight: Array<string>;
    Basket: string;
  }>;
  Fairway: Array<unknown>;
  Forests: Array<unknown>;
};

export const discGolfMetrixGetCourseMapData = cache(
  async (courseId: string) => {
    "use server";

    const url = new URL(`/map/course_map_json.php`, discGolfMetrixUrl);
    url.searchParams.set("ID", courseId);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed");

    const data = (await response.json()) as MapJsonResponse;
    return data;
  },
  "getCourseMapJson"
);
