<template>
  <v-hover v-slot="{ hover }">
    <!-- Regular Todo -->
    <v-card
      v-if="!temp"
      v-ripple="{ class: 'primary--text' }"
      :class="{ 'clickable': hover }"
      :color="hover ? 'primary lighten-2' : 'primary'"
      max-width="400"
      @click="openDetails"
    >
      <v-card-title class="white--text">
        <span
          :class="{ 'title-clamp': content.length > 0, 'title-only-clamp': content.length === 0 }"
          v-text="title"
        />
      </v-card-title>
      <v-card-text
        v-if="content.length > 0"
        class="white--text"
      >
        <span
          class="text-clamp"
          v-text="content"
        />
      </v-card-text>
    </v-card>

    <!-- Temp Todo -->
    <v-card
      v-else-if="temp"
      class="mx-auto"
      max-width="400"
      color="primary"
    >
      <v-form v-model="valid">
        <v-card-title>
          <v-text-field
            v-model="newTitle"
            :rules="[ required ]"
            color="white"
            label="Todo Title*"
            autofocus
            dark
            dense
            hide-details
            @keydown.enter="submit"
          />
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newContent"
            color="white"
            label="Todo Description"
            dark
            dense
            hide-details
            @keydown.enter="submit"
          />
        </v-card-text>
        <v-btn
          style="top: -18px;"
          color="error"
          fab
          x-small
          depressed
          absolute
          right
          @click="todoModule.removeTempTodo"
        >
          <v-icon v-text="'mdi-close'" />
        </v-btn>
        <v-btn
          style="bottom: -18px;"
          color="success"
          fab
          x-small
          depressed
          absolute
          right
          @click="submit"
        >
          <v-icon v-text="'mdi-check'" />
        </v-btn>
      </v-form>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

// Store
import { getModule } from 'vuex-module-decorators'
import TodoModule from '@/store/modules/todo'

@Component
export default class Todo extends Vue {
  @Prop() title!: string
  @Prop() content!: string
  @Prop() id!: string
  @Prop() temp!: boolean

  // Store
  private todoModule: TodoModule = getModule(TodoModule)

  private newTitle: string = ''
  private newContent: string = ''
  private valid: boolean = true

  private required(val: string): boolean {
    return !!val
  }

  private async submit(): Promise<void> {
    if (this.valid && !this.todoModule.blocking) {
      try {
        await this.todoModule.createTodo({ title: this.newTitle, content: this.newContent })
        this.todoModule.successMsg('Successfully created new todo.')
      } catch (err) {
        console.error(err)
        this.todoModule.errorMsg('Failed to create new todo.')
      }
    }
  }

  private async openDetails(): Promise<void> {
    const todo = await this.todoModule.getTodo(this.id)

    if (todo) {
      this.todoModule.setCurrentTodo(todo)
      this.todoModule.setTodoDetailsDialog(true)
    } else {
      this.todoModule.errorMsg('Failed to open todo details.')
    }
  }
}
</script>

<style scoped lang="scss">
.title-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.text-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.title-only-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.clickable {
  cursor: pointer;
}
span {
  user-select: none;
}
</style>
