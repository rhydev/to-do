<template>
  <v-app-bar
    app
    flat
    dark
  >
    <v-toolbar-title
      class="hidden-sm-and-down brand font-weight-black mx-16"
      v-text="'TODOLIST'"
    />
    <v-text-field
      v-model="filter"
      prepend-inner-icon="mdi-magnify"
      color="primary"
      label="Filter Todos"
      solo-inverted
      dense
      flat
    />
    <div class="hidden-sm-and-down">
      <v-btn
        class="mr-4 ml-16"
        color="error"
        depressed
        @click="todoModule.setClearTodosDialog(true)"
      >
        <v-icon
          left
          v-text="'mdi-trash-can-outline'"
        />
        Clear Todos
      </v-btn>
      <v-btn
        class="mr-16"
        color="primary"
        depressed
        @click="todoModule.addTempTodo"
      >
        <v-icon
          left
          v-text="'mdi-plus'"
        />
        New Todo
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// Store
import { getModule } from 'vuex-module-decorators'
import TodoModule from '@/store/modules/todo'

@Component
export default class AppBar extends Vue {
  // Store
  private todoModule: TodoModule = getModule(TodoModule)

  get filter(): string {
    return this.todoModule.filter
  }
  set filter(filter: string) {
    this.todoModule.setFilter(filter)
  }
}
</script>

<style scoped lang="scss">
.brand {
  font-family: 'Montserrat', sans-serif !important;
  font-size: 1.5rem !important;
  user-select: none;
}
.v-text-field {
  height: 38px;
}
</style>
