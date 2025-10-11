<template>
  <div v-if="visible" class="overlay">
    <div class="modal">
      <h2>{{ message }}</h2>
      <p>Your Score: {{ score }}</p>
      <div class="buttons">
        <button @click="restartGame">Play Again</button>
        <button @click="goToMenu">Main Menu</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const visible = computed(() => ['won', 'lost'].includes(store.state.gameStatus))
const score = computed(() => store.state.score)
const message = computed(() => 
  store.state.gameStatus === 'won' ? '🎉 You Won!' : '💥 You Lost!'
)

const restartGame = () => {
  store.dispatch('startGame', store.state.level)
}

const goToMenu = () => {
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
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 25px 30px;
  text-align: center;
  width: 280px;
}

h2 {
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background-color: #33996b;
}
</style>

