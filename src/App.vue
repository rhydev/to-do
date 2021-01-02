<template>
  <div id="app">
    <v-app>
      <v-main>
        <!-- App Components -->
        <transition name="fade">
          <v-overlay
            v-show="todoModule.overlay"
            z-index="204"
          />
        </transition>
        <app-bar />
        <app-snackbar />
        <app-toolbar />

        <!-- View -->
        <todo-container />

        <!-- Dialogs -->
        <clear-todos-dialog v-model="clearDialog" />
        <delete-todo-dialog v-model="deleteDialog" />
        <todo-details-dialog v-model="detailsDialog" />
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// Components
import AppBar from '@/components/AppBar.vue'
import AppSnackbar from '@/components/AppSnackbar.vue'
import AppToolbar from '@/components/AppToolbar.vue'
import TodoContainer from '@/components/TodoContainer.vue'
import TodoDetailsDialog from '@/components/TodoDetailsDialog.vue'
import DeleteTodoDialog from '@/components/DeleteTodoDialog.vue'
import ClearTodosDialog from '@/components/ClearTodosDialog.vue'

// Store
import { getModule } from 'vuex-module-decorators'
import TodoModule from '@/store/modules/todo'

@Component({
  name: 'App',
  components: {
    AppBar,
    AppSnackbar,
    AppToolbar,
    TodoContainer,
    TodoDetailsDialog,
    DeleteTodoDialog,
    ClearTodosDialog
  }
})
export default class App extends Vue {
  // Store
  private todoModule: TodoModule = getModule(TodoModule)
  
  get clearDialog(): boolean {
    return this.todoModule.clearTodosDialog
  }
  set clearDialog(val: boolean) {
    this.todoModule.setClearTodosDialog(val)
  }

  get detailsDialog(): boolean {
    return this.todoModule.todoDetailsDialog
  }
  set detailsDialog(val: boolean) {
    this.todoModule.setTodoDetailsDialog(val)
  }

  get deleteDialog(): boolean {
    return this.todoModule.deleteTodoDialog
  }
  set deleteDialog(val: boolean) {
    this.todoModule.setDeleteTodoDialog(val)
  }

  async mounted (): Promise<void> {
    try {
      await this.todoModule.getTodos()

      if (this.todoModule.todoLists.length === 0) {
        this.todoModule.setTooltip(true)
      } else {
        this.todoModule.setTooltip(false)
      }
    } catch (err) {
      console.error(err)
      this.todoModule.errorMsg('Failed to get todos.')
    }
  }
}
</script>

<style lang="scss">
#app {
  background-color: #F5F5F5;
}
.v-dialog--fullscreen {
  bottom: 48px;
  height: calc(100% - 48px);
}
.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 77vh;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
