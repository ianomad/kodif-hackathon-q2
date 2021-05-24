/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {
  useEffect,
  useState,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  Button,
  useColorScheme,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const SERVER_ENDPOINT = 'http://127.0.0.1:3000/ui.json';

const fetchUI = (setter, callback) => {
  fetch(SERVER_ENDPOINT)
    .then((response) => response.json())
    .then((json) => {
      console.log('response received');
      setter(json.ui);
    })
    .catch((error) => {
      console.log('error response received');
      console.error(error)
    })
    .finally(callback);
};

const UIKit = (props) => {

  const item = props.item;
  const type = item.type;

  const children = item.children ? item.children.map((item, index) => {
    return (
      <UIKit item={item} key={index} />
    )
  }) : <View />;

  /**
   * Mapping of UIKit contract to react-native components
   */
  if (type === 'View') {
    return (<View {...item.props}
      style={item.style}>
      {item.content}
      {children}
    </View>);
  } else if (type === 'Text') {
    return (<Text {...item.props}
      style={item.style}>
      {item.content}
      {children}
    </Text>);
  } else if (type === 'Button') {
    return (<Button {...item.props}
      style={item.style}>
      {item.content}
      {children}
    </Button>);
  } else if (type === 'Image') {
    return (<Image
      {...item.props}
      source={{ uri: item.src }}
      style={item.style}
    >
      {item.content}
    </Image>);
  }

  return (<Text>
    Unknown UIKit {type}
  </Text>);
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('requesting...');
    fetchUI(setData, () => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>

          <View style={{ flex: 1, padding: 24 }}>
            {isLoading ? <ActivityIndicator /> : (
              <FlatList
                data={data}
                renderItem={({ item, index }) => (
                  <UIKit item={item} key={index} />
                )}
              />
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
