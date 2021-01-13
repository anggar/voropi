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

const Circles = ({points, radius}) => {
  const features = points.map(i => i.features)

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
  let nnested = nested;
  let nidentifiable = identifiable;

  switch(label.toLowerCase()) {
    case 'mosque': 
      image = require('./mosque.png'); 
      nnested = false;
      nidentifiable = false;
      break;
    case 'police': image = require('./police.png'); break;
    case 'parking': image = require('./parking.png'); break;
    default: image = require('./marker.png');
  };

  return (
  <>
    {point.features.map((pt, index) => (
        <Marker key={index} 
          title={nidentifiable ?  (pt.properties.name || label) : label}
          image={image}
          coordinate={{
            latitude: nnested ? pt.geometry.coordinates[0][1] : pt.geometry.coordinates[1], 
            longitude: nnested ? pt.geometry.coordinates[0][0] : pt.geometry.coordinates[0]}}/>
      ))}
  </>
)}

Markers.defaultProps = {
  nested: true,
  identifiable: true,
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

const Maps = () => {
  const cityBox = CitySolo;

  const [radius, setRadius] = React.useState(100);
  const [drawerIdx, setDrawerIdx] = React.useState(2);

  const keys = ["Gas", "Parking", "Mosque", "Police"];

  const initialActiveState = {
    "Gas": true,
    "Parking": true,
    "Mosque": true,
    "Police": false,
  }

  const activeStateColor = {
    "Gas": "red",
    "Parking": "orange",
    "Mosque": "green",
    "Police": "black",
  }

  const activeStatePoint = {
    "Gas": PointFuel,
    "Parking": PointParking,
    "Mosque": PointMosque,
    "Police": PointPolice,
  }

  const [activeState, setActiveState] = React.useState(initialActiveState);
  const [asf, setAsf] = React.useState(true);

  const bsRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['5%', '20%', '30%'], []);
  const nSnapPoints = 3;

  const onIconPress = (name) => {
    let nas = activeState;
    nas[`${name}`] = !nas[`${name}`];

    console.log(nas);
    setActiveState(nas);
    setAsf(!asf);
  }

  const IconGrid = ({name, text, color}) => (
    <View style={{margin: 8}} onTouchEndCapture={() => onIconPress(text)}>
      <Icon color={activeState[text] ? activeStateColor[text] : "gray"} name={name} size={36} />
      <Text style={{color: activeState[text] ? activeStateColor[text] : "gray"}} >{text}</Text>
    </View>
  );

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

  const Markey = React.useCallback(({as}) => (
    <>
      {keys.map(i => {  
        if(!activeState[i]) return <></>;

        return (<Markers as={activeState} point={activeStatePoint[i]} label={i} />) 
      })}
      
      
      <Circles as={activeState} points={keys.filter(i => activeState[i]).map(i =>  activeStatePoint[i])} radius={radius} />
    </>
  ), [asf, radius]);

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
      <Markey as={activeState} />
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