<template>
  <v-dialog
    v-model="value"
    :max-width="maxWidth"
    :persistent="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
    :fullscreen="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
    :hide-overlay="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
    :transition="$vuetify.breakpoint.mdAndUp ? 'dialog-transition' : 'dialog-bottom-transition'"
    content-class="elevation-0"
    no-click-animation
    @click:outside="close"
  >
    <v-card
      :elevation="$vuetify.breakpoint.mdAndUp ? '' : '0'"
      :style="{ 'border-radius': $vuetify.breakpoint.mdAndUp ? '4px' : '0px' }"
      color="primary"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <div v-if="!todoModule.editing">
          <v-card-title
            :class="{ 'dialog-text': $vuetify.breakpoint.mdAndUp }"
            class="white--text"
          >
            <span v-text="currentTodo.title" />
          </v-card-title>
          <v-card-text
            :class="{ 'dialog-text': $vuetify.breakpoint.mdAndUp }"
            class="white--text"
          >
            <span v-text="currentTodo.content" />
          </v-card-text>
        </div>
        <v-form
          v-else
          v-model="valid"
          class="fix-padding"
        >
          <v-card-title :class="{ 'dialog-text': $vuetify.breakpoint.mdAndUp }">
            <v-textarea
              v-model="currentTodoCopy.title"
              :rules="[ required ]"
              color="white"
              label="Todo Title*"
              rows="1"
              auto-grow
              autofocus
              dark
              dense
              hide-details
              @keydown.enter.prevent="submit"
            />
          </v-card-title>
          <v-card-text
            :class="{ 'dialog-text': $vuetify.breakpoint.mdAndUp }"
            class="fix-padding"
          >
            <v-textarea
              v-model="currentTodoCopy.content"
              color="white"
              label="Todo Description"
              rows="1"
              auto-grow
              dark
              dense
              hide-details
              @keydown.enter.prevent="submit"
            />
          </v-card-text>
        </v-form>
      </transition>
    </v-card>

    <!-- Floating buttons for desktop -->
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="!todoModule.editing"
        key="view"
        class="hidden-sm-and-down mt-4 text-center"
      >
        <v-btn
          style="margin-right: 2vw;"
          color="error"
          min-width="125px"
          depressed
          @click="del"
        >
          <v-icon
            left
            v-text="'mdi-trash-can-outline'"
          />
          Delete
        </v-btn>
        <v-btn
          style="margin-left: 2vw;"
          color="success"
          min-width="125px"
          depressed
          @click="edit"
        >
          <v-icon
            left
            v-text="'mdi-pencil'"
          />
          Edit
        </v-btn>
      </div>
      <div
        v-else
        key="edit"
        class="hidden-sm-and-down mt-4 text-center"
      >
        <v-btn
          style="margin-right: 2vw;"
          color="error"
          min-width="125px"
          depressed
          @click="todoModule.setEditing(false)"
        >
          <v-icon
            left
            v-text="'mdi-close'"
          />
          Cancel
        </v-btn>
        <v-btn
          style="margin-left: 2vw;"
          color="success"
          min-width="125px"
          depressed
          @click="submit"
        >
          <v-icon
            left
            v-text="'mdi-check'"
          />
          Confirm
        </v-btn>
      </div>
    </transition>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { Todo } from '@/types'

// Store
import { getModule } from 'vuex-module-decorators'
import TodoModule from '@/store/modules/todo'

@Component
export default class TodoContainer extends Vue {
  @Prop({required: true, default: false}) value!: boolean

  // Store
  private todoModule: TodoModule = getModule(TodoModule)

  get maxWidth(): string {
    if (this.todoModule.currentTodo.title.length > 150 || this.todoModule.currentTodo.content.length > 150) {
      return '50vw'
    }
    return '30vw'
  }

  get currentTodo(): Todo {
    return this.todoModule.currentTodo
  }
  set currentTodo(todo: Todo) {
    this.todoModule.setCurrentTodo(todo)
  }

  get currentTodoCopy(): Todo {
    return this.todoModule.currentTodoCopy
  }
  set currentTodoCopy(todo: Todo) {
    this.todoModule.setCurrentTodoCopy(todo)
  }

  get valid(): boolean {
    return this.todoModule.todoEditValid
  }
  set valid(valid: boolean) {
    this.todoModule.setTodoEditValid(valid)
  }

  private required(val: string): boolean {
    return !!val
  }

  private edit(): void {
    this.currentTodoCopy = JSON.parse(JSON.stringify(this.todoModule.currentTodo))
    this.todoModule.setEditing(true)
  }

  private close(): void {
    if (this.$vuetify.breakpoint.mdAndUp) {
      this.$emit('input', false)
      if (this.todoModule.editing) {
        setTimeout((): void => {
          this.todoModule.setEditing(false)
        }, 300)
      }
    }
  }

  private async submit(): Promise<void> {
    if (this.valid) {
      try {
        if (!this.todoModule.blocking && (this.currentTodoCopy.title !== this.currentTodo.title || this.currentTodoCopy.content !== this.currentTodo.content)) {
          await this.todoModule.editTodo({
            id: this.currentTodoCopy.id,
            title: this.currentTodoCopy.title,
            content: this.currentTodoCopy.content
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

  private async del(): Promise<void> {
    try {
      if (!this.todoModule.blocking) {
        await this.todoModule.deleteTodo(this.todoModule.currentTodo.id)
        this.$emit('input', false)
        this.todoModule.successMsg('Successfully deleted todo.')
      }
    } catch (err) {
      console.error(err)
      this.todoModule.errorMsg('Failed to delete todo.')
    }
  }
}
</script>

<style scoped lang="scss">
.v-card {
  border-radius: 0;
}
.dialog-text {
  max-height: 35vh;
  overflow-y: auto;
}
.dialog-area {
  padding-top: 10px;
  max-height: 35vh;
  overflow-y: auto;
}
.fix-padding {
  padding-top: 6px !important;
}
</style>
