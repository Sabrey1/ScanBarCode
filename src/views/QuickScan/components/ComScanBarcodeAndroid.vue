<template>
  <ion-item button class="mb-2" lines="full">
    <ion-icon slot="start" :icon="cameraOutline"/>
    <ion-label>Select Camera"</ion-label>
    <ion-select
      @ionChange="startScanner"
      slot="end"  
      v-model="selectedCameraId"
    >
      <ion-select-option
        v-for="(d, index) in cameraList"
        :key="index"
        :value="d.id"
      >
        {{ d.label }}
      </ion-select-option>
    </ion-select>
  </ion-item>
    <div id="reader" style="width: 100%;"></div>
 
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'


import { cameraOutline } from 'ionicons/icons';
const emit = defineEmits();
const result = ref('')
let scanner = null

const selectedCameraId = ref('')
const cameraList = ref([])



const getCameraConfig = () => ({
  fps: 30,
  qrbox: 250,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true
  }
})

const startScanner = async () => {
  // Stop previous scanner if active
  if (scanner) {
    await scanner.stop().catch(() => {})
  }

  window.storageService.setItem('selectedCameraId', selectedCameraId.value)

  scanner = new Html5Qrcode('reader')
  scanner.start(
    selectedCameraId.value,
    getCameraConfig(),
    (decodedText) => {
      if (isScanning.value) return
      isScanning.value = true
 
         
      result.value = decodedText
      
      scanner.stop()
      emit("onScanBarcode", result.value)
      setTimeout(() => {
        isScanning.value = false
      }, 1000)
    },
    (errorMessage) => {
      // You may log or ignore scan errors here
    }
  )
}

onMounted(async () => {
  const devices = await Html5Qrcode.getCameras()
  if (devices && devices.length) {
    cameraList.value = devices

    const savedCameraId = window.storageService.getItem('selectedCameraId')
    if (savedCameraId && savedCameraId !== 'undefined') {
      selectedCameraId.value = savedCameraId.toString()
    } else {
      selectedCameraId.value = devices[0].id
    }
  }

  await startScanner()
})

onBeforeUnmount(() => {
  if (scanner) {
    scanner.stop().catch(console.error)
  }
})
</script>

<style scoped>
#reader{
  border-radius: 20px;
  overflow: hidden;
}
</style>