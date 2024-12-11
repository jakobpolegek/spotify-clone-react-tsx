class AudioContextService {
  private static instance: AudioContext | null = null;

  static getInstance(): AudioContext {
    if (!this.instance) {
      this.instance = new AudioContext();
    }
    return this.instance;
  }

  // Optional: Add methods for resuming audio context if needed
  static resumeContext() {
    const context = this.getInstance();
    if (context.state === "suspended") {
      context.resume();
    }
  }
}

export default AudioContextService;
