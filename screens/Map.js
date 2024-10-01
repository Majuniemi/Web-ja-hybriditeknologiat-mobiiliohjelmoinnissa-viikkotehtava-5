import { StyleSheet, Platform, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import Constants from 'expo-constants'

export default function Map() {

    const [location, setLocation] = useState({
        latitude: 65.0800,
        longitude: 25.4800,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
    })

    const [markers, setMarkers] = useState([])

    useEffect(() => {
        (async () => {
            getUserPosition()
        })()
    }, [])

    const getUserPosition = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()

        try {
            if (status !== 'granted') {
                console.log('Geolocation not granted')
                return
            }
            const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
            setLocation({ ...location, latitude: position.coords.latitude, longitude: position.coords.longitude })
        } catch (error) {
            console.log('Error getting user position:', error)
        }
    }

    const showMarker = (e) => {
        const coords = e.nativeEvent.coordinate
        setMarkers([...markers, coords])
        console.log('Marker:', coords)
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={location}
                mapType='standard'
                onLongPress={showMarker}
            >
                {
                    markers.map((marker) => (
                        <Marker
                            title='My Marker'
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        />
                    ))}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
    },
    map: {
        height: '100%',
        width: '100%'
    },
});