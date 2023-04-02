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

  const ditchCarbonMileCo2Kg = 0.29203;
  const goofyConversions = {
    "rubber ducks": 0.0198,
    "jelly beans": 0.002,
    "ping pong balls": 0.01,
    "bananas": 0.01,
    "pencils": 0.005,
    "pizzas": 0.05,
    "bagsof popcorn": 0.025,
    "cups of tea": 0.24
  }

  const timestampInSeconds = 1680422616;

  const minutesSinceTimestamp = (timestampInSeconds) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const elapsedSeconds = currentTimeInSeconds - timestampInSeconds;
    return Math.floor(elapsedSeconds / 60);
  }

  const minsPerMile = 10;

  const co2Saved = () => {
    const mins = minutesSinceTimestamp(timestampInSeconds)
    const co2 = ditchCarbonMileCo2Kg * (mins / minsPerMile);
    return co2
  }

  const selectGoofyUnit = () => {
    const keys = Object.keys(goofyConversions);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }

  const [goofyUnit, setGoofyUnit] = useState();
  const [goofyNumber, setGoofyNumber] = useState();

  useEffect(() => {
    const unit = selectGoofyUnit()
    setGoofyUnit(unit);
    setGoofyNumber(co2Saved() / goofyConversions[unit]);
  }, [])


  if (goofyUnit == undefined) {
    return;
  }

  return (
    <div className="App">
      <h1 className="Title"><span className="Title-first">park</span><span className="Title-second">n</span></h1>
      <ParknMap/>
      <div className="CarbonSavings">
        {goofyNumber.toFixed(1)} {goofyUnit} in weight of co2 saved so far!
      </div>
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
              longitude: -2.355089926070656,
                latitude: 51.377153913029645,
                zoom: 11
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
