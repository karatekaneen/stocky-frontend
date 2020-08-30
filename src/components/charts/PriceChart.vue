<template>
	<v-card light rounded>
		<v-card-actions>
			<slot name="actions" />
		</v-card-actions>
		<div style="width: 100%; height: 60vh">
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

type CandlestickDatapoint = {
	time: string
	close: number
	open: number
	high: number
	low: number
}

type VolumeDatapoint = {
	time: string
	value: number
	color?: string
}

type ChartSeries = {
	name: string
	type: string
	data: CandlestickDatapoint[]
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

				const { price, volume } = priceData.reduce(
					(agg, { date, open, high, low, close, volume }) => {
						agg.price.push({
							time: date,
							high,
							low,
							close,
							open
						})

						agg.volume.push({ time: date, value: ((close + open + high + low) / 4) * volume })

						return agg
					},
					{ price: [] as CandlestickDatapoint[], volume: [] as VolumeDatapoint[] }
				)

				this.priceData = price
				this.volumeData = volume
				this.setSeries(this.priceData, this.volumeData)
			}
		}
	},
	data() {
		return {
			priceDoc: null as PriceDocument | null,
			chart: null as IChartApi | null,
			priceData: [] as CandlestickDatapoint[],
			volumeData: [] as VolumeDatapoint[],
			priceSeries: null as ISeriesApi<'Candlestick'> | null,
			volumeSeries: null as ISeriesApi<'Histogram'> | null
		}
	},

	methods: {
		setSeries(priceData: CandlestickDatapoint[], volumeData: VolumeDatapoint[]) {
			if (!this.chart) {
				return
			}

			const priceSeries = this.priceSeries || this.chart.addCandlestickSeries()
			priceSeries.setData(priceData)

			const volumeSeries =
				this.volumeSeries ||
				this.chart.addHistogramSeries({
					color: '#ccc',
					priceFormat: {
						type: 'volume'
					},
					priceScaleId: '',
					scaleMargins: {
						top: 0.8,
						bottom: 0
					}
				})
			volumeSeries.setData(volumeData)
			priceSeries.setMarkers(this.signalMarkers)
		},

		createChartInstance() {
			this.chart = createChart('chartdiv', {
				layout: {
					backgroundColor: '#000000',
					textColor: 'rgba(255, 255, 255, 0.9)'
				},
				watermark: {
					visible: true,
					fontSize: 24,
					horzAlign: 'center',
					vertAlign: 'center',
					color: 'rgba(100, 101, 188, 0.5)',
					text: 'Stock Name'
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
		}
	}
})
</script>

<style scoped></style>
