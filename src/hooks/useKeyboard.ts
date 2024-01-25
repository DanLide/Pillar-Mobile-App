import { useEffect, useRef } from 'react';
import {
  EmitterSubscription,
  Keyboard,
  KeyboardEventListener,
  KeyboardEventName,
} from 'react-native';

type Callbacks = {
  [K in KeyboardEventName]?: KeyboardEventListener;
};

const useKeyboard = (callbacks: Callbacks) => {
  const subscriptions = useRef<EmitterSubscription[]>([]);

  useEffect(() => {
    Object.entries(callbacks).forEach(([event, callback]) => {
      const subscription = Keyboard.addListener(
        event as KeyboardEventName,
        callback,
      );
      subscriptions.current.push(subscription);
    });

    return () => {
      subscriptions.current.forEach(subscription => {
        subscription.remove();
      });

      subscriptions.current = [];
    };
  }, []);
};

export default useKeyboard;
