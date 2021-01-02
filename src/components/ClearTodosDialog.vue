<template>
  <v-dialog
    v-model="value"
    max-width="300px"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <v-card-title>
        <span v-text="'Clear all todos?'" />
      </v-card-title>
      <v-card-text>
        <span v-text="'All todos will be deleted.'" />
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
          @click="clear"
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

  private async clear(): Promise<void> {
    try {
      if (this.todoModule.todoLists.length > 0 && !this.todoModule.blocking) {
        await this.todoModule.deleteAllTodos()
        this.todoModule.successMsg('Successfully cleared all todos.')
      }
      this.$emit('input', false)
    } catch (err) {
      console.error(err)
      this.todoModule.errorMsg('Failed to clear all todos.')
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
