import { createMemo } from "solid-js";
import { useGoogleMapsMapsLibrary } from "./mapsLibraryProvider";

export function GoogleMapsRender() {
  const lib = useGoogleMapsMapsLibrary();
  const mapContainer = (
    <div style={{ width: "500px", height: "500px" }} />
  ) as HTMLDivElement;

  const map = createMemo(() => {
    return new lib.mapsLibrary.Map(mapContainer, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  });

  return <>{mapContainer}</>;
}

// Original script that renders the course map
/*
    avg_lat=parseFloat("54.688502908355");
    avg_lon=parseFloat("25.366559522359");
    lang_length = "Length";
    lang_number_short = "No";
    unit = "m";

    var map;
    var infoWindow = new google.maps.InfoWindow();

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
            center: new google.maps.LatLng(54.688502908355,25.366559522359),
            mapTypeId: google.maps.MapTypeId.HYBRID,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        google.maps.event.addListener(map, 'click', function(e) {
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
                    google_line[j] = new google.maps.LatLng(point[0],point[1]);

                }
                mObCount++;
                mOb[mObCount] = new google.maps.Polyline({
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
                google_line[0] = new google.maps.LatLng(lat1,lon1);
                mForest[0] = new google.maps.Polygon({
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
                                google_line[j] = new google.maps.LatLng(point[0],point[1]);
                            }
                            mDropzone[mDropzoneCount] = new google.maps.Polygon({
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
                            google_line[j] = new google.maps.LatLng(point[0],point[1]);
                        }
                        mFairway[mFairwayCount] = new google.maps.Polygon({
                            path: google_line,
                            map: map,
                            strokeColor: '#FFFFFF',
                            strokeOpacity: 0,
                            strokeWeight: 0,
                            fillColor: '#FFFFFF',
                            fillOpacity: 0.2,
                            zIndex: 1
                        });
                        //google.maps.event.addListener(mFairway[mFairwayCount], 'mouseover', function(e) {
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
                        google_line[j] = new google.maps.LatLng(point[0],point[1]);

                        if(j>0)
                        {
                            distance += getDistance(google_line[j-1].lat(), google_line[j-1].lng(), google_line[j].lat(), google_line[j].lng());
                        }

                    }
                    tracks[i]['Length'] = track['Length'];


                    mPath[mPathCount] = new google.maps.Polyline({
                        path: google_line,
                        map: map,
                        geodesic: true,
                        strokeColor: '#FFFFFF',
                        strokeOpacity: 0.5,
                        strokeWeight: 3,
                        zIndex: 10
                    });
                    google.maps.event.addListener(mPath[mPathCount], 'mouseover', function(e) {
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
                            google_line[j] = new google.maps.LatLng(point[0], point[1]);
                        }
                        if(google_line.length>0)
                        {
                            new google.maps.Polyline({
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
                        google_line[j] = new google.maps.LatLng(point[0],point[1]);
                    }
                    mTee[mPathCount] = new google.maps.Polygon({
                        path: google_line,
                        map: map,
                        strokeColor: '#1D5430',
                        strokeOpacity: 1,
                        strokeWeight: 0,
                        fillColor: '#6ABF64',
                        fillOpacity: 1,
                        zIndex: 11
                    });
                    google.maps.event.addListener(mTee[mPathCount], 'mouseover', function(e) {
                        index = mTee.indexOf(this);
                        infoWindow.setPosition(e.latLng);
                        infoWindow.setContent(mTooltipText[index]);
                        infoWindow.open(map);
                    });

                    // basket
                    basket = track['Basket'];
                    point = basket.split(",");

                    mBasket[mPathCount] = new google.maps.Circle({
                        strokeColor: '#FF6600',
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                        fillColor: '#FF6600',
                        fillOpacity: 1,
                        zIndex: 11,
                        map: map,
                        center: new google.maps.LatLng(parseFloat(point[0]), parseFloat(point[1])),
                        radius: 1
                    });
                    google.maps.event.addListener(mBasket[mPathCount], 'mouseover', function(e) {
                        index = mBasket.indexOf(this);
                        infoWindow.setPosition(e.latLng);
                        infoWindow.setContent(mTooltipText[index]);
                        infoWindow.open(map);
                    });
                    // 3m cicle
                    new google.maps.Circle({
                        strokeColor: '#669999',
                        strokeOpacity: 0,
                        strokeWeight: 1,
                        fillColor: '#669999',
                        fillOpacity: 0.4,
                        zIndex: 10,
                        map: map,
                        center: new google.maps.LatLng(parseFloat(point[0]), parseFloat(point[1])),
                        radius: 3
                    });
                    // 10m cicle
                    // new google.maps.Circle({
                    //     strokeColor: '#669999',
                    //     strokeOpacity: 0,
                    //     strokeWeight: 1,
                    //     fillColor: '#669999',
                    //     fillOpacity: 0.4,
                    //     zIndex: 10,
                    //     map: map,
                    //     center: new google.maps.LatLng(parseFloat(point[0]), parseFloat(point[1])),
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

                                var p_marker = new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * d2/d1, p1.lng()+ (p2.lng() - p1.lng()) * d2/d1);

                                var image = 'https://discgolfmetrix.com/map/img/label3.png';

                                new google.maps.Marker({
                                    position: p_marker,
                                    map: map,
                                    icon: {
                                        url: image,
                                        labelOrigin: { x: 12, y: 10},
                                        size: new google.maps.Size(24, 20),
                                        origin: new google.maps.Point(0, 0),
                                        anchor: new google.maps.Point(12, 10)
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

        stuDistances.metres = google.maps.geometry.spherical.computeDistanceBetween(start, end);

        return stuDistances;
    }

    google.maps.event.addDomListener(window, 'load', initialize);
 */
