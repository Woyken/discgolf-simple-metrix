import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "mapbox-gl";
import { onCleanup } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import {
  getCompetitionThrowsQueryOptions,
  getMapboxAccessTokenQueryOptions,
} from "./query/query";
import { QueryBoundary } from "../queryBoundary";
import { CompetitionThrowsResponse } from "~/apiWrapper/getCompetitionThrows";

export function RenderAndQuery(props: { competitionId: string }) {
  const accessTokenQuery = createQuery(() =>
    getMapboxAccessTokenQueryOptions()
  );

  const competitionThrowsQuery = createQuery(() =>
    getCompetitionThrowsQueryOptions(props.competitionId)
  );

  return (
    <QueryBoundary query={competitionThrowsQuery}>
      {(throwsData) => (
        <QueryBoundary query={accessTokenQuery}>
          {(accessTokenData) => (
            <MapboxRender
              accessToken={accessTokenData.accessToken}
              throwsData={throwsData}
            />
          )}
        </QueryBoundary>
      )}
    </QueryBoundary>
  );
}

function MapboxRender(props: {
  accessToken: string;
  throwsData: CompetitionThrowsResponse;
}) {
  const mapContainer = <div />;
  const map = new Map({
    accessToken: props.accessToken,
    container: mapContainer as HTMLElement,
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-74.5, 40],
    zoom: 9,
  });

  onCleanup(() => map.remove());

  return mapContainer;
}
