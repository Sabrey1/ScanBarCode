<template>
  <ion-searchbar></ion-searchbar>

  <ion-grid>
    <!-- Row 1 -->
    <ion-row>
      <ion-col size="6">
        <ion-card button color="primary" routerLink="/quickscan">
          <ion-card-header style="display: flex; justify-content: center; align-items: center;">
                <ion-icon :icon="scanOutline " size="large"></ion-icon>
            </ion-card-header>
          <ion-card-content>
            Quick Scan  
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="6">
        <ion-card button color="secondary" routerLink="/designscan">
          <ion-card-header style="display: flex; justify-content: center; align-items: center;">
                <ion-icon :icon="qrCodeOutline" size="large" ></ion-icon>
            </ion-card-header>
          <ion-card-content>
            Design Scan  
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>

    <!-- Row 2 -->
    <ion-row>
      <ion-col size="6">
        <ion-card button color="tertiary">
          <ion-card-header style="display: flex; justify-content: center; align-items: center;">
                <ion-icon :icon="planet" size="large" ></ion-icon>
            </ion-card-header>
          <ion-card-content>
            History  
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="6">
        <ion-card button color="danger">
          <ion-card-header style="display: flex; justify-content: center; align-items: center;">
                <ion-icon :icon="logInOutline" size="large" ></ion-icon>
            </ion-card-header>
          <ion-card-content>
            Logout  
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup>
import {
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue';
  import { IonIcon } from '@ionic/vue';

import { logInOutline, planet, qrCodeOutline, scanOutline } from 'ionicons/icons';
</script>

<style scoped>
ion-col {
  text-align: center;
}
</style>
