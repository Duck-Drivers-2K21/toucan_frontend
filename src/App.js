import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9laGQiLCJhIjoiY2xmeWF5eGluMHB2bDNocXlrODZzZGF3cCJ9.HBhG4s0nCphc0-WQqRwjmA';

function App() {

  return (
    <div className="App">
      <h1 className="Title"><span className="Title-first">park</span><span className="Title-second">n</span></h1>
      <Map/>
      <div className="BottomContent">
        <p>About | Join</p>
        <p>Made with <span className="BottomContent-loveHeart">&lt;3</span></p>
      </div>
    </div>
  );
}

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-2.380683848855683);
  const [lat, setLat] = useState(51.37721907131301);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
          <div className="Map">
            <div ref={mapContainer} className="map-container" />
          </div>
          );
}

export default App;
