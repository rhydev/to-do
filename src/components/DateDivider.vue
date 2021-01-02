<template>
  <div>
    <div class="day">
      <span v-text="day" />
    </div>
    <div class="month">
      <span v-text="month" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TodoContainer extends Vue {
  @Prop() day!: number
  @Prop() month!: string
}
</script>

<style scoped lang="scss">
.day {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  line-height: 1;
  user-select: none;
}
.month {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  line-height: 1;
  user-select: none;
}
</style>
