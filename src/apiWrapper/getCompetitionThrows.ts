import { query } from "@solidjs/router";
import { discGolfMetrixUrl } from "./urlBase";

export type CompetitionThrowsResponse = {
  competition: {
    ID: string;
    ParentID: string;
    CountryCode: string;
    Name: string;
    Fullname: string;
    CourceID: string;
    CourseName: string;
    LocationX: string;
    LocationY: string;
    UseGroups: string;
    UseClasses: string;
    ShowPreviousRoundSum: string;
    Date: string;
    Time: string;
  };
  scorecards: Array<{
    ID: string;
    Name: string;
    UserID: string;
    Status: string;
    GroupName: string;
    GroupOrder?: string;
    Image?: string;
    Results: Record<
      string,
      {
        ID: string;
        ScorecardID: string;
        HoleNo: string;
        Result: string;
        OB: string;
        GH: string;
        OCP: string;
        ICP: string;
        BEH: string;
        IBP: string;
        Penalty: string;
        CreatedOn: string;
        CreatedBy: string;
        ModifiedOn?: string;
        ModifiedBy?: string;
        Diff: string;
        Throws: Array<{
          ID: string;
          ScorecardID: string;
          HoleNo: string;
          ThrowNo: string;
          Time: string;
          FromLat?: string;
          FromLng?: string;
          ToLat: string;
          ToLng: string;
          Distance: string;
          Penalty?: string;
          FromCircle?: string;
          ToCircle?: string;
          Basket?: string;
        }>;
      }
    >;
  }>;
  course: {
    Name: string;
    CenterCoordinates: string;
    UserID: string;
    HasMap: string;
    Tracks: Array<{
      Name: number;
      NameAlt: null;
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
      Fairway: Array<never>;
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
    Fairway: Array<never>;
    Forests: Array<never>;
  };
  topRatedMapUsers: Array<string>;
  prevRoundsResults:
    | boolean
    | Record<
        string,
        { UserID: string; Name: string; SumResult: string; SumDiff: string }
      >;
};

export const discGolfMetrixGetCompetitionThrows = query(
  async (competitionId: string) => {
    "use server";
    const url = new URL(`/throws_viewer_server.php`, discGolfMetrixUrl);
    url.searchParams.set("competitionId", competitionId);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed");

    const data = (await response.json()) as CompetitionThrowsResponse;
    return data;
  },
  "discGolfMetrixGetCompetitionThrows"
);
