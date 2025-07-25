<template>
    <ion-header>
    <ion-toolbar>
      <ion-title>Header</ion-title>
    </ion-toolbar>
  </ion-header>
    <ion-content class="ion-padding">
        <div class="designscan">
              
        </div>
    </ion-content>
    
</template>
<script setup>
 import { IonHeader, IonTitle, IonToolbar, IonContent, IonButtons, IonBackButton } from '@ionic/vue';
</script>

<style scoped>
.designscan {
  width: 100%;
  height: auto;
  background-color: red;
}
</style>