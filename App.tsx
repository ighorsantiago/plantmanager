import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';

import * as Notifictions from 'expo-notifications';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost'

import {PlantProps} from './src/libs/storage';

import Routes from './src/routes';

export default function App() {

  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    // const subscription = Notifictions.addNotificationReceivedListener(
    //   async notification => {
    //     const data = notification.request.content.data.plant as PlantProps;
    //   }
    // )

    // return () => subscription.remove();

    async function notifications() {
      const data = await Notifictions.getAllScheduledNotificationsAsync();
      console.log('############### AGENDADAS ###############')
      console.log(data)
    }
  }, []);

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <Routes />
  )
}