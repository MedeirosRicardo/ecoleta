import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface State {
  code: string;
  term: string;
  description: string;
}

interface States {
  definitions: State[]
}

interface City {
  id: string;
  name: string;
}

interface Cities {
  items: City[]
}

const Home = () => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedState, setSelectedState] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get<States>('http://geogratis.gc.ca/services/geoname/en/codes/province.json').then(response => {
      const result = response.data.definitions.map((state: State) => (
        {
          code: state.code,
          term: state.term,
          description: state.description
        }
      ));
      const sortedStates = result.splice(0, 13).sort((a: State, b: State) => a.description > b.description ? 1 : -1);
      setStates(sortedStates);
    });
  }, []);

  useEffect(() => {
    if (selectedState === '0') return;
    axios.get<Cities>(`http://geogratis.gc.ca/services/geoname/en/geonames.json?province=${selectedState}&concise=CITY&concise=TOWN&concise=UNP`).then(response => {
      const cityNames = response.data.items.map((city: City) => (
        {
          id: city.id,
          name: city.name
        }
      ));
      const sortedCities = cityNames.sort((a: City, b: City) => a.name > b.name ? 1 : -1);
      setCities(sortedCities);
    });
  }, [selectedState]);

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      state: selectedState,
      city: selectedCity
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Your waste collection point</Text>
            <Text style={styles.description}>We help people to find the right place to dispose their recycles</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 20,
                right: 5
              }
            }}
            placeholder={{ label: 'Select a Province' }}
            items={states.map(state => (
              {
                label: state.description,
                value: [state.code, state.term]
              }
            ))}
            onValueChange={value => setSelectedState(value)}
            useNativeAndroidPickerStyle={false}
          />

          <RNPickerSelect
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 20,
                right: 5
              }
            }}
            placeholder={{ label: 'Select a City' }}
            items={cities.map(city => (
              {
                label: city.name,
                value: city.name
              }
            ))}
            onValueChange={value => setSelectedCity(value)}
            useNativeAndroidPickerStyle={false}
          />
          
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Enter
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16  
  },

  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16
  }
});

export default Home;