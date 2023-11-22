import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, PermissionsAndroid, FlatList } from 'react-native';
import { Button, Icon } from 'react-native-elements';

const MarcadoresMaravilhas = ({ maravilhas, moverParaMaravilha }) => (
  <>
    {maravilhas.map((maravilha, index) => (
      <Marker
        key={index}
        coordinate={maravilha.coordinates}
        title={maravilha.name}
        description={maravilha.country}
      />
    ))}
  </>
);

const BotoesMaravilhas = ({ maravilhas, moverParaMaravilha }) => (
  <FlatList
    data={maravilhas}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => (
      <Button
        key={index}
        icon={<Icon name="flag" type="font-awesome" size={15} color="white" />}
        title={`${item.flag} ${item.name}`}
        buttonStyle={styles.button}
        onPress={() => moverParaMaravilha(item.coordinates)}
      />
    )}
    numColumns={2}
  />
);

export default function App() {
  const [region, setRegion] = useState({
    latitude: -14.2350,
    longitude: -51.9253,
    latitudeDelta: 60,
    longitudeDelta: 60,
  });

  const maravilhas = [
    {
      name: 'Cristo Redentor',
      country: 'Brazil',
      flag: '🇧🇷',
      coordinates: { latitude: -22.9519, longitude: -43.1658 },
    },
    {
      name: 'Machu Picchu',
      country: 'Peru',
      flag: '🇵🇪',
      coordinates: { latitude: -13.1631, longitude: -72.5450 },
    },
    {
      name: 'Chichén Itzá',
      country: 'Mexico',
      flag: '🇲🇽',
      coordinates: { latitude: 20.6830, longitude: -88.5713 },
    },
    {
      name: 'Coliseu',
      country: 'Italy',
      flag: '🇮🇹',
      coordinates: { latitude: 41.8902, longitude: 12.4922 },
    },
    {
      name: 'Ruínas de Petra',
      country: 'Jordan',
      flag: '🇯🇴',
      coordinates: { latitude: 30.3285, longitude: 35.4428 },
    },
    {
      name: 'Taj Mahal',
      country: 'India',
      flag: '🇮🇳',
      coordinates: { latitude: 27.1750, longitude: 78.0422 },
    },
    {
      name: 'Grande Muralha da China',
      country: 'China',
      flag: '🇨🇳',
      coordinates: { latitude: 40.4319, longitude: 116.5704 },
    },
  ];

  useEffect(() => {
    const solicitarPermissaoLocalizacao = async () => {
      try {
        const concedido = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (concedido === PermissionsAndroid.RESULTS.concedido) {
          const posicao = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentposicao(
              resolve,
              reject,
              { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
          });

          const { latitude, longitude } = posicao.coords;
          setRegion({ ...region, latitude, longitude });
        } else {
          console.log('Permissão de localização negada');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    solicitarPermissaoLocalizacao();
  }, []);

  const moverParaMaravilha = (coordinates) => {
    setRegion({ ...region, ...coordinates });
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <MarcadoresMaravilhas maravilhas={maravilhas} />
      </MapView>

      <View style={styles.buttonContainer}>
        <BotoesMaravilhas maravilhas={maravilhas} moverParaMaravilha={moverParaMaravilha} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 120,
    marginBottom: 100,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    margin: 5,
    backgroundColor: '#1E2DFF',
    borderRadius: 9,
  },
});
