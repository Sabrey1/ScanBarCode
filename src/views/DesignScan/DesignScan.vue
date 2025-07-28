<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Design Scan</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <label>
        Canvas Width (mm):
        <input
          type="number"
          v-model.number="canvasWidthMM"
          @change="updateCanvasSizeFromMM"
          min="10"
        />
      </label>

      <label>
        Canvas Height (mm):
        <input
          type="number"
          v-model.number="canvasHeightMM"
          @change="updateCanvasSizeFromMM"
          min="10"
        />
      </label>
    <div class="upload-container">
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none;"
        @change="onFileChange"
      />

      <!-- Draggable uploaded image -->
      <div
        v-if="imageUrl"
        class="draggable"
        :style="{ top: imagePos.y + 'px', left: imagePos.x + 'px' }"
        @mousedown="startDragImage"
        @touchstart.prevent="startTouchDragImage"
      >
        <img
          :src="imageUrl"
          alt="Uploaded"
          width="160"
          height="160"
          draggable="false"
          style="border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: grab;"
        />
      </div>

      <!-- Draggable text boxes -->
      <div
        v-for="(txt, index) in texts"
        :key="txt.id"
        class="draggable text-box"
        :style="{ top: txt.y + 'px', left: txt.x + 'px' }"
        @mousedown="startDragText($event, index)"
        @touchstart="onTouchStartText($event, index)"
        @touchend="onTouchEndText"
        contenteditable="true"
        @input="onTextInput($event, index)"
        @focus="focusedTextId = txt.id"
        @blur="focusedTextId = null"
        spellcheck="false"
        tabindex="0"
      >{{ txt.content }}</div>
    </div>

    <div class="buttons text-center" style="margin-top: 20px;">
      <ion-button @click="triggerUpload" size="normal" class="flex items-center space-x-2">
        <i class="fa-solid fa-upload" style="margin-right: 10px;"></i>
        <span>Upload</span>
      </ion-button>
      <ion-button @click="scan" size="normal" class="flex items-center space-x-2">
        <ion-icon :icon="scanOutline "></ion-icon>
        <span style="margin-left: 10px;">Scan QR</span>
      </ion-button>
      <ion-button @click="generateQr" size="normal" class="flex items-center space-x-2">
        <ion-icon :icon="qrCodeOutline"></ion-icon>
        <span style="margin-left: 10px;">Generate QR</span>
      </ion-button>
      <ion-button @click="addText" size="normal" class="flex items-center space-x-2">
        <i class="fa-solid fa-pen-to-square" style="margin-right: 10px;"></i>
        <span>Add Text</span>
      </ion-button>
      <ion-button @click="print" size="normal" class="flex items-center space-x-2">
        <i class="fa-solid fa-print" style="margin-right: 10px;"></i>
        <span>Print</span>
      </ion-button>
    </div>
  </ion-content>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { IonHeader, IonTitle, IonToolbar, IonContent, IonButton } from '@ionic/vue'
import { IonIcon } from '@ionic/vue';

import { logInOutline, planet, qrCodeOutline, scanOutline } from 'ionicons/icons';
const fileInput = ref(null)
const imageUrl = ref(null)

// Image position state
const imagePos = reactive({ x: 100, y: 100 })

// Dragging state for image
let draggingImage = false
let imageOffsetX = 0
let imageOffsetY = 0
let touchIdImage = null

// Multiple texts state
const texts = reactive([])

// Dragging state for texts
let draggingTextIndex = null
let draggingText = false
let textOffsetX = 0
let textOffsetY = 0
let touchIdText = null

// Track currently focused text id for delete key
const focusedTextId = ref(null)

// Touch drag delay tracking for text dragging
let touchDragTimeout = null
let isDraggingTouch = false

function triggerUpload() {
  fileInput.value.click()
}

function scan() {
  alert('Scan QR function called')
}
function generateQr() {
  alert('Generate QR function called')
}
function onFileChange(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    imageUrl.value = URL.createObjectURL(file)
    imagePos.x = 100
    imagePos.y = 100
  } else {
    imageUrl.value = null
  }
}

// Image drag handlers
function startDragImage(event) {
  draggingImage = true
  imageOffsetX = event.clientX - imagePos.x
  imageOffsetY = event.clientY - imagePos.y
  event.target.style.cursor = 'grabbing'
}

function startTouchDragImage(event) {
  if (draggingImage) return
  const touch = event.changedTouches[0]
  touchIdImage = touch.identifier
  draggingImage = true
  imageOffsetX = touch.clientX - imagePos.x
  imageOffsetY = touch.clientY - imagePos.y
}

function onMouseMove(event) {
  if (draggingImage) {
    imagePos.x = event.clientX - imageOffsetX
    imagePos.y = event.clientY - imageOffsetY
  } else if (draggingText) {
    moveText(event.clientX, event.clientY)
  }
}

function onMouseUp(event) {
  draggingImage = false
  draggingText = false
}

function onTouchMove(event) {
  if (draggingImage) {
    const touch = [...event.changedTouches].find(t => t.identifier === touchIdImage)
    if (!touch) return
    imagePos.x = touch.clientX - imageOffsetX
    imagePos.y = touch.clientY - imageOffsetY
  } else if (draggingText) {
    const touch = [...event.changedTouches].find(t => t.identifier === touchIdText)
    if (!touch) return
    moveText(touch.clientX, touch.clientY)
  }
}

function onTouchEnd(event) {
  const endedTouchImage = [...event.changedTouches].find(t => t.identifier === touchIdImage)
  if (endedTouchImage) {
    draggingImage = false
    touchIdImage = null
  }
  const endedTouchText = [...event.changedTouches].find(t => t.identifier === touchIdText)
  if (endedTouchText) {
    draggingText = false
    draggingTextIndex = null
    touchIdText = null
  }
  if (touchDragTimeout) {
    clearTimeout(touchDragTimeout)
    touchDragTimeout = null
  }
  isDraggingTouch = false
}

// Text drag handlers
function startDragText(event, index) {
  draggingText = true
  draggingTextIndex = index
  textOffsetX = event.clientX - texts[index].x
  textOffsetY = event.clientY - texts[index].y
  event.target.style.cursor = 'grabbing'
  event.target.focus()
}

function startTouchDragText(event, index) {
  if (draggingText) return
  const touch = event.changedTouches[0]
  touchIdText = touch.identifier
  draggingText = true
  draggingTextIndex = index
  textOffsetX = touch.clientX - texts[index].x
  textOffsetY = touch.clientY - texts[index].y
}

function moveText(clientX, clientY) {
  if (draggingTextIndex !== null) {
    texts[draggingTextIndex].x = clientX - textOffsetX
    texts[draggingTextIndex].y = clientY - textOffsetY
  }
}

function onTextInput(event, index) {
  texts[index].content = event.target.innerText
}

function addText() {
  texts.push({
    id: Date.now(),
    content: 'New Text',
    x: 50,
    y: 50,
  })
}

function print() {
  alert('Print function called')
}

// Touch start handler for text boxes with delay to differentiate tap vs drag
function onTouchStartText(event, index) {
  if (touchDragTimeout) clearTimeout(touchDragTimeout)
  isDraggingTouch = false
  touchDragTimeout = setTimeout(() => {
    isDraggingTouch = true
    startTouchDragText(event, index)
  }, 150)
}

// Touch end handler for text boxes
function onTouchEndText(event) {
  if (touchDragTimeout) {
    clearTimeout(touchDragTimeout)
    touchDragTimeout = null
  }
  if (!isDraggingTouch) {
    // Tap: do nothing, allow editing & keyboard
    return
  }
  // Drag handled in global onTouchEnd
}

// Delete text box on Delete key only (Backspace deletes text normally)
function onKeyDown(event) {
  if (event.key === 'Delete' && focusedTextId.value !== null) {
    const index = texts.findIndex(t => t.id === focusedTextId.value)
    if (index !== -1) {
      texts.splice(index, 1)
      focusedTextId.value = null
      event.preventDefault()
    }
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd)
  window.addEventListener('touchcancel', onTouchEnd)

  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)

  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('touchcancel', onTouchEnd)

  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.upload-container {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #eee;
  border-radius: 12px;
  overflow: hidden;
  user-select: none;
}

.draggable {
  position: absolute;
  user-select: none;
}

.text-box {
  padding: 4px 8px;
  min-width: 80px;
  /* background: white; */
  /* border: 1px solid #aaa; */
  border-radius: 4px;
  cursor: grab;
  /* box-shadow: 1px 1px 4px rgba(0,0,0,0.2); */
  white-space: pre-wrap;
  outline: none;
  user-select: text;
}
</style>
