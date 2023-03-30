import { useCallback, useState } from 'react';

const useSwitchState = (initState = false) => {
  const [isEnabled, setIsEnabled] = useState(initState);

  const toggleSwitch = useCallback(
    () => setIsEnabled(previousState => !previousState),
    [],
  );

  return [isEnabled, toggleSwitch] as const;
};

export default useSwitchState;
