<template>
	<v-card light rounded>
		<v-card-actions>
			<v-btn @click="loading = !loading">xxxxx</v-btn>
			<v-spacer />
			<slot name="actions" />
		</v-card-actions>
		<apex-chart width="100%" :options="chartOptions" :series="[signalSeries]" />

		<v-skeleton-loader :loading="loading" transition="scale-transition" type="image">
			<!-- height="94" -->
			<v-card> </v-card>
		</v-skeleton-loader>
	</v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import VueApexCharts from 'vue-apexcharts'
import { Signal } from '@/types'

type ChartDataPoint = {
	x: number | string
	y: number
}
type ChartSeries = {
	name: string
	type: string
	data: ChartDataPoint[]
}

export default Vue.extend({
	components: { apexChart: VueApexCharts },

	props: {
		signals: {
			type: Array as PropType<Signal[]>,
			required: false
		}
	},

	computed: {
		signalSeries(): ChartSeries {
			let data = [] as ChartDataPoint[]
			if (this.signals) {
				data = this.signals.map(({ date, price }) => ({ x: date, y: price }))
			}

			return { name: 'Signals', type: 'scatter', data }
		}
	},
	data() {
		return {
			loading: true,
			series: [
				{
					name: 'Signals',
					type: 'scatter',

					data: [
						{
							x: 1,
							y: 2.14
						},
						{
							x: 1.2,
							y: 2.19
						},
						{
							x: 1.8,
							y: 2.43
						},
						{
							x: 2.3,
							y: 3.8
						},
						{
							x: 2.6,
							y: 4.14
						},
						{
							x: 2.9,
							y: 5.4
						},
						{
							x: 3.2,
							y: 5.8
						},
						{
							x: 3.8,
							y: 6.04
						},
						{
							x: 4.55,
							y: 6.77
						},
						{
							x: 4.9,
							y: 8.1
						},
						{
							x: 5.1,
							y: 9.4
						},
						{
							x: 7.1,
							y: 7.14
						},
						{
							x: 9.18,
							y: 8.4
						}
					]
				}
			],
			// {
			// 	name: 'Line',
			// 	type: 'line',
			// 	data: [
			// 		{
			// 			x: 1,
			// 			y: 2
			// 		},
			// 		{
			// 			x: 2,
			// 			y: 3
			// 		},
			// 		{
			// 			x: 3,
			// 			y: 4
			// 		},
			// 		{
			// 			x: 4,
			// 			y: 5
			// 		},
			// 		{
			// 			x: 5,
			// 			y: 6
			// 		},
			// 		{
			// 			x: 6,
			// 			y: 7
			// 		},
			// 		{
			// 			x: 7,
			// 			y: 8
			// 		},
			// 		{
			// 			x: 8,
			// 			y: 9
			// 		},
			// 		{
			// 			x: 12,
			// 			y: 10
			// 		},
			// 		{
			// 			x: 15,
			// 			y: 11
			// 		}
			// 	]
			// }
			// ],
			chartOptions: {
				chart: {
					height: 400,
					type: 'line'
				},
				fill: {
					type: 'solid'
				},
				colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
				markers: {
					size: [6, 10]
				},
				tooltip: {
					shared: false,
					intersect: true
				},
				legend: {
					show: false
				},
				xaxis: {
					type: 'numeric',
					min: 0,
					max: 12,
					tickAmount: 12
				}
			}
		}
	}
})
</script>

<style scoped></style>
