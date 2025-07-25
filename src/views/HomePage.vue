<template>
   <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu Content</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">This is the menu content.</ion-content>
  </ion-menu>


  <ion-page id="main-content" >
    <ion-header >
      <ion-toolbar>
  <ion-buttons slot="start">
    <ion-menu-button></ion-menu-button>
  </ion-buttons>
  <ion-title>Menu</ion-title>
  <ion-buttons slot="end" class="ion-margin-end" @click="scan">
    <i class="fas fa-qrcode"></i>
  </ion-buttons>
</ion-toolbar>

    </ion-header>
    <ion-content class="ion-no-padding">
      <ComMenu/>
    </ion-content>
  </ion-page>
</template>

<script setup>
  import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import ComMenu from "../views/components/ComMenu.vue"
 
function scan(){
  alert("scan")
}
</script>
<style scoped>
/* css */
</style>