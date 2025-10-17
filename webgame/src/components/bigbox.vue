<template>
  <div class="bigbox">
    <h2 class="title">Level {{ level }}</h2>
    <div 
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }"
    >
      <div 
        v-for="pos in gridSize * gridSize" 
        :key="pos"
        class="cell"
        :class="{ 
          'revealed': getNumberAt(pos)?.revealed, 
          'clicked': getNumberAt(pos)?.clicked,
          'empty': !getNumberAt(pos)
        }"
        @click="handleClick(pos)"
      >
        <span v-if="getNumberAt(pos) && (getNumberAt(pos).revealed || getNumberAt(pos).clicked)">
          {{ getNumberAt(pos).value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const level = computed(() => store.state.level)
const gridSize = computed(() => store.state.gridSize)
const numbers = computed(() => store.state.numbers)
const gameStatus = computed(() => store.state.gameStatus)

let currentTarget = ref(1) // next number player must click

// Helper to find the number for a position
const getNumberAt = (pos) => {
  return numbers.value.find(n => n.id === pos)
}

const handleClick = (pos) => {
  if (gameStatus.value !== 'playing') return
  const box = getNumberAt(pos)
  if (!box) return // empty cell

  // If clicked the correct number in sequence
  if (box.value === currentTarget.value) {
    box.clicked = true
    store.commit('INCREMENT_SCORE', store.state.level * 10)
    currentTarget.value++

    // Check if all numbers are clicked
    if (currentTarget.value > numbers.value.length) {
      // Add bonus points for completing the level
      store.commit('INCREMENT_SCORE', store.state.level * 50)
      setTimeout(() => {
        store.commit('SET_STATUS', 'won')
        currentTarget.value = 1 // reset for next game
      }, 300)
    }
  } else {
    // Wrong number clicked
    store.commit('SET_STATUS', 'lost')
    currentTarget.value = 1 // reset for next game
  }
}
</script>

<style scoped>
.bigbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.title {
  font-size: 1.8rem;
  color: #667eea;
  font-weight: bold;
}

.grid {
  display: grid;
  gap: 10px;
  margin-top: 10px;
  width: min(400px, 90vw);
  height: min(400px, 90vw);
}

.cell {
  background: linear-gradient(135deg, #e0e7ff 0%, #cfd9ff 100%);
  border: 3px solid #a5b4fc;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cell.empty {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-color: #d1d5db;
  cursor: default;
}

.cell:not(.empty):hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
}

.cell.clicked {
  background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
  border-color: #22c55e;
  color: white;
  animation: pulse 0.3s ease;
}

.cell.revealed {
  background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
  border-color: #facc15;
  color: #854d0e;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.cell span {
  user-select: none;
}
</style>

