import { useEffect } from 'react';
import { EventArg, useNavigation } from '@react-navigation/native';

const BACK_ACTIONS = ['POP', 'GO_BACK'];

type Event = EventArg<
  'beforeRemove',
  true,
  {
    action: Readonly<{
      type: string;
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
    }>;
  }
>;

interface Props {
  // use this property instead of calling navigation.goBack in callback
  shouldUseDefaultGoBack?: boolean;
  shouldPreventDefault?: boolean;
}

const useCustomGoBack = (
  callback: (event: Event) => void,
  { shouldUseDefaultGoBack = false, shouldPreventDefault = true }: Props = {},
  deps: Array<unknown> = [],
): void => {
  const navigation = useNavigation();

  const handleNavigationEvent = (event: Event) => {
    const actionType = event.data.action.type;

    if (BACK_ACTIONS.includes(actionType)) {
      // in some cases we need to call together custom callback and the default
      if (shouldPreventDefault) {
        event.preventDefault();
      }
      callback(event);
    }
  };

  useEffect(() => {
    if (!shouldUseDefaultGoBack) {
      navigation.addListener('beforeRemove', handleNavigationEvent);

      return () =>
        navigation.removeListener('beforeRemove', handleNavigationEvent);
    }
    return undefined;
  }, deps);
};

export default useCustomGoBack;
