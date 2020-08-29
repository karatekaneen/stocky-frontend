<template>
	<v-container fluid>
		<div>{{ $route.params.id }}</div>
		<v-row>
			<v-col :cols="chartFullWidth ? 12 : 12">
				<price-chart
					v-if="signalDoc && signalDoc.signals"
					:signals="signalDoc.signals"
					:stockId="$route.params.id"
				>
					<template #actions>
						<v-icon @click="chartFullWidth = !chartFullWidth">
							{{ chartFullWidth ? 'fullscreen_exit' : 'fullscreen' }}
						</v-icon>
					</template>
				</price-chart>
			</v-col>
			<v-col :cols="signalFullWidth ? 12 : 6" v-if="signalDoc && signalDoc.signals">
				<signal-table :signals="signalDoc.signals">
					<template #actions>
						<v-icon @click="signalFullWidth = !signalFullWidth">
							{{ signalFullWidth ? 'fullscreen_exit' : 'fullscreen' }}
						</v-icon>
					</template>
				</signal-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Signal } from '@/types'
import DBWrapper from '@/services/DBWrapper'
import SignalTable from '@/components/signals/SignalTable.vue'
import PriceChart from '@/components/charts/PriceChart.vue'

const { db } = new DBWrapper()

export default Vue.extend({
	components: { SignalTable, PriceChart },

	computed: {
		signalFullWidth: {
			get: function() {
				return this.$store.state.signalsFullWidth
			},

			set: function(val: boolean): void {
				this.$store.commit('setSignalFullWidth', val)
			}
		}
	},

	data() {
		return {
			signalDoc: [] as Signal[],
			chartFullWidth: false
		}
	},

	created() {
		this.$bind('signalDoc', db.collection('signals').doc(this.$route.params.id))
	}
})
</script>

<style scoped></style>
