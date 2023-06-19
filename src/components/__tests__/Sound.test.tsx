import Sound from 'react-native-sound';

import { scanMelody } from '../Sound';

describe('Sound', () => {
  it('call scanMelody', () => {
    scanMelody.play();
    expect(Sound.prototype.play).toHaveBeenCalled();
  });
});
