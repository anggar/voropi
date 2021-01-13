import React from 'react';
import { Dimensions, View } from 'react-native';
import MapView, { Geojson, Marker, Circle, Overlay } from "react-native-maps";
import { VictoryChart, VictoryVoronoi, VictoryTheme } from "victory-native";
import { Pinpoint } from "./SvgMarker";
import CitySolo from "./solo-fine.json";
import PointFuel from "./pt-fuel.json";
import PointMosque from "./pt-mosque.json";


const { width, height } = Dimensions.get("window")
// const ptFuel = PointFuel.features.map(i => i);
// const coordFuelData = ptFuel.map(i => i.geometry.coordinates).map(i => ({x: i[0][1], y: i[0][0]}))

// const getFeatures = point => point.features.map(i => i);


const Circles = ({features, radius}) => {
  let selectedFeature = [];
  let currentLength = 999;
  for (const feature of features) {
    if (feature.length < currentLength) {
      selectedFeature = feature;
      currentLength = feature.length;
    }
  }

  return (<>
    {selectedFeature.map(i => {
      let latlng;

      if (i.geometry.coordinates.length != 1) {
        latlng = {latitude: i.geometry.coordinates[1], longitude: i.geometry.coordinates[0]};
      } else {
        latlng = {latitude: i.geometry.coordinates[0][1], longitude: i.geometry.coordinates[0][0]};
      }
      
      return (
        <Circle center={latlng} radius={radius} 
          fillColor="#ff000022" strokeColor="#00000022" />
    )})}
  </>)
}

Circles.defaultProps = {
  radius: 100
}

const Markers = ({point, color, label, nested, identifiable}) => {
  let image;

  switch(label.toLowerCase()) {
    case 'mosque': image = require('./mosque.png'); break;
    default: image = require('./marker.png');
  };

  return (
  <>
    {point.features.map((pt, index) => (
        <Marker key={index} 
          title={identifiable ?  (pt.properties.name || label) : label}
          pinColor={color}
          image={image}
          coordinate={{
            latitude: nested ? pt.geometry.coordinates[0][1] : pt.geometry.coordinates[1], 
            longitude: nested ? pt.geometry.coordinates[0][0] : pt.geometry.coordinates[0]}}/>
      ))}
  </>
)}

Markers.defaultProps = {
  nested: false,
  identifiable: false,
}

const Maps = () => {
  const cityBox = CitySolo;

  return (
    <>
    <MapView
      style={{width: width, height: height}} 
      initialRegion={{
        latitude: -7.5755,
        longitude: 110.8243,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Geojson 
        geojson={cityBox} 
        strokeColor="blue"
        fillColor="#0000ff22"
        strokeWidth={2}
      />
      <Markers point={PointFuel} color="red" label="SPBU" nested identifiable />
      <Markers point={PointMosque} color="blue" label="Mosque" />
      <Circles features={[PointFuel.features, PointMosque.features]}/>
    </MapView>
    </>
  )
};
  
export default Maps;