<template>
  <div class="level-selector">
    <h2>🎯 Memory Number Challenge</h2>
    <p>Select Difficulty:</p>
    <div class="levels">
      <button @click="start(1)">Level 1 (Easy)</button>
      <button @click="start(2)">Level 2 (Medium)</button>
      <button @click="start(3)">Level 3 (Hard)</button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()

const start = (level) => {
  store.commit('SET_LEVEL', level)
  store.dispatch('startGame', level)
}
</script>

<style scoped>
.level-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 50px;
}

h2 {
  margin-bottom: 20px;
}

.levels {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s;
}

button:hover {
  background-color: #33996b;
}
</style>

