import React from "react";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStack } from "./src/navigation";

interface InitialProps {
   [key: string]: string;
}

const App = (initialProps:InitialProps) => {
  console.log(initialProps['rntoken']);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
