import { createStore } from 'vuex'

export default createStore({
  state: {
    level: 1,
    gridSize: 3,
    numbers: [],
    score: 0,
    gameStatus: 'idle', // 'idle', 'memorizing', 'playing', 'won', 'lost'
    timeLeft: 0,
    memorizeTime: 0
  },
  
  mutations: {
    SET_LEVEL(state, level) {
      state.level = level
    },
    
    SET_GRID_SIZE(state, size) {
      state.gridSize = size
    },
    
    SET_NUMBERS(state, numbers) {
      state.numbers = numbers
    },
    
    SET_STATUS(state, status) {
      state.gameStatus = status
    },
    
    INCREMENT_SCORE(state, points) {
      state.score += points
    },
    
    RESET_SCORE(state) {
      state.score = 0
    },
    
    SET_TIME_LEFT(state, time) {
      state.timeLeft = time
    },
    
    SET_MEMORIZE_TIME(state, time) {
      state.memorizeTime = time
    },
    
    DECREMENT_TIME(state) {
      if (state.timeLeft > 0) {
        state.timeLeft--
      }
    },
    
    REVEAL_NUMBER(state, id) {
      const num = state.numbers.find(n => n.id === id)
      if (num) num.revealed = true
    },
    
    HIDE_ALL_NUMBERS(state) {
      state.numbers.forEach(n => {
        n.revealed = false
        n.clicked = false
      })
    }
  },
  
  actions: {
    startGame({ commit, state }, level) {
      // Reset
      commit('RESET_SCORE')
      commit('SET_LEVEL', level)
      
      // Configure based on level
      let gridSize, numCount, memorizeTime
      switch(level) {
        case 1:
          gridSize = 3
          numCount = 4
          memorizeTime = 5
          break
        case 2:
          gridSize = 4
          numCount = 6
          memorizeTime = 4
          break
        case 3:
          gridSize = 5
          numCount = 8
          memorizeTime = 3
          break
        default:
          gridSize = 3
          numCount = 4
          memorizeTime = 5
      }
      
      commit('SET_GRID_SIZE', gridSize)
      commit('SET_MEMORIZE_TIME', memorizeTime)
      
      // Generate random positions for numbers
      const totalCells = gridSize * gridSize
      const positions = []
      while (positions.length < numCount) {
        const pos = Math.floor(Math.random() * totalCells) + 1
        if (!positions.includes(pos)) {
          positions.push(pos)
        }
      }
      
      // Create number objects
      const numbers = positions.map((pos, idx) => ({
        id: pos,
        value: idx + 1,
        revealed: true,
        clicked: false
      }))
      
      commit('SET_NUMBERS', numbers)
      commit('SET_STATUS', 'memorizing')
      commit('SET_TIME_LEFT', memorizeTime)
      
      // Start memorization countdown
      const interval = setInterval(() => {
        if (state.timeLeft > 0) {
          commit('DECREMENT_TIME')
        } else {
          clearInterval(interval)
          commit('HIDE_ALL_NUMBERS')
          commit('SET_STATUS', 'playing')
        }
      }, 1000)
    }
  }
})
