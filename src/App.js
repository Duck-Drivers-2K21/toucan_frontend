import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Map, {useControl} from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { BsBellFill, BsBell } from 'react-icons/bs';
import 'mapbox-gl/dist/mapbox-gl.css';

var classNames = require('classnames');


function App() {

  const latestParkingReports = [{"location": {"lat": 0, "lng": 0},"spots": 1}, {"location": {"lat": 0, "lng": 0},"spots": 0}]

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
  const [notifications, setNotifications] = useState(false);
  const [drawingSubscriptionArea, setDrawingSubscriptionArea] = useState(false);

//  const mapRef = React.useRef();
//
//  const onMapLoad = React.useCallback(() => {
//    mapRef.current.on('draw.create', () => {
//      setDrawingSubscriptionArea(false);
//      setNotifications(true);
//    });
//    }, []);

  const handleNotificationsClick = () => {
    if (drawingSubscriptionArea) {
      setNotifications(false);
      return
    }

    if (notifications) {
      // Clear notifications
      setNotifications(false);
      return
    }

    setDrawingSubscriptionArea(true);
  }

  return (
          <div className="Map">
            <div className="Notifications" onClick={handleNotificationsClick}>
              <div className="Notifications-inner">
                {
                  (drawingSubscriptionArea || notifications) ? <BsBellFill className={classNames({
                    'Notifications-inner--active': notifications,
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
              mapboxAccessToken="pk.eyJ1Ijoiam9laGQiLCJhIjoiY2xmeWltMXQwMDU3ZDNnbXRmdHZwaTJ1biJ9.mQSsSFiAuy7APNzYxa7cWg"/>
          </div>
          );
}

export default App;
