<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { VITE_PARKING_FLOORPLAN } from '@/env.js'
  import ParkingSlot from '@/components/Parking/ParkingSlot.vue'

//      width="752px" height="615px">
  const router = useRouter()
  const imgData = ref(null)
  const fpName = ref('')
  const fpFloor = ref(null)
  const fpBldg = ref('')

  const getImgData = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => {
      imgData.value = reader.result
      }
    }
  }

  const createBooking = (e) => {
    if (fpName.value 
      && fpFloor.value 
      && fpBldg.value
      && imgData.value
      ) {
      //save imgData.value in storage, load it in the next view
      sessionStorage.setItem('fpimg', imgData.value)
      const rProps = `/${fpName.value}`
        + `/${fpFloor.value}`
        + `/${fpBldg.value}`
      router.push(`/dashboard/setslots${rProps}`)
    }
  }
</script>
<template>
  <h1>Parking Admin</h1>
  <div>
    <div>
<!--       <img :src="VITE_PARKING_FLOORPLAN" alt="" -->
<!--         width="552px" height="415px"> -->
    </div>
    <div>
      <form
        class="create-form"
        v-on:submit.prevent="createBooking"
        enctype="multipart/form-data"
        >
        <div>
          <label for="fpname">Name:</label>
          <input type="text" id="fpname" v-model="fpName">
        </div>
        <div>
          <label for="fpfloor">Floor:</label>
          <input type="text" id="fpfloor" v-model="fpFloor">
        </div>
        <div>
          <label for="fpbldg">Building:</label>
          <input type="text" id="fpbldg" v-model="fpBldg">
        </div>
        <div>
          <label for="fpimg">Floorplan Image:</label>
          <input type="file" 
            name="imageFloorplan" 
            id="fpimg"
            accept=".png, .jpeg, .jpg"
            v-on:change="getImgData"
            >
          <img v-if="imgData" :src="imgData"
                alt="floorplan image"/>
        </div>
        <button type="submit">NEXT</button>
      </form>
    </div>
  </div>

</template>
<style>
  .create-form {
    display: flex;
    flex-direction: column; 
    gap: 10px;
  }

  .create-form div {
    display: flex;
    flex-direction: column;
  }
</style>
