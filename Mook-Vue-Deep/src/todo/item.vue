<template>
  <div 
    :class="['todo-item', todo.completed ? 'todo-completed' : '']"
  >
    <input 
      type="checkbox"
      class="toggle"
      v-model="todo.completed"
    >  
    <label>{{todo.content}}</label>
    <div class="destroy" @click="onDeleteTodo"></div>
  </div>
</template>

<script>
  export default {
    props: {
      todo: {
        type: Object,
        required: true
      }
    },
    methods: {
      onDeleteTodo () {
        this.$emit('delTodo', this.todo.id)
      }
    }
  }
</script>

<style lang="stylus">
  .todo-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    .toggle {
      width: 26px;
      height: 26px;
      margin: 0 10px;
      border-radius: 13px;
      border: 1px solid #ccc;
      -webkit-appearance: none;
      user-select: none;
      -webkit-user-select: none;
      &:checked {
        background-color: #78e;
      }
    }
    label {
      flex: 1;
      position: relative;
      margin-left: 3px;
      color: #333;
      text-shadow: 1px 1px 2px #eee;
      opacity: 1;
      transition: opacity 300ms, text-shadow 300ms;
    }
    .destroy {
      position: relative;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      border: 1px solid #ccc;
      cursor: pointer;
      &:before, &:after {
        content: '';
        position: absolute;
        left: 2.5px;
        top: 9.5px;
        width: 15px;
        height: 1px;
        background-color: #333;
        transform-origin: 7.5px .5px;
      }
      &:before {
        transform: rotate(45deg);  
      }
      &:after {
        transform: rotate(-45deg);
      }
    }
  }
  .todo-completed {
    label {
      opacity: .3;
      text-shadow: none;
      text-decoration: line-through;
    }
  }
</style>