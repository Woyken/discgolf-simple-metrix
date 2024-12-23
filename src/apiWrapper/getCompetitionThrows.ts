import { query } from '@solidjs/router';
import { discGolfMetrixUrl } from './urlBase.ts';

export type CompetitionThrowsResponse = {
  competition: {
    // biome-ignore lint/style/useNamingConvention: Typed API
    ID: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    ParentID: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    CountryCode: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Name: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Fullname: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    CourceID: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    CourseName: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    LocationX: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    LocationY: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    UseGroups: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    UseClasses: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    ShowPreviousRoundSum: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Date: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Time: string;
  };
  scorecards: Array<{
    // biome-ignore lint/style/useNamingConvention: Typed API
    ID: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Name: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    UserID: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Status: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    GroupName: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    GroupOrder?: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Image?: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Results: Record<
      string,
      | {
          // biome-ignore lint/style/useNamingConvention: Typed API
          ID: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          ScorecardID: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          HoleNo: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          Result: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          OB: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          GH: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          OCP: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          ICP: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          BEH: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          IBP: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          Penalty: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          CreatedOn: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          CreatedBy: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          ModifiedOn?: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          ModifiedBy?: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          Diff: string;
          // biome-ignore lint/style/useNamingConvention: Typed API
          Throws: Array<{
            // biome-ignore lint/style/useNamingConvention: Typed API
            ID: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            ScorecardID: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            HoleNo: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            ThrowNo: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            Time: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            FromLat?: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            FromLng?: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            ToLat: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            ToLng: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            Distance: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            Penalty?: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            FromCircle?: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            ToCircle?: string;
            // biome-ignore lint/style/useNamingConvention: Typed API
            Basket?: string;
          }>;
        }
      | {
          // biome-ignore lint/style/useNamingConvention: Typed API
          HoleNo: number;
          // biome-ignore lint/style/useNamingConvention: Typed API
          Throws: [];
        }
    >;
  }>;
  course: {
    // biome-ignore lint/style/useNamingConvention: Typed API
    Name: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    CenterCoordinates: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    UserID: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    HasMap: string;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Tracks: Array<{
      // biome-ignore lint/style/useNamingConvention: Typed API
      Name: number;
      // biome-ignore lint/style/useNamingConvention: Typed API
      NameAlt: null;
      // biome-ignore lint/style/useNamingConvention: Typed API
      Par: string;
      // biome-ignore lint/style/useNamingConvention: Typed API
      Length: string;
      // biome-ignore lint/style/useNamingConvention: Typed API
      Tee: string;
      // biome-ignore lint/style/useNamingConvention: Typed API
      Basket: string;
      // biome-ignore lint/style/useNamingConvention: Typed API
      Line: string[];
      // biome-ignore lint/style/useNamingConvention: Typed API
      LineSmooth: string[];
      // biome-ignore lint/style/useNamingConvention: Typed API
      TeeRectangle: string[];
      // biome-ignore lint/style/useNamingConvention: Typed API
      Dropzones: string[][];
      // biome-ignore lint/style/useNamingConvention: Typed API
      DropzonesLocation: string[];
      // biome-ignore lint/style/useNamingConvention: Typed API
      DropzonesLine: string[][];
      // biome-ignore lint/style/useNamingConvention: Typed API
      Obs: string[][];
      // biome-ignore lint/style/useNamingConvention: Typed API
      Fairway: never[];
      // biome-ignore lint/style/useNamingConvention: Typed API
      Label: string;
      // biome-ignore lint/style/useNamingConvention: Typed API
      Test?: number;
    }>;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Obs: Array<{
      // biome-ignore lint/style/useNamingConvention: Typed API
      Points: string[];
      // biome-ignore lint/style/useNamingConvention: Typed API
      Basket: string;
    }>;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Dropzones: Array<{
      // biome-ignore lint/style/useNamingConvention: Typed API
      Location: string;
      // biome-ignore lint/style/useNamingConvention: Typed API
      Flight: string[];
      // biome-ignore lint/style/useNamingConvention: Typed API
      Basket: string;
    }>;
    // biome-ignore lint/style/useNamingConvention: Typed API
    Fairway: never[];
    // biome-ignore lint/style/useNamingConvention: Typed API
    Forests: never[];
  };
  topRatedMapUsers: string[];
  prevRoundsResults:
    | boolean
    | Record<
        string,
        // biome-ignore lint/style/useNamingConvention: Typed API
        { UserID: string; Name: string; SumResult: string; SumDiff: string }
      >;
};

export const discGolfMetrixGetCompetitionThrows = query(
  async (competitionId: string) => {
    'use server';
    const url = new URL('/throws_viewer_server.php', discGolfMetrixUrl);
    url.searchParams.set('competitionId', competitionId);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Request failed');

    const data = (await response.json()) as CompetitionThrowsResponse;
    return data;
  },
  'discGolfMetrixGetCompetitionThrows',
);
