import Sound from 'react-native-sound';

import beep from '../../assets/sounds/beep.wav'

Sound.setCategory('Playback');

const scanMelody = new Sound(beep, '', (error) => {
  if (error) {
    console.error("failed to load the sound", error);
    return;
  }
})

export {
  scanMelody
}
