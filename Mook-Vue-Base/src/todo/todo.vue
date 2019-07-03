<template>
  <section class="main-app">
    <input 
      type="text" 
      class="add-input"
      autofocus="autofocus"
      placeholder="接下去要做什么？"
      @keyup.enter="addTodo"
    />
    <Item 
      v-for="todo in filteredTodos" 
      :todo="todo"
      :key="todo.id"
      @delTodo="onDelTodo"
    ></Item>
    <Tabs 
      :todos="todos"
      :filter="filter"
      @filterchange="onFilterChange"
      @clearcompleted="clearCompleted"
    ></Tabs>
    <TSlot>
      <!-- vue2.6.0之后使用v-slot:user这种语法 -->
      <template slot="user"> 
        Time
      </template>
      <template slot="phone">
        <span>800-880-8852</span>
      </template>
    </TSlot>
    <t-scoped>
      <!-- vue2.6.0之后使用v-slot:default="slotScoped"这种语法 -->
      <!-- 内部都是 function (scopedSlot) {...} 这种形式 -->
      <template slot="default" slot-scope="{items}">
        my scoped slot: {{ items }}
      </template>
    </t-scoped>
    <A></A>
  </section>  
</template>

<script>
  import Item from './item.vue'
  import Tabs from './tabs.vue'
  import TSlot from './tslot.vue'
  import TScoped from './tscoped.vue'
  import A from './a.vue'

  let todoId = 0;
  export default {
    components: {
      Item,
      Tabs,
      TSlot,
      TScoped,
      A
    },
    inject: {
      
    },
    mounted () {
      console.log(this);
      this.$listeners.google.call(this);
    },
    data () {
      return {
        flag: 'todo',
        todos: [{
          id: 0,
          completed: false,
          content: 'feed my cat',
        }],
        filter: 'all',
      }
    },
    computed: {
      filteredTodos () {
        if (this.filter === 'all') {
          return this.todos
        }
        let completed = this.filter === 'completed';
        return this.todos.filter(todo => todo.completed === completed);
      }
    },
    methods: {
      addTodo (e) {
        this.todos.unshift({
          id: todoId ++,
          completed: false,
          content: e.target.value,
        })
        e.target.value = ''
      },
      onDelTodo (todoId) {
        this.todos.splice(this.todos.findIndex(todo => todo.id === todoId), 1)
      },
      onFilterChange (state) {
        this.filter = state
      },
      clearCompleted () {
        this.todos = this.todos.filter(todo => todo.completed === false)
      }
    }
  }
</script>

<style lang="stylus">
.main-app {
  margin: 20px;
  padding: 5px 15px;
  font-size: 20px;
  line-height: 2;
  background: #fff;
  box-shadow: 2px 2px 10px;
  .add-input {
    display: block;
    padding-left: 50px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    outline: none;
    border-bottom: 1px solid #eee;
    background: none;
    -webkit-appearance: none;
    font-size: inherit;
    line-height: inherit;
  }
}
</style>
