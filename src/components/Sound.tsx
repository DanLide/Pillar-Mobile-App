import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
} from 'react-native-track-player';

const beepSound = {
  id: '1',
  url: require('../../assets/sounds/beep.wav'),
};

export async function setupPlayer() {
  try {
    await TrackPlayer.getCurrentTrack();
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [Capability.Play],
      compactCapabilities: [Capability.Play],
      progressUpdateEventInterval: 2,
    });
  }
}

export async function addTracks() {
  await TrackPlayer.add([beepSound]);
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    addTracks();
  });
}
