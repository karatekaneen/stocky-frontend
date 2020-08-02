<template>
	<v-container fluid>
		<pending-signal-table />
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PendingSignalTable from '@/components/signals/PendingSignalTable.vue'

export default Vue.extend({
	components: { PendingSignalTable }
	// stuff
})
</script>

<style scoped></style>
