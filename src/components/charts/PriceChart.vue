<template>
	<v-card light rounded>
		<v-card-actions>
			<slot name="actions" />
		</v-card-actions>
		<div style="width: 100%; height: 40vh">
			<div id="chartdiv" style="height: 100%"></div>
		</div>
		<!-- <apex-chart
			width="100%"
			:options="chartOptions"
			:series="[signalSeries.buys, signalSeries.sells, priceSeries]"
		/> -->
	</v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
// import VueApexCharts from 'vue-apexcharts'
import { Signal } from '@/types'
import DBWrapper from '@/services/DBWrapper'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'

const { db } = new DBWrapper()

type ChartDataPoint = {
	time: string
	close: number
	open: number
	high: number
	low: number
}
type ChartSeries = {
	name: string
	type: string
	data: ChartDataPoint[]
}

type SeriesMarker = {
	time: string
	position: 'belowBar' | 'aboveBar'
	color: string
	shape: 'arrowUp' | 'square'
	text: string
}

type PricePoint = {
	date: string
	close: number
	open: number
	high: number
	low: number
	owners: number | null
	volume: number
}

type PriceDocument = {
	lastPricePoint: string
	priceData: PricePoint[]
	type: string
}

export default Vue.extend({
	// components: { apexChart: VueApexCharts },

	props: {
		signals: {
			type: Array as PropType<Signal[]>,
			required: false
		},

		stockId: {
			type: String,
			required: true
		}
	},

	mounted() {
		this.$bind('priceDoc', db.collection('prices').doc(this.stockId))
		this.createChartInstance()
	},

	beforeDestroy() {
		this.chart?.remove()
	},

	computed: {
		signalMarkers(): SeriesMarker[] {
			return this.signals.map(({ date, action, price }) => {
				const buy = action === 'buy'
				const type = buy ? 'BUY' : 'SELL'
				return {
					time: date,
					position: buy ? 'belowBar' : 'aboveBar',
					color: buy ? 'green' : 'red',
					shape: buy ? 'arrowUp' : 'square',
					text: `${type} @ ${price}`
				}
			})
		}
	},

	watch: {
		priceDoc: {
			// immediate: true,
			// deep: true,
			handler(document: PriceDocument): void {
				const priceData = document.priceData || []
				this.priceData = priceData.map(({ date, open, high, low, close }) => ({
					time: date,
					high,
					low,
					close,
					open
				}))

				this.setSeries(this.priceData)
			}
		}
	},
	data() {
		return {
			priceDoc: null as PriceDocument | null,
			chart: null as IChartApi | null,
			priceData: [] as ChartDataPoint[],
			candleSeries: null as ISeriesApi<'Candlestick'> | null
		}
	},

	methods: {
		setSeries(priceData: ChartDataPoint[]) {
			if (!this.chart) {
				return
			}

			const series = this.candleSeries || this.chart.addCandlestickSeries()
			series.setData(priceData)

			series.setMarkers(this.signalMarkers)
		},

		createChartInstance() {
			this.chart = createChart('chartdiv', {
				layout: {
					backgroundColor: '#000000',
					textColor: 'rgba(255, 255, 255, 0.9)'
				},
				grid: {
					vertLines: {
						color: 'rgba(197, 203, 206, 0.15)'
					},
					horzLines: {
						color: 'rgba(197, 203, 206, 0)'
					}
				},
				// crosshair: {
				// 	mode: LightweightCharts.CrosshairMode.Normal
				// },
				rightPriceScale: {
					borderColor: 'rgba(197, 203, 206, 0.8)'
				},
				timeScale: {
					borderColor: 'rgba(197, 203, 206, 0.8)'
				}
			})

			this.chart.remove
		}
	}
})
</script>

<style scoped></style>
