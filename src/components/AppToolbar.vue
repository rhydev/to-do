<template>
  <v-app-bar
    class="hidden-md-and-up"
    style="z-index: 203;"
    app
    flat
    dark
    bottom
    dense
  >
    <!-- Helper tooltip -->
    <v-tooltip
      v-if="!todoModule.todoDetailsDialog"
      v-model="todoModule.tooltip"
      :disabled="!todoModule.tooltip"
      content-class="hidden-md-and-up bubble"
      color="primary"
      z-index="203"
      absolute
    >
      <span v-text="'Add your first todo!'" />
    </v-tooltip>

    <!-- Toolbar -->
    <v-spacer />
    <transition
      name="fade"
      mode="out-in"
    >
      <v-btn
        v-if="!todoModule.todoDetailsDialog"
        key="clear"
        color="error"
        icon
        large
        depressed
        @click="todoModule.setClearTodosDialog(true)"
      >
        <v-icon v-text="'mdi-trash-can-outline'" />
      </v-btn>
      <v-btn
        v-else-if="todoModule.todoDetailsDialog && !todoModule.editing"
        key="back"
        icon
        large
        depressed
        @click="todoModule.setTodoDetailsDialog(false)"
      >
        <v-icon v-text="'mdi-arrow-left'" />
      </v-btn>
      <v-btn
        v-else
        key="confirm"
        color="success"
        icon
        large
        depressed
        @click="submit"
      >
        <v-icon v-text="'mdi-check'" />
      </v-btn>
    </transition>
    <v-spacer />
    <transition
      name="fade"
      mode="out-in"
    >
      <v-btn
        v-if="!todoModule.todoDetailsDialog"
        key="add"
        class="mx-8"
        color="primary"
        icon
        large
        depressed
        @click="todoModule.addTempTodo"
      >
        <v-icon v-text="'mdi-plus'" />
      </v-btn>
      <v-btn
        v-else-if="todoModule.todoDetailsDialog && !todoModule.editing"
        key="edit"
        class="mx-8"
        color="success"
        icon
        large
        depressed
        @click="edit"  
      >
        <v-icon v-text="'mdi-pencil'" />
      </v-btn>
      <div
        v-else
        class="mx-8"
        style="height: 28px; width:44px;"
      />
    </transition>
    <v-spacer />
    <transition
      name="fade"
      mode="out-in"
    >
      <v-btn
        v-if="!todoModule.todoDetailsDialog"
        key="scroll"
        icon
        large
        depressed
        @click="scrollToTop"
      >
        <v-icon v-text="'mdi-chevron-up'" />
      </v-btn>
      <v-btn
        v-else-if="todoModule.todoDetailsDialog && !todoModule.editing"
        key="delete"
        color="error"
        icon
        large
        depressed
        @click="todoModule.setDeleteTodoDialog(true)"
      >
        <v-icon v-text="'mdi-trash-can-outline'" />
      </v-btn>
      <v-btn
        v-else
        key="cancel"
        color="error"
        icon
        large
        depressed
        @click="todoModule.setEditing(false)"
      >
        <v-icon v-text="'mdi-close'" />
      </v-btn>
    </transition>
    <v-spacer />
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

  get tooltip(): boolean {
    return this.todoModule.tooltip
  }
  set tooltip(tooltip: boolean) {
    this.todoModule.setTooltip(tooltip)
  }

  private scrollToTop(): void {
    this.$vuetify.goTo(0)
  }

  private edit(): void {
    this.todoModule.setCurrentTodoCopy(JSON.parse(JSON.stringify(this.todoModule.currentTodo)))
    this.todoModule.setEditing(true)
  }

  private async submit(): Promise<void> {
    if (this.todoModule.todoEditValid) {
      try {
        if (!this.todoModule.blocking && (this.todoModule.currentTodoCopy.title !== this.todoModule.currentTodo.title || this.todoModule.currentTodoCopy.content !== this.todoModule.currentTodo.content)) {
          await this.todoModule.editTodo({
            id: this.todoModule.currentTodoCopy.id,
            title: this.todoModule.currentTodoCopy.title,
            content: this.todoModule.currentTodoCopy.content
          })
          this.todoModule.successMsg('Successfully edited todo.')
        }
        this.todoModule.setEditing(false)
      } catch (err) {
        console.error(err)
        this.todoModule.setEditing(false)
        this.todoModule.errorMsg('Failed to edit todo.')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bubble {
  margin-top: calc(100vh - 95px);
  margin-left: calc(50vw - 87.5px);
}
.bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  border: 10px solid transparent;
  border-top-color: #3273DC;
  border-bottom: 0;
  margin-left: -10px;
  margin-bottom: -10px;
}
</style>
