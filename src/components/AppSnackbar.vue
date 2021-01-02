<template>
  <v-snackbar
    v-model="show"
    :color="todoModule.snackbar.color"
    :timeout="4000"
  >
    {{ todoModule.snackbar.message }}
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

// Store
import { getModule } from 'vuex-module-decorators'
import TodoModule from '@/store/modules/todo'

@Component
export default class FilterField extends Vue {
  // Store
  private todoModule: TodoModule = getModule(TodoModule)

  private show: boolean = false

  @Watch('todoModule.snackbar')
  onPropertyChanged(): void {
    this.show = true
  }
}
</script>

<style scoped lang="scss">
</style>
