<template>
  <v-dialog
    v-model="value"
    max-width="300px"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <v-card-title>
        <span v-text="'Delete this todo?'" />
      </v-card-title>
      <v-card-text>
        <span v-text="'This todo will be permanently deleted.'" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          v-text="'Cancel'"
          @click="$emit('input', false)"
        />
        <v-btn
          color="error"
          text
          v-text="'Confirm'"
          @click="del"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

// Store
import { getModule } from 'vuex-module-decorators'
import TodoModule from '@/store/modules/todo'

@Component
export default class NewTodoDialog extends Vue {
  @Prop({required: true, default: false}) value!: boolean

  // Store
  private todoModule: TodoModule = getModule(TodoModule)

  private async del(): Promise<void> {
    try {
      if (!this.todoModule.blocking) {
        await this.todoModule.deleteTodo(this.todoModule.currentTodo.id)
        this.todoModule.setTodoDetailsDialog(false)
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
</style>
