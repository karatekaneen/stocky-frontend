<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col cols="9">
				<div>
					Här ska det vara graf
				</div>
				<div>här ska det vara signal-tabell</div>
			</v-col>
			<v-col cols="3">
				<stock-list />
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import StockList from '@/components/stocks/StockList.vue'

export default Vue.extend({
	components: { StockList }
})
</script>

<style scoped></style>
