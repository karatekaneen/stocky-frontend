<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col cols="10" xs="12" md="12" sm="12">
				<stock-table />
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import StockTable from '@/components/stocks/StockTable.vue'

export default Vue.extend({
	components: { StockTable }
})
</script>

<style scoped></style>
