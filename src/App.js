import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Map, {useControl, Marker} from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { BsBellFill, BsBell } from 'react-icons/bs';
import 'mapbox-gl/dist/mapbox-gl.css';
import inside from 'point-in-polygon-hao'
import { API } from 'aws-amplify';

var classNames = require('classnames');


function App() {

  return (
    <div className="App">
      <h1 className="Title"><span className="Title-first">park</span><span className="Title-second">n</span></h1>
      <ParknMap/>
      <div className="BottomContent">
        <p>About | Join</p>
        <p>Made with <span className="BottomContent-loveHeart">&lt;3</span></p>
      </div>
    </div>
  );
}

function ParknMap(props) {
  useEffect(() => {
    const apiName = 'apie0e8399f';
    const path = '/spaces';
    const myInit = {}

        API.get(apiName, path, myInit)
      .then((response) => {
        setLatestParkingReports(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  })

  const [latestParkingReports, setLatestParkingReports] = useState([])

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [subscribedWebcamIds, setSubscribedWebcamIds] = useState([])
  const [drawingSubscriptionArea, setDrawingSubscriptionArea] = useState(false);

  const mapRef = React.useRef();

  const onMapLoad = React.useCallback(() => {
    mapRef.current.on('draw.create', (e) => {
      const polygon = e.features[0].geometry.coordinates;
      let subbedIds = [];
      for (let report of latestParkingReports) {
        if (inside(report.location, polygon)) {
          subbedIds.push(report.id);
        }
      }
      setSubscribedWebcamIds(subbedIds);

      setDrawingSubscriptionArea(false);
      mapRef.current.getMap()["doubleClickZoom"].enable()
      setNotificationsEnabled(true);
    });
    }, []);

  const handleNotificationsClick = () => {
    if (drawingSubscriptionArea) {
      setNotificationsEnabled(false);
      setDrawingSubscriptionArea(false);
      mapRef.current.getMap()["doubleClickZoom"].enable()
      return
    }

    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      mapRef.current.getMap()["doubleClickZoom"].enable();
      return
    }

    setDrawingSubscriptionArea(true);
    mapRef.current.getMap()["doubleClickZoom"].disable()
  }

  return (
          <div className="Map">
            <div className="Notifications" onClick={handleNotificationsClick}>
              <div className="Notifications-inner">
                {
                  (drawingSubscriptionArea || notificationsEnabled) ? <BsBellFill className={classNames({
                    'Notifications-inner--active': notificationsEnabled,
                    'Notifications-inner--drawing': drawingSubscriptionArea,
                  })}/> : <BsBell/>
                }
              </div>
            </div>
            <Map
              initialViewState={{
              longitude: -2.380648016392195,
                latitude: 51.3772087462643,
                zoom: 15
            }}
              style={{height: '55vh'}}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              mapboxAccessToken="pk.eyJ1Ijoiam9laGQiLCJhIjoiY2xmeWltMXQwMDU3ZDNnbXRmdHZwaTJ1biJ9.mQSsSFiAuy7APNzYxa7cWg"
              ref={mapRef} onLoad={onMapLoad}
            >
              {drawingSubscriptionArea && <DrawControl
                displayControlsDefault={false}
                defaultMode="draw_polygon"
            />}
              {
              latestParkingReports.map(item =>
                <Marker key={item.WebcamID} longitude={item.Location[0]} latitude={item.Location[1]} color={!item.spaces ? "#EF476F" : "#06D6A0"} />
              )
              }
              </Map>
          </div>
          );
}

function DrawControl(props) {
  useControl(() => new MapboxDraw(props), {
    position: props.position
  });

  return null;
}

export default App;
