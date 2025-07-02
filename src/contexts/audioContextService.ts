class AudioContextService {
  private static instance: AudioContext | null = null;
  private static gainNode: GainNode | null = null;

  static getInstance(): AudioContext {
    if (!this.instance) {
      this.instance = new AudioContext();
      this.setupGainNode();
    }
    return this.instance;
  }

  static setupGainNode() {
    if (!this.instance) return;
    this.gainNode = this.instance.createGain();
    this.gainNode.connect(this.instance.destination);
    this.gainNode.gain.value = 0.7;
  }

  static getGainNode(): GainNode {
    if (!this.gainNode) {
      this.setupGainNode();
    }
    return this.gainNode!;
  }

  static setVolume(volume: number) {
    const gainNode = this.getGainNode();
    if (gainNode) {
      const normalizedVolume = Math.max(0.0001, volume / 100);
      gainNode.gain.setValueAtTime(
        normalizedVolume,
        this.getInstance().currentTime
      );
    }
  }

  static toggleMute(isMuted: boolean, volume: number) {
    const gainNode = this.getGainNode();
    if (gainNode) {
      const value = isMuted ? 0 : volume / 100;
      const normalizedVolume = Math.max(0.0001, value);
      gainNode.gain.setValueAtTime(
        normalizedVolume,
        this.getInstance().currentTime
      );
    }
  }

  static resumeContext() {
    const context = this.getInstance();
    if (context.state === 'suspended') {
      context.resume();
    }
  }
}

export default AudioContextService;
