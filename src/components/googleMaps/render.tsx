/// <reference types="google.maps" />
import { createQuery } from '@tanstack/solid-query';
import {
  type Accessor,
  Show,
  Suspense,
  createEffect,
  createMemo,
  onCleanup,
  untrack,
} from 'solid-js';
import { Button } from '../ui/button.tsx';
import { createGeolocation } from './createGeolocationWatcher';
import { useGoogleMapsMapsLibrary } from './mapsLibraryProvider';
import { getCourseMapDataQueryOptions } from './query/query';

// biome-ignore lint/correctness/noUndeclaredVariables: google maps define global variables :(
import googlemaps = google.maps;

export function GoogleMapsRender(props: { courseId: string }) {
  const query = createQuery(() => getCourseMapDataQueryOptions(props.courseId));

  return (
    <Suspense fallback={<div>LOADING MAP DATA</div>}>
      <Show when={query.data} fallback={<div>LOADING MAP DATA</div>}>
        {(data) => <RenderMapWithCourseData data={data()} />}
      </Show>
    </Suspense>
  );
}

function useUserLocation(map: Accessor<googlemaps.Map>) {
  const userPositionMarker = createMemo(
    () =>
      new googlemaps.Marker({
        title: 'Your location',
        icon: {
          strokeColor: '#000055',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: '#00A0AA',
          fillOpacity: 0.8,
          path: googlemaps.SymbolPath.CIRCLE,
          scale: 10,
        },
      }),
  );
  onCleanup(() => userPositionMarker().setMap(null));

  const userPositionAccuracyMarker = createMemo(
    () =>
      new googlemaps.Circle({
        strokeOpacity: 0.3,
        strokeColor: '#0000AA',
        fillColor: '#0060AA',
        fillOpacity: 0.18,
        radius: 2000,
        zIndex: 1,
      }),
  );
  onCleanup(() => userPositionAccuracyMarker().setMap(null));

  return {
    hide: () => {
      // biome-ignore lint/complexity/noForEach: TODO
      [userPositionMarker(), userPositionAccuracyMarker()].forEach((x) =>
        x.setMap(null),
      );
    },
    show: () => {
      // biome-ignore lint/complexity/noForEach: TODO
      [userPositionMarker(), userPositionAccuracyMarker()].forEach((x) =>
        x.setMap(map()),
      );
    },
    setPosition: (loc: { lat: number; lng: number }) => {
      // biome-ignore lint/complexity/noForEach: TODO
      [userPositionMarker(), userPositionAccuracyMarker()].forEach((x) =>
        'setCenter' in x
          ? x.setCenter({ lat: loc.lat, lng: loc.lng })
          : x.setPosition({ lat: loc.lat, lng: loc.lng }),
      );
    },
    setAccuracy: (num: number) => {
      userPositionAccuracyMarker().setRadius(num);
    },
  };
}

function RenderMapWithCourseData(props: {
  data: ReturnType<
    NonNullable<ReturnType<typeof getCourseMapDataQueryOptions>['select']>
  >;
}) {
  const lib = useGoogleMapsMapsLibrary();

  const mapContainer = (
    <div
      class="[&_.gm-style-iw]:bg-base-100 [&_.gm-style-iw-tc]:after:bg-base-100 text-neutral-800"
      style={{ width: '500px', height: '500px' }}
    />
  ) as HTMLDivElement;

  const allLocationsBounds = createMemo(() => {
    const allLocationsBounds = new googlemaps.LatLngBounds();
    // biome-ignore lint/complexity/noForEach: TODO
    props.data.Tracks.flat()
      .flatMap((x) => {
        const basket = x.Basket.split(',').map(Number.parseFloat);
        const lines = x.LineSmooth.map((x) =>
          x.split(',').map(Number.parseFloat),
        );
        return [
          { lat: basket[0], lng: basket[1] },
          ...lines.map((x) => ({ lat: x[0], lng: x[1] })),
        ];
      })
      .forEach((x) => allLocationsBounds.extend(x));
    return allLocationsBounds;
  });

  const map = createMemo(() => {
    return new lib.mapsLibrary.Map(mapContainer, {
      mapTypeId: googlemaps.MapTypeId.SATELLITE,
      mapTypeControlOptions: {
        style: googlemaps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: googlemaps.ControlPosition.INLINE_END_BLOCK_START,
        mapTypeIds: [],
      },
      fullscreenControl: true,
      colorScheme: googlemaps.ColorScheme.DARK,
    });
  });
  createEffect(() => {
    map().fitBounds(
      untrack(() => allLocationsBounds()),
      0,
    );
  });

  const userLocationMarker = useUserLocation(map);

  const [location, locationError, refetch] = createGeolocation(() => ({
    enableHighAccuracy: true,
    maximumAge: 10000,
  }));

  createEffect(() => {
    const pos = location();
    if (!pos) return;
    userLocationMarker.show();
    userLocationMarker.setPosition({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
    userLocationMarker.setAccuracy(pos.coords.accuracy);
  });

  const locationButton = (
    <Button classList={{ hidden: !!location() }} onclick={refetch}>
      Show my location
    </Button>
  ) as HTMLElement;

  map().controls[googlemaps.ControlPosition.TOP_CENTER].push(locationButton);

  const infoWindow = createMemo(() => {
    return new googlemaps.InfoWindow();
  });
  onCleanup(() => infoWindow().close());

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO
  createEffect(() => {
    const tracks = props.data.Tracks;

    for (const track of tracks) {
      const tooltipHeaderText = `No ${
        track.NameAlt ? track.NameAlt : track.Name
      }`;
      const tooltipContentText = `Par ${track.Par}<br>Length ${track.Length}m`;

      {
        const dropZonePointsList = track.Dropzones;
        // Draw dropZones
        for (const dropZonePoints of dropZonePointsList) {
          const paths = dropZonePoints
            .map((dropZonePoint) =>
              dropZonePoint.split(',').map(Number.parseFloat),
            )
            .map(
              (point) =>
                new googlemaps.LatLng({
                  lat: point[0],
                  lng: point[1],
                }),
            );

          const mapElement = new googlemaps.Polygon({
            paths,
            map: map(),
            strokeColor: '#969645',
            strokeOpacity: 1,
            strokeWeight: 0,
            fillColor: '#CCCC33',
            fillOpacity: 1,
            zIndex: 1,
          });
          onCleanup(() => mapElement.setMap(null));
        }
      }

      {
        // Draw fairway
        const fairways = track.Fairway;
        const paths = fairways
          .map((fairway) => fairway.split(',').map(Number.parseFloat))
          .map((point) => new googlemaps.LatLng(point[0], point[1]));

        const mapElement = new googlemaps.Polygon({
          paths,
          map: map(),
          strokeColor: '#FFFFFF',
          strokeOpacity: 0,
          strokeWeight: 0,
          fillColor: '#FFFFFF',
          fillOpacity: 0.2,
          zIndex: 1,
        });
        const listener = mapElement.addListener('mouseover', () => {
          infoWindow().setPosition(mapElement.getPath().getAt(0));
          infoWindow().setHeaderContent(tooltipHeaderText);
          infoWindow().setContent(tooltipContentText);
          infoWindow().open({ map: map() });
        });
        onCleanup(() => listener.remove());
        onCleanup(() => mapElement.setMap(null));
      }

      {
        // Draw line
        const line = track.LineSmooth;
        const googleLine = line
          .map((x) => x.split(',').map(Number.parseFloat))
          .map((point) => new googlemaps.LatLng(point[0], point[1]));

        const mapElement = new googlemaps.Polyline({
          path: googleLine,
          map: map(),
          geodesic: true,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.5,
          strokeWeight: 3,
          zIndex: 10,
        });
        onCleanup(() => mapElement.setMap(null));
        const listener = mapElement.addListener(
          'mouseover',
          (el: { latLng: { lat: number; lng: number } }) => {
            infoWindow().setPosition(el.latLng);
            infoWindow().setHeaderContent(tooltipHeaderText);
            infoWindow().setContent(tooltipContentText);
            infoWindow().open({ map: map() });
          },
        );
        onCleanup(() => listener.remove());
      }

      {
        // obs
        const obs = track.Obs;

        for (const ob of obs) {
          const path = ob
            .map((x) => x.split(',').map(Number.parseFloat))
            .map((point) => new googlemaps.LatLng(point[0], point[1]));

          const mapElement = new googlemaps.Polyline({
            path,
            map: map(),
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 2,
            zIndex: 10,
          });
          const listener = mapElement.addListener(
            'mouseover',
            (el: { latLng: { lat: number; lng: number } }) => {
              infoWindow().setPosition(el.latLng);
              infoWindow().setHeaderContent(tooltipHeaderText);
              infoWindow().setContent(tooltipContentText);
              infoWindow().open({ map: map() });
            },
          );
          onCleanup(() => listener.remove());
          onCleanup(() => mapElement.setMap(null));
        }
      }

      {
        // Draw tee
        const teeRectangle = track.TeeRectangle;
        const paths = teeRectangle
          .map((x) => x.split(',').map(Number.parseFloat))
          .map((point) => new googlemaps.LatLng(point[0], point[1]));
        const mapElement = new googlemaps.Polygon({
          paths,
          map: map(),
          strokeColor: '#1D5430',
          strokeOpacity: 1,
          strokeWeight: 0,
          fillColor: '#6ABF64',
          fillOpacity: 1,
          zIndex: 11,
        });
        onCleanup(() => mapElement.setMap(null));
        const listener = mapElement.addListener('mouseover', () => {
          infoWindow().setPosition(mapElement.getPath().getAt(0));
          infoWindow().setHeaderContent(tooltipHeaderText);
          infoWindow().setContent(tooltipContentText);
          infoWindow().open({ map: map() });
        });
        onCleanup(() => listener.remove());
      }

      {
        // Draw baskets
        const basket = track.Basket;
        const point = basket.split(',').map(Number.parseFloat);

        const basketEl = new googlemaps.Circle({
          strokeColor: '#FF6600',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF6600',
          fillOpacity: 1,
          zIndex: 11,
          map: map(),
          center: new googlemaps.LatLng(point[0], point[1]),
          radius: 1,
        });
        onCleanup(() => basketEl.setMap(null));
        const listener = basketEl.addListener('mouseover', () => {
          infoWindow().setPosition(basketEl.getBounds()?.getCenter());
          infoWindow().setHeaderContent(tooltipHeaderText);
          infoWindow().setContent(tooltipContentText);
          infoWindow().open({ map: map() });
        });
        onCleanup(() => listener.remove());

        // 3m cicle
        const circle3m = new googlemaps.Circle({
          strokeColor: '#669999',
          strokeOpacity: 0,
          strokeWeight: 1,
          fillColor: '#669999',
          fillOpacity: 0.4,
          zIndex: 10,
          map: map(),
          center: new googlemaps.LatLng(point[0], point[1]),
          radius: 3,
        });
        onCleanup(() => circle3m.setMap(null));
        {
          const listener = circle3m.addListener('mouseover', () => {
            infoWindow().setPosition(basketEl.getBounds()?.getCenter());
            infoWindow().setHeaderContent(tooltipHeaderText);
            infoWindow().setContent(tooltipContentText);
            infoWindow().open({ map: map() });
          });
          onCleanup(() => listener.remove());
        }

        // 10m cicle
        const circle10m = new googlemaps.Circle({
          strokeColor: '#669999',
          strokeOpacity: 0,
          strokeWeight: 1,
          fillColor: '#669999',
          fillOpacity: 0.4,
          zIndex: 10,
          map: map(),
          center: new googlemaps.LatLng(point[0], point[1]),
          radius: 10,
        });
        onCleanup(() => circle10m.setMap(null));
        {
          const listener = circle3m.addListener('mouseover', () => {
            infoWindow().setPosition(basketEl.getBounds()?.getCenter());
            infoWindow().setHeaderContent(tooltipHeaderText);
            infoWindow().setContent(tooltipContentText);
            infoWindow().open({ map: map() });
          });
          onCleanup(() => listener.remove());
        }

        // labels
        {
          // calculate label position
          const length13 = Number.parseFloat(track.Length) / 3;

          const linePoints = track.LineSmooth.map((x) =>
            x.split(',').map(Number.parseFloat),
          );
          let p0Coords: [number, number] = linePoints[0] as [number, number];
          let d = 0;
          for (const point of linePoints.slice(1)) {
            const [p0Lat, p0Lng] = p0Coords;
            const [p1Lat, p1Lng] = point;
            p0Coords = [p1Lat, p1Lng];
            const d1 = getDistance(p0Lat, p0Lng, p1Lat, p1Lng);
            if (d + d1 <= length13) {
              d += d1;
              continue;
            }

            // we found the right line to place the marker with label
            const d2 = length13 - d;

            const markerElement = new googlemaps.Marker({
              position: new googlemaps.LatLng(
                p0Lat + ((p1Lat - p0Lat) * d2) / d1,
                p0Lng + ((p1Lng - p0Lng) * d2) / d1,
              ),
              map: map(),
              icon: {
                url: 'https://discgolfmetrix.com/map/img/label3.png',
                labelOrigin: new googlemaps.Point(12, 10),
                size: new googlemaps.Size(24, 20),
                origin: new googlemaps.Point(0, 0),
                anchor: new googlemaps.Point(12, 10),
              },
              label: {
                text: track.NameAlt ? track.NameAlt : track.Name.toString(),
                color: '#333333',
                fontSize: '12px',
              },
            });
            onCleanup(() => markerElement.setMap(null));
            {
              const mouseOverListener = markerElement.addListener(
                'mouseover',
                () => {
                  infoWindow().setPosition(markerElement.getPosition());
                  infoWindow().setHeaderContent(tooltipHeaderText);
                  infoWindow().setContent(tooltipContentText);
                  infoWindow().open({ map: map() });
                },
              );
              onCleanup(() => mouseOverListener.remove());

              const pointsLats = linePoints.map((x) => x[0]);
              const pointsLngs = linePoints.map((x) => x[1]);
              const minLat = Math.min(...pointsLats);
              const minLng = Math.min(...pointsLngs);
              const maxLat = Math.max(...pointsLats);
              const maxLng = Math.max(...pointsLngs);
              const clickListener = markerElement.addListener('click', () => {
                map().fitBounds(
                  new googlemaps.LatLngBounds(
                    {
                      lat: minLat,
                      lng: minLng,
                    },
                    {
                      lat: maxLat,
                      lng: maxLng,
                    },
                  ),
                );
                infoWindow().close();
              });
              onCleanup(() => clickListener.remove());
            }
            break;
          }
        }
      }
    }
  });

  return (
    <>
      {mapContainer}
      <Show when={locationError()}>
        {(error) => (
          <div>
            {error().message}, {JSON.stringify(error())}
          </div>
        )}
      </Show>
    </>
  );
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c * 1000; // Distance in m
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Original script that renders the course map
/*
    avg_lat=parseFloat("54.688502908355");
    avg_lon=parseFloat("25.366559522359");
    lang_length = "Length";
    lang_number_short = "No";
    unit = "m";

    var map;
    var infoWindow = new googlemaps.InfoWindow();

    var mPath = [];
    var mTee = [];
    var mBasket = [];
    var mPathCount = 0;

    var mOb = [];
    var mObCount = -1;

    var mForest = [];
    var mForestCount = -1;

    var mFairway = [];
    var mFairwayCount  = 0;

    var mDropzone = [];
    var mDropzoneCount = 0;

    function initialize() {

        var mapOptions = {
            zoom: 17,
            center: new googlemaps.LatLng(54.688502908355,25.366559522359),
            mapTypeId: googlemaps.MapTypeId.HYBRID,
            mapTypeControlOptions: {
                style: googlemaps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: googlemaps.ControlPosition.RIGHT_TOP
            },
        };
        map = new googlemaps.Map(document.getElementById('map-canvas'),
            mapOptions);
        googlemaps.event.addListener(map, 'click', function(e) {
            infoWindow.close();
        });

        $.getJSON('../map/course_map_json.php?ID=14762', function(data) {

            course_name = data['Name'];

            // ob lines
            obs = data['Obs'];

            for (var i = 0; i < obs.length; i++)
            {
                line = obs[i];
                google_line = Array();
                for(var j = 0; j < line.length; j++)
                {

                    point = line[j].split(",");
                    google_line[j] = new googlemaps.LatLng(point[0],point[1]);

                }
                mObCount++;
                mOb[mObCount] = new googlemaps.Polyline({
                    path: google_line,
                    map: map,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    zIndex: 2
                });
            }

            lat1 = avg_lat + 20 / (111.1 / Math.cos(avg_lon * 3.14159 / 180));
            lon1 = avg_lon + 20 * 1.8 / 111.1;
            lat2 = avg_lat - 20 / (111.1 / Math.cos(avg_lon * 3.14159 / 180));
            lon2 = avg_lon - 20*1.8 / 111.1;


            // forest
            if(false)
            {
                google_line = Array();
                google_line[0] = new googlemaps.LatLng(lat1,lon1);
                mForest[0] = new googlemaps.Polygon({
                    path: google_line,
                    map: map,
                    strokeColor: '#77DBC5',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#77DBC5',
                    fillOpacity: 0.8,
                    zIndex: 1

                });
            }

            // tracks
            tracks = data['Tracks'];

            var mPath = Array();
            var mTooltipText = Array();
            for (var i = 0; i < tracks.length; i++)
            {

                track = tracks[i];

                if(track['Line'] != null)
                {
                    line = track['LineSmooth'];
                    fairway = track['Fairway'];
                    dropzones = track['Dropzones'];
                    name = track['Name'];
                    name_alt = track['NameAlt'];

                    if(unit=='f')
                    {
                        length = Math.round(track['Length'] * 3.28084);
                        unit_text = 'ft';
                    }
                    else
                    {
                        length = track['Length'];
                        unit_text = 'm';
                    }

                    mTooltipText[i] = lang_number_short+' '+(track['NameAlt'] ? track['NameAlt'] : track['Name'])+'<br>Par '+track['Par']+'<br>'+lang_length+' '+length+unit_text;

                    // dropzone
                    google_line = Array();
                    mDropzoneCount = 0;
                    if(dropzones.length>0)
                    {
                        for(var d = 0; d<dropzones.length; d++)
                        {
                            dropzone = dropzones[d];

                            // fairway
                            for(var j = 0; j < dropzone.length; j++)
                            {
                                point = dropzone[j].split(",");
                                google_line[j] = new googlemaps.LatLng(point[0],point[1]);
                            }
                            mDropzone[mDropzoneCount] = new googlemaps.Polygon({
                                path: google_line,
                                map: map,
                                strokeColor: '#969645',
                                strokeOpacity: 1,
                                strokeWeight: 0,
                                fillColor: '#CCCC33',
                                fillOpacity: 1,
                                zIndex: 1
                            });
                            mDropzoneCount++;
                        }
                    }

                    // fairway
                    google_line = Array();
                    if(fairway.length>0)
                    {
                        // fairway
                        for(var j = 0; j < fairway.length; j++)
                        {
                            point = fairway[j].split(",");
                            google_line[j] = new googlemaps.LatLng(point[0],point[1]);
                        }
                        mFairway[mFairwayCount] = new googlemaps.Polygon({
                            path: google_line,
                            map: map,
                            strokeColor: '#FFFFFF',
                            strokeOpacity: 0,
                            strokeWeight: 0,
                            fillColor: '#FFFFFF',
                            fillOpacity: 0.2,
                            zIndex: 1
                        });
                        //googlemaps.event.addListener(mFairway[mFairwayCount], 'mouseover', function(e) {
                        //    index = mFairway.indexOf(this);
                        //    infoWindow.setPosition(e.latLng);
                        //    infoWindow.setContent(mTooltipText[index]);
                        //    infoWindow.open(map);
                        //});

                        mFairwayCount++;
                    }

                    // line
                    google_line = Array();
                    distance = 0;
                    line = track['LineSmooth'];
                    google_line = Array();
                    for(var j = 0; j < line.length; j++)
                    {

                        point = line[j].split(",");
                        google_line[j] = new googlemaps.LatLng(point[0],point[1]);

                        if(j>0)
                        {
                            distance += getDistance(google_line[j-1].lat(), google_line[j-1].lng(), google_line[j].lat(), google_line[j].lng());
                        }

                    }
                    tracks[i]['Length'] = track['Length'];


                    mPath[mPathCount] = new googlemaps.Polyline({
                        path: google_line,
                        map: map,
                        geodesic: true,
                        strokeColor: '#FFFFFF',
                        strokeOpacity: 0.5,
                        strokeWeight: 3,
                        zIndex: 10
                    });
                    googlemaps.event.addListener(mPath[mPathCount], 'mouseover', function(e) {
                        index = mPath.indexOf(this);
                        infoWindow.setPosition(e.latLng);
                        infoWindow.setContent(mTooltipText[index]);
                        infoWindow.open(map);
                    });

                    // obs
                    var obs = track['Obs'];

                    for(var o = 0; o < obs.length; o++)
                    {
                        google_line = [];
                        for(var j = 0; j < obs[o].length; j++)
                        {
                            point = obs[o][j].split(",");
                            google_line[j] = new googlemaps.LatLng(point[0], point[1]);
                        }
                        if(google_line.length>0)
                        {
                            new googlemaps.Polyline({
                                path: google_line,
                                map: map,
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.5,
                                strokeWeight: 2,
                                zIndex: 10
                            });
                        }
                    }

                    // tee
                    var tee_rectangle = track['TeeRectangle'];
                    google_line = Array();
                    for(var j = 0; j < tee_rectangle.length; j++)
                    {
                        point = tee_rectangle[j].split(",");
                        google_line[j] = new googlemaps.LatLng(point[0],point[1]);
                    }
                    mTee[mPathCount] = new googlemaps.Polygon({
                        path: google_line,
                        map: map,
                        strokeColor: '#1D5430',
                        strokeOpacity: 1,
                        strokeWeight: 0,
                        fillColor: '#6ABF64',
                        fillOpacity: 1,
                        zIndex: 11
                    });
                    googlemaps.event.addListener(mTee[mPathCount], 'mouseover', function(e) {
                        index = mTee.indexOf(this);
                        infoWindow.setPosition(e.latLng);
                        infoWindow.setContent(mTooltipText[index]);
                        infoWindow.open(map);
                    });

                    // basket
                    basket = track['Basket'];
                    point = basket.split(",");

                    mBasket[mPathCount] = new googlemaps.Circle({
                        strokeColor: '#FF6600',
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                        fillColor: '#FF6600',
                        fillOpacity: 1,
                        zIndex: 11,
                        map: map,
                        center: new googlemaps.LatLng(parseFloat(point[0]), parseFloat(point[1])),
                        radius: 1
                    });
                    googlemaps.event.addListener(mBasket[mPathCount], 'mouseover', function(e) {
                        index = mBasket.indexOf(this);
                        infoWindow.setPosition(e.latLng);
                        infoWindow.setContent(mTooltipText[index]);
                        infoWindow.open(map);
                    });
                    // 3m cicle
                    new googlemaps.Circle({
                        strokeColor: '#669999',
                        strokeOpacity: 0,
                        strokeWeight: 1,
                        fillColor: '#669999',
                        fillOpacity: 0.4,
                        zIndex: 10,
                        map: map,
                        center: new googlemaps.LatLng(parseFloat(point[0]), parseFloat(point[1])),
                        radius: 3
                    });
                    // 10m cicle
                    // new googlemaps.Circle({
                    //     strokeColor: '#669999',
                    //     strokeOpacity: 0,
                    //     strokeWeight: 1,
                    //     fillColor: '#669999',
                    //     fillOpacity: 0.4,
                    //     zIndex: 10,
                    //     map: map,
                    //     center: new googlemaps.LatLng(parseFloat(point[0]), parseFloat(point[1])),
                    //     radius: 10
                    // });


                    // labels
                    {
                        // calculate label position
                        length_13 = tracks[mPathCount]['Length'] / 3;


                        var path = mPath[mPathCount].getPath();
                        var p1;
                        var p2;
                        var d=0;
                        var d1=0;
                        for(var j = 0; j < path.length-1; j++)
                        {
                            p1 = path.getAt(j);
                            p2 = path.getAt(j+1);

                            d1 = getDistance(p1.lat(), p1.lng(), p2.lat(), p2.lng());

                            if(d + d1 > length_13) // we found the right line to place the marker with label
                            {
                                var d2 = length_13 - d;

                                tracks[i]['LabelLat'] = p1.lat() + (p2.lat() - p1.lat()) * d2/d1;
                                tracks[i]['LabelLng'] = p1.lng() + (p2.lng() - p1.lng()) * d2/d1;

                                var p_marker = new googlemaps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * d2/d1, p1.lng()+ (p2.lng() - p1.lng()) * d2/d1);

                                var image = 'https://discgolfmetrix.com/map/img/label3.png';

                                new googlemaps.Marker({
                                    position: p_marker,
                                    map: map,
                                    icon: {
                                        url: image,
                                        labelOrigin: { x: 12, y: 10},
                                        size: new googlemaps.Size(24, 20),
                                        origin: new googlemaps.Point(0, 0),
                                        anchor: new googlemaps.Point(12, 10)
                                    },
                                    label: {
                                        text: (name_alt ? name_alt : name),
                                        color: '#333333',
                                        fontSize: '12px'
                                    }
                                });

                                break;
                            }

                            d = d + d1;

                        }

                    }

                    mPathCount++;
                }
            }

            drawBaskets(tracks);

        });

    }

    function openInfoWindow(event) {
        //alert(this);
        infoWindow.setPosition(event.latLng);
        infoWindow.setContent('Mingi info');
        infoWindow.open(map);
    }
    function closeInfoWindow(event) {
        infoWindow.close();
    }

    function calculateDistances(start,end) {
        var stuDistances = {};

        stuDistances.metres = googlemaps.geometry.spherical.computeDistanceBetween(start, end);

        return stuDistances;
    }

    googlemaps.event.addDomListener(window, 'load', initialize);
 */
