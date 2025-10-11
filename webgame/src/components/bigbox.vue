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
        @click="handleClick(pos)"
      >
        <span v-if="getNumberAt(pos)?.revealed || getNumberAt(pos)?.clicked">
          {{ getNumberAt(pos)?.value }}
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
      store.commit('SET_STATUS', 'won')
    }
  } else {
    // Wrong number clicked
    store.commit('SET_STATUS', 'lost')
  }
}
</script>

<style scoped>
.bigbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.title {
  font-size: 1.4rem;
  color: #333;
}

.grid {
  display: grid;
  gap: 10px;
  margin-top: 10px;
  width: 300px;
  height: 300px;
}

.cell {
  background: #e0e0e0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.3rem;
  cursor: pointer;
  transition: 0.2s;
}

.cell:hover {
  background: #d0d0d0;
}
</style>

