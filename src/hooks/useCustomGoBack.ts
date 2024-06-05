import { useEffect, DependencyList, useCallback } from 'react';
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

type TProps = {
  callback: (event: Event) => void;
  shouldUseDefaultGoBack?: boolean;
  shouldPreventDefault?: boolean;
  deps: DependencyList;
};

const useCustomGoBack = ({
  callback,
  shouldUseDefaultGoBack = false,
  shouldPreventDefault = true,
  deps,
}: TProps): void => {
  const navigation = useNavigation();

  const handleNavigationEvent = useCallback(
    (event: Event) => {
      const actionType = event.data.action.type;

      if (BACK_ACTIONS.includes(actionType)) {
        // in some cases we need to call together custom callback and the default
        if (shouldPreventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [callback, shouldPreventDefault],
  );

  useEffect(() => {
    if (!shouldUseDefaultGoBack) {
      navigation.addListener('beforeRemove', handleNavigationEvent);

      return () =>
        navigation.removeListener('beforeRemove', handleNavigationEvent);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, handleNavigationEvent, navigation, shouldUseDefaultGoBack]);
};

export default useCustomGoBack;
