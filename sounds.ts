export const playCompleteSound = () => {
  const audio = new Audio("/complete.mp3") // You would need to add this sound file
  audio.volume = 0.5
  audio.play().catch(() => {
    // Ignore errors if sound can't be played
  })
}

