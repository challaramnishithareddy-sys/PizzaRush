/**
 * Lightweight Sound Manager Architecture for optional UI audio feedback.
 * Features an explicit toggle (default false), zero autoplay, and non-blocking safety.
 */

export type SoundEvent = 'click' | 'toppingDrop' | 'toppingRemove' | 'cameraRotate' | 'orderSuccess';

class SoundManager {
  private enabled = false;

  /** Toggle audio effects on/off */
  public setEnabled(enable: boolean): void {
    this.enabled = enable;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /** Play UI sound event safely (no-op when disabled) */
  public play(event: SoundEvent): void {
    if (!this.enabled) return;

    try {
      // Sound architecture ready for audio clips when assets are provided
      // e.g. const audio = new Audio(`/sounds/${event}.mp3`); audio.play();
    } catch {
      // Non-critical audio failure fallback
    }
  }
}

export const soundManager = new SoundManager();
