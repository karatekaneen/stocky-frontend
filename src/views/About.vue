<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col>
				<v-card>
					<v-card-title>
						Volume Study
					</v-card-title>
					<v-card-subtitle>
						Average 200 day volume (on the day of the entry) compared to result of the trade.
					</v-card-subtitle>
					<div style="max-width: 200px; margin: 20px;">
						<v-text-field
							label="Number of groups"
							v-model="numberOfBuckets"
							class="mt-0 pt-0"
							type="number"
						></v-text-field>
					</div>
					<v-row align="center" justify="center">
						<v-col
							:md="chart.fullWidth ? 12 : 6"
							sm="12"
							v-for="chart in charts"
							:key="chart.index"
						>
							<v-card outlined>
								<v-card-title>
									{{ chart.name }}
									<v-spacer />
									<v-icon @click="chart.fullWidth = !chart.fullWidth">
										{{ chart.fullWidth ? 'fullscreen_exit' : 'fullscreen' }}
									</v-icon>
								</v-card-title>
								<v-card-subtitle>
									{{ chart.description }}
								</v-card-subtitle>
								<v-card-text>
									<apexchart
										type="bar"
										:options="chart.options"
										:series="chart.series"
									></apexchart>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import DBWrapper from '@/services/DBWrapper'
import VueApexCharts from 'vue-apexcharts'

const { db } = new DBWrapper()

type ScatterSeries = {
	name: string
	data: number[][]
}

type VolumeComparison = {
	result: number
	volume: number
}

type StatisticSummary = {
	winrate: number
	averageTrade: number
	averageWin: number
	averageLoss: number
	gainLossFactor: number
	profitFactor: number
}

export default Vue.extend({
	components: { apexchart: VueApexCharts },

	watch: {
		numberOfBuckets: {
			immediate: true,
			handler(numberBuckets) {
				this.createBuckets(Math.min(Math.max(numberBuckets, 0), 20))
			}
		},

		volumeComparisons: {
			handler() {
				this.createBuckets(this.numberOfBuckets)
			}
		}
	},
	data() {
		return {
			numberOfBuckets: 3,
			volumeComparisons: null as { data: VolumeComparison[] } | null,

			options: {
				chart: {
					id: 'vuechart-example'
				},
				xaxis: {
					categories: [] as unknown[],
					labels: {
						style: {
							colors: '#FFFFFF'
						}
					}
				},
				yaxis: {
					labels: {
						style: {
							colors: '#FFFFFF'
						}
					}
				},
				tooltip: {
					theme: 'dark'
				}
			},

			charts: [] as unknown[]
		}
	},

	methods: {
		createBuckets(numberOfBuckets = 3): void {
			const data = this.volumeComparisons?.data || []
			const output: VolumeComparison[][] = []

			data.forEach((d, i) => {
				const bucketIndex = Math.floor(i / (data.length / numberOfBuckets))

				if (!output[bucketIndex]) {
					output[bucketIndex] = []
				}

				output[bucketIndex].push(d)
			})

			const buckets: ({ name: string } & StatisticSummary)[] = [data, ...output].map(
				(bucket, index) => {
					return {
						name: this.getBucketName(bucket, index),
						...this.calculateStats(bucket)
					}
				}
			)

			this.createChart(buckets)
		},

		getBucketName(bucket: VolumeComparison[], index: number): string {
			if (index === 0) {
				return `All (${bucket.length})`
			}

			const startVol = Math.round(bucket[0].volume / 1000)
			const endVol = Math.round(bucket[bucket.length - 1].volume / 1000)
			return `${startVol}-${endVol}k SEK (${bucket.length})`
		},

		calculateStats(bucket: VolumeComparison[]): StatisticSummary {
			const allResults = bucket.map(({ result }) => result)

			const { winners, losers } = allResults.reduce(
				(acc, item) => {
					if (item > 0) {
						acc.winners.push(item)
					} else {
						acc.losers.push(item)
					}

					return acc
				},
				{ winners: [] as number[], losers: [] as number[] }
			)

			const toTwoDecimals = (n: number): number => Math.round(n * 100) / 100
			const sumResults = (arr: number[]): number =>
				arr.length > 0 ? arr.reduce((sum, item) => (sum += item)) : 0

			const output = {
				winrate: toTwoDecimals((winners.length / allResults.length) * 100),
				averageTrade: toTwoDecimals((sumResults(allResults) / allResults.length) * 100),
				averageWin: toTwoDecimals((sumResults(winners) / winners.length) * 100),
				averageLoss: -toTwoDecimals((sumResults(losers) / losers.length) * 100),
				profitFactor: toTwoDecimals(sumResults(winners) / -sumResults(losers))
			} as StatisticSummary

			output.gainLossFactor = toTwoDecimals(output.averageWin / output.averageLoss)

			return output
			// Här ska värden läggas till som typ winrate, avg win/avg loss, profit factor osv
		},

		createChart(buckets: ({ name: string } & StatisticSummary)[]): void {
			const categories = buckets.map(b => b.name)

			this.charts = [
				{ type: 'winrate', name: 'Winrate', description: 'Winrate in %' },
				{
					type: 'averageTrade',
					name: 'Average Trade',
					description: 'The return of the average trade in percent'
				},
				{
					type: 'profitFactor',
					name: 'Profit Factor',
					description: 'Amount won divided by amount lost'
				},
				{
					type: 'gainLossFactor',
					name: 'Average winner/Average Loser',
					description: 'Average winner divided by average loser'
				}
			].map(({ type, name, description }) => {
				const data = buckets.map(d => d[type as keyof StatisticSummary])
				return {
					fullWidth: false,
					name,
					description,
					options: { ...this.options, xaxis: { ...this.options.xaxis, categories } },
					series: [{ name: type.toLocaleUpperCase(), data }]
				}
			})
		}
	},
	firestore: {
		volumeComparisons: db.collection('statistics').doc('volume-to-result')
	}
})
</script>

<style scoped></style>
