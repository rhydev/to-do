<template>
  <v-container
    class="grey lighten-4"
    fluid
  >
    <div v-for="(todoList, i) in todoModule.filteredTodos" :key="i">
      <!-- Date Divider -->
      <v-row class="mx-md-4 px-3">
        <transition
          name="half-fade"
          appear
        >
          <date-divider
            :day="todoList.day"
            :month="todoList.month"
            class="mr-3"
          />
        </transition>
        <v-divider class="my-4" />
      </v-row>

      <!-- Todos -->
      <v-row class="mx-md-4">
        <v-col
          v-for="todo in todoList.todos"
          :key="todo.id"
          :style="{ 'z-index': todo.temp ? '204' : '1' }"
          class="my-2"
          xl="2"
          lg="3"
          md="4"
          sm="6"
          cols="12"
        >
          <transition
            :name="todo.temp ? 'scale' : 'half-fade'"
            appear
          >
            <todo-item
              :title="todo.title"
              :content="todo.content"
              :id="todo.id"
              :temp="todo.temp"
            />
          </transition>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// Components
import TodoItem from '@/components/TodoItem.vue'
import DateDivider from '@/components/DateDivider.vue'

// Store
import { getModule } from 'vuex-module-decorators'
import TodoModule from '@/store/modules/todo'

@Component({
  components: {
    TodoItem,
    DateDivider
  }
})
export default class TodoContainer extends Vue {
  // Store
  private todoModule: TodoModule = getModule(TodoModule)
}
</script>

<style scoped lang="scss">
.half-fade-enter-active, .half-fade-leave-active {
  transition: opacity .3s;
}
.half-fade-enter, .half-fade-leave-to {
  opacity: 0.5;
}
.scale-enter-active, .scale-leave-active {
  transition: all 0.3s;
}
.scale-enter, .scale-leave-to {
  transform: scale(0.9);
}
</style>
