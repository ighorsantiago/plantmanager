import React, { useEffect, useState } from 'react';
import {View, Text, Image, Alert, FlatList, StyleSheet} from 'react-native';

import {Header} from '../components/Header';
import { PlantCardSecundary } from '../components/PlantCardSecundary';
import { Load } from '../components/Load';

import { loadPlant, PlantProps, removePlant } from '../libs/storage';

import {formatDistance} from 'date-fns'
import {pt} from 'date-fns/locale'

import waterdrop from '../assets/waterdrop.png'

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {

  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        {locale: pt}
      );

      setNextWatered(
        `Não se esqueça de regar a ${plantsStoraged[0].name} às ${nextTime} horas`
      );

      setMyPlants(plantsStoraged);
      setLoading(false);
    }

    loadStorageData();
  }, []);

  function handleRemove(plant: PlantProps) {
    Alert.alert(
      'Remover',
      `Deseja remover a ${plant.name}?`,
      [
        {text: 'Não 🙏🏻', style: 'cancel'},
        {text: 'Sim 😢', onPress: async () => {
          try {
            setMyPlants((oldData) =>
              oldData.filter((item) => item.id !== plant.id)
            );

          } catch (error) {
            Alert.alert('Não foi possível remover! 😢');
          }
        }},
      ]
    )
  }

  if(loading) {return <Load />}

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spolight}>
        <Image
          source={waterdrop}
          style={styles.spolightImage}
        />
        <Text style={styles.spolightText} >
          {nextWatered}
        </Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          //contentContainerStyle={{flex: 1}}
          renderItem={({item}) => (
            <PlantCardSecundary
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spolight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spolightImage: {
    width: 60,
    height: 60,
  },
  spolightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});