import TrackPlayer from 'react-native-track-player';

describe('Sound', () => {
  it('call scanMelody', () => {
    TrackPlayer.play();
    expect(TrackPlayer.play).toHaveBeenCalled();
  });
});
