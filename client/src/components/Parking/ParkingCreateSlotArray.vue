<script setup>
  import { ref, onMounted } from 'vue'
  import ParkingCreateSlot from '@/components/Parking/ParkingCreateSlot.vue'
  import { getIntPx } from './utils.js'

  const props = defineProps([
    'startX',
    'startY',
    'slotWidth',
    'slotHeight'
  ])
  const emit = defineEmits(['doneEdit'])

  const dState = {
    INIT: 0,
    DRAGGING: 1,
    DRAG_END: 2,
  }
  
  const slotArr = ref([])
  const style = ref({})
  const slotArrStyle = ref({})

  const dragState = ref(dState.INIT)

  const dragStart = () => {
    if (dragState.value === dState.INIT) {
      dragState.value = dState.DRAGGING
    }
  }

  const drag = (e) => {
    if (dragState.value === dState.DRAGGING) {
      const pos = [e.movementX, e.movementY]
      const left = getIntPx(style.value.left)
      const top = getIntPx(style.value.top)
      style.value.left = `${left + pos[0]}px`
      style.value.top = `${top + pos[1]}px`
    }
  }

  const dragEnd = () => {
    if (dragState.value === dState.DRAGGING) {
      dragState.value = dState.INIT
    }
  }

  function setGap(e) {
    const min = 1
    const max = 101
    const val = parseInt(e.target.value)
    if (val > min && val < max) {
      slotArrStyle.value.gap = `${val}px`
    }
  }

  function add(e) {
    slotArr.value.push({
      w: props.slotWidth,
      h: props.slotHeight
    })
  }

  function remove(e) {
    slotArr.value.pop()
  }

  function save(e) {
    emit('doneEdit')
  }

  function rotate(e) {
    if (!slotArrStyle.value.flexDirection
      || slotArrStyle.value.flexDirection === 'row') {
      slotArrStyle.value.flexDirection = 'column'
    }
    else if (slotArrStyle.value.flexDirection === 'column') {
      slotArrStyle.value.flexDirection = 'row'
    }
  }

  onMounted(() => {
    slotArr.value.push({
      w: props.slotWidth,
      h: props.slotHeight
    })
    style.value.left = `${props.startX}px`
    style.value.top = `${props.startY}px`
  })

</script>
<template>
  <div class="slot-array-container"
      :style="style"
      v-on:mousedown="dragStart"
      v-on:mousemove="drag"
      v-on:mouseup="dragEnd"
      v-on:mouseout="dragEnd"
      >
    <div 
      class="slot-array"
      :style="slotArrStyle"
      >
        <ParkingCreateSlot v-for="item in slotArr"
          v-bind="item"
          />
    </div>
    <button v-on:click="add">+</button>
    <button v-on:click="remove">-</button>
    <button v-on:click="rotate">rotate</button>
    <input type="number" placeholder="gap" min="1" max="100" v-on:change="setGap">
    <button v-on:click="save">OK</button>
  </div>
</template>
<style>
  .slot-array-container {
    display: flex;
    position: absolute;
  }

  .slot-array-container input {
    width: 3em;
  }

  .slot-array {
    display: flex;
    flex-direction: row; /*TODO should be able to set this in UI*/
  }
</style>
