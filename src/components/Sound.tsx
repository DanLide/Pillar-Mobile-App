import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event
} from 'react-native-track-player';

const beepSound = {
  id: '1',
  url: require('../../assets/sounds/beep.wav'),
}

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  }
  catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
      ],
      compactCapabilities: [
        Capability.Play,
      ],
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  }
  finally {
    return isSetup;
  }
}

export async function addTracks() {
  await TrackPlayer.add([
    beepSound,
  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    addTracks();
  });
}