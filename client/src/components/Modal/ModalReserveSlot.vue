<script setup>
  import { ref, onMounted } from 'vue'
  const emit = defineEmits([
    'hide'
  ])
  const submitReservation = () => {

  }
</script>
<template>
    <div class="modal-background">
      <div class=modal>
        <h3>Slot Reservation</h3>
        <form v-on:submit.prevent="submitReservation">
          <div>
            <label for="bookDate">Book Date: </label>
            <input type="date" id="bookDate" name="bookDate">
          </div>
          <div>
            <label for="bookTimeFrom">From: </label>
            <input type="time" id="bookTimeFrom" name="bookTimeFrom">
          </div>
          <div>
            <label for="bookTimeTo">To: </label>
            <input type="time" id="bookTimeTo" name="bookTimeTo">
          </div>
          <div>
            <button type="submit">Submit</button>
            <button v-on:click="$emit('hide')">Cancel</button>
          </div>
        </form>
      </div>
    </div>
</template>
<style>
  .modal {
    width:  22.2rem;
    background-color: var(--platinum);
    text-align: center;
    border-radius: 14px;
  }
  .modal form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 24px;
  }
  .modal-background {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(100, 100, 100, .9);
    z-index: 10;
  }
</style>
