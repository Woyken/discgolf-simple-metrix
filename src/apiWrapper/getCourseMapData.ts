import { query } from '@solidjs/router';
import { discGolfMetrixUrl } from './urlBase';

type MapJsonResponse = {
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
    NameAlt: null | string;
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
    Fairway: string[];
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
  Fairway: unknown[];
  // biome-ignore lint/style/useNamingConvention: Typed API
  Forests: unknown[];
};

export const discGolfMetrixGetCourseMapData = query(
  async (courseId: string) => {
    'use server';

    const url = new URL('/map/course_map_json.php', discGolfMetrixUrl);
    url.searchParams.set('ID', courseId);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Request failed');

    const data = (await response.json()) as MapJsonResponse;
    return data;
  },
  'getCourseMapJson',
);
