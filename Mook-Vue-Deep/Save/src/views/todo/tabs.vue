<template>
  <div class="helper">
    <span class="left">{{unCompletedTodoLength}} items left</span>
    <div class="tabs">
      <span
        v-for="state in states"
        :key="state"
        :class="['state', filter === state ? 'filter' : '']"
        @click="toggleFilter(state)"
      >
        {{state}}
      </span>
    </div>
    <span class="clear" @click="clearAllCompleted">Clear Completed</span>
  </div>
</template>

<script>
  export default {
    props: {
      filter: {
        type: String,
        required: true
      },
      todos: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        states: ['all', 'active', 'completed']
      }
    },
    computed: {
      unCompletedTodoLength () {
        return this.todos.filter(todo => todo.completed === false).length;
      }
    },
    methods: {
      toggleFilter (state) {
        this.$emit('filterchange', state);
      },
      clearAllCompleted () {
        this.$emit('clearcompleted')
      },
    }
  }
</script>

<style lang="stylus">
.helper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 8px;
  font-size: 12px;
  line-height: 2.5;
  .tabs {
    width: 180px;
    cursor: pointer;
    .state {
      padding: 5px;
      margin: 0 5px;
      border-radius: 3px;  
    }
    .filter {
      border: 1px solid #e55;  
    }
  }
  .clear {
    cursor: pointer;
  }
}
</style>
