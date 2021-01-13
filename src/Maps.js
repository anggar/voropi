import React from 'react';
import { Dimensions, View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Geojson, Marker, Circle, Overlay } from "react-native-maps";
import { VictoryChart, VictoryVoronoi, VictoryTheme } from "victory-native";
import { Pinpoint } from "./SvgMarker";
// import {  } from "react-native-gesture-handler";
import BottomSheet from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CitySolo from "./solo-fine.json";
import PointFuel from "./pt-fuel.json";
import PointPolice from "./pt-police.json";
import PointMosque from "./pt-mosque.json";
import PointParking from "./pt-parking.json";



const { width, height } = Dimensions.get("window")

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

const Markers = ({point, label, nested, identifiable}) => {
  let image;

  switch(label.toLowerCase()) {
    case 'mosque': image = require('./mosque.png'); break;
    case 'police': image = require('./police.png'); break;
    case 'parking': image = require('./parking.png'); break;
    default: image = require('./marker.png');
  };

  return (
  <>
    {point.features.map((pt, index) => (
        <Marker key={index} 
          title={identifiable ?  (pt.properties.name || label) : label}
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

const Heading = ({text, children, Next}) => (
  <View>
    <View style={{flexDirection: "row"}}>
      <Text style={styles.textHeading}>{text}</Text>
      {Next}
    </View>
    {children}
  </View>
);

const IconGrid = ({name, text, color}) => (
  <View style={{margin: 8}}>
    <Icon color="gray" name={name} size={36} />
    <Text style={{color: "gray"}} >{text}</Text>
  </View>
);

const Maps = () => {
  const cityBox = CitySolo;

  const [radius, setRadius] = React.useState(100);
  const [drawerIdx, setDrawerIdx] = React.useState(2);

  const bsRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['5%', '20%', '30%'], []);
  const nSnapPoints = 3;

  const NextRadius = () => (<>
    <Text style={styles.textHeadingNext}>{radius} m from centroid</Text>
  </>)

  const NextAmenities = () => (<>
    <View style={{flex: 1}}></View>
    <Button style={styles.buttonDrawer} title="Toggle drawer" 
      onPress={() => {
        let newIdx = (drawerIdx + 1) % (nSnapPoints);
        setDrawerIdx(newIdx);
        bsRef.current.snapTo(newIdx);
      }}/>
    <View style={{width: 16}}></View>
  </>)

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
      <Markers point={PointFuel} label="SPBU" nested identifiable />
      <Markers point={PointMosque} label="Mosque" />
      <Markers point={PointPolice} label="Police" nested identifiable />
      <Markers point={PointParking} label="Parking" nested identifiable />
      
      <Circles features={[PointFuel.features, PointMosque.features]} radius={radius} />
    </MapView>
    <BottomSheet
        style={{position: "absolute"}}
        ref={bsRef}
        key="bsss"
        index={drawerIdx}
        snapPoints={snapPoints}
      >
        <Heading text="Amenities" Next={<NextAmenities />}>
          <View style={{margin: 16, margin: 8, flexDirection: "row"}}>
            <IconGrid name="police-badge-outline" text="Police" color="black" />
            <IconGrid name="weather-night" text="Mosque" color="green" />
            <IconGrid name="gas-station-outline" text="Gas" color="red" />
            <IconGrid name="parking" text="Parking" color="orange" />

          </View>
        </Heading>
        <Heading text="Radius" Next={<NextRadius />}>
          <Slider
            style={{width: width, height: 40}}
            minimumValue={100}
            maximumValue={1000}
            step={100}
            minimumTrackTintColor="#666666"
            maximumTrackTintColor="#000000"
            onValueChange={v => setRadius(v)}
          />
        </Heading>
      </BottomSheet>
    </>
    
  )
};
  

const styles = StyleSheet.create({
  textHeading: {
    color: "black", fontWeight: "bold",
    margin: 4, fontSize: 16,
    marginHorizontal: 16,
  },
  textHeadingNext: {
    color: "gray",
    margin: 4, fontSize: 16,
    marginHorizontal: 16,
  },
  buttonDrawer: {
    paddingEnd: 8,
  }
})

export default Maps;