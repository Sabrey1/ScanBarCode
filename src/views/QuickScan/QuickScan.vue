<template>
<h1>this is QuickScan</h1>
<ComScanBarcodeAndroid @onScanBarcode="onScanBarcode"/>
</template>

<script setup>
import ComScanBarcodeAndroid from './components/ComScanBarcodeAndroid.vue'
</script>

<style>
/* test */
</style>