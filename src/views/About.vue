<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col md="6" sm="12">
				<statistic-summary documentName="volume-to-result" :nameFunc="volumeNamingFunc">
					<template #title>Volume Study</template>
					<template #description>
						Average 200 day volume (on the day of the entry) compared to result of the trade.
					</template>
				</statistic-summary>
			</v-col>
			<v-col md="6" sm="12">
				<statistic-summary documentName="volume-ratio-to-result" :nameFunc="volumeNamingFunc">
					<template #title>Volume Ratio Study</template>
					<template #description>
						Average 50 day volume divided by the 200 day volume compared to result of the
						trade.
					</template>
				</statistic-summary>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import StatisticSummary from '@/components/statistics/StatisticSummary.vue'
import { VolumeComparison } from '@/types'

export default Vue.extend({
	components: { StatisticSummary },

	methods: {
		volumeNamingFunc(bucket: VolumeComparison[], index: number): string {
			if (index === 0) {
				return `All (${bucket.length})`
			}

			const startVol = Math.round(bucket[0].value * 100) / 100
			const endVol = Math.round(bucket[bucket.length - 1].value * 100) / 100
			return `${startVol}-${endVol} (${bucket.length})`
		}
	}
})
</script>

<style scoped></style>
