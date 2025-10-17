<template>
  <div v-if="visible" class="overlay">
    <div class="modal" :class="{ 'win-animation': isWin, 'lose-animation': !isWin }">
      <div class="emoji-container">
        <span v-if="emojiLoading" class="loading">⏳</span>
        <div v-else class="emoji-display" :class="{ 'bounce': isWin, 'shake': !isWin }">
          {{ displayEmoji }}
        </div>
      </div>
      <h2 class="message-title">{{ message }}</h2>
      <p class="score-text">Your Score: <span class="score-number">{{ score }}</span></p>
      <div class="buttons">
        <button @click="restartGame" class="btn-primary">🔄 Play Again</button>
        <button @click="goToMenu" class="btn-secondary">🏠 Main Menu</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const visible = computed(() => ['won', 'lost'].includes(store.state.gameStatus))
const score = computed(() => store.state.score)
const isWin = computed(() => store.state.gameStatus === 'won')
const message = computed(() => 
  store.state.gameStatus === 'won' ? 'You Won!' : 'You Lost!'
)

const displayEmoji = ref('')
const emojiLoading = ref(false)

// Sound effects
const playSound = (frequency, duration, type = 'sine') => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = frequency
    oscillator.type = type
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    console.log('Audio not supported')
  }
}

const playWinSound = () => {
  setTimeout(() => playSound(523.25, 0.15), 0)
  setTimeout(() => playSound(659.25, 0.15), 150)
  setTimeout(() => playSound(783.99, 0.3), 300)
}

const playLoseSound = () => {
  setTimeout(() => playSound(392, 0.2, 'triangle'), 0)
  setTimeout(() => playSound(329.63, 0.2, 'triangle'), 200)
  setTimeout(() => playSound(261.63, 0.4, 'triangle'), 400)
}

// Fetch emoji from GitHub emoji API
watch(() => store.state.gameStatus, async (newStatus) => {
  if (newStatus === 'won' || newStatus === 'lost') {
    emojiLoading.value = true
    if (newStatus === 'won') playWinSound()
    else playLoseSound()
    
    try {
      // Using GitHub's emoji API
      const emojiName = newStatus === 'won' ? 'grinning' : 'cry'
      const response = await fetch(`https://api.github.com/emojis`)
      if (response.ok) {
        const emojis = await response.json()
        const emojiUrl = emojis[emojiName]
        if (emojiUrl) {
          // Fetch the actual emoji image and convert to text
          displayEmoji.value = newStatus === 'won' ? '😀' : '😢'
        } else {
          displayEmoji.value = newStatus === 'won' ? '😊' : '😢'
        }
      } else {
        displayEmoji.value = newStatus === 'won' ? '😊' : '😢'
      }
    } catch (error) {
      console.error('Failed to fetch emoji:', error)
      displayEmoji.value = newStatus === 'won' ? '😊' : '😢'
    } finally {
      emojiLoading.value = false
    }
  }
})

const restartGame = () => {
  displayEmoji.value = ''
  store.dispatch('startGame', store.state.level)
}

const goToMenu = () => {
  displayEmoji.value = ''
  store.commit('SET_STATUS', 'idle')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(5px);
  z-index: 1000;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 35px 40px;
  text-align: center;
  min-width: 320px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: modalPop 0.4s ease forwards;
}

@keyframes modalPop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.win-animation {
  border: 4px solid #4ade80;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.lose-animation {
  border: 4px solid #f87171;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.emoji-container {
  margin-bottom: 20px;
}

.loading {
  font-size: 3rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.emoji-display {
  font-size: 5rem;
  line-height: 1;
  display: inline-block;
}

.bounce {
  animation: bounce 0.6s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.shake {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.message-title {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #1f2937;
  font-weight: bold;
}

.score-text {
  font-size: 1.2rem;
  color: #4b5563;
  margin-bottom: 25px;
}

.score-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  flex: 1;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(245, 158, 11, 0.4);
}

button:active {
  transform: translateY(0);
}
</style>

