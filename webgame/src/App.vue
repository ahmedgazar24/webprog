<template>
  <div id="app">
    <div class="header">
      <h1>🧠 Number Sequence Memory Game</h1>
      <div v-if="gameStatus !== 'idle'" class="score-display">
        Score: {{ score }}
      </div>
    </div>
    
    <!-- Level Selection Screen -->
    <Levels v-if="gameStatus === 'idle'" />
    
    <!-- Game Screen -->
    <div v-if="['memorizing', 'playing'].includes(gameStatus)" class="game-container">
      <div v-if="gameStatus === 'memorizing'" class="memorize-banner">
        <h3>⏰ Memorize the sequence!</h3>
        <p class="timer">{{ timeLeft }} seconds left</p>
      </div>
      
      <div v-if="gameStatus === 'playing'" class="play-banner">
        <h3>🎯 Click numbers in order (1, 2, 3...)</h3>
      </div>
      
      <BigBox />
    </div>
    
    <!-- Result Modal -->
    <Result />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Levels from './components/levels.vue'
import BigBox from './components/bigbox.vue'
import Result from './components/result.vue'

const store = useStore()

const gameStatus = computed(() => store.state.gameStatus)
const score = computed(() => store.state.score)
const timeLeft = computed(() => store.state.timeLeft)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.score-display {
  font-size: 1.3rem;
  font-weight: bold;
  background: rgba(255,255,255,0.2);
  padding: 10px 20px;
  border-radius: 20px;
  display: inline-block;
  margin-top: 10px;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.memorize-banner, .play-banner {
  background: white;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}

.memorize-banner h3, .play-banner h3 {
  color: #333;
  margin-bottom: 5px;
}

.timer {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b6b;
  margin-top: 8px;
}
</style>
