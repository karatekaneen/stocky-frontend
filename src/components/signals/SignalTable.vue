<template>
	<v-card light rounded>
		<v-card-title>
			Signals
			<v-spacer />
			<slot name="actions" />
		</v-card-title>
		<v-data-table
			:headers="headers"
			:items="enrichedSignals"
			:items-per-page="10"
			sort-by="date"
			sort-desc
			class="elevation-1"
		></v-data-table>
	</v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Signal } from '@/types'

export default Vue.extend({
	props: {
		signals: {
			type: Array as PropType<Signal[]>,
			required: true
		}
	},

	computed: {
		enrichedSignals(): Signal[] {
			return this.signals.map(s => {
				const d = new Date(s.date)
				return { ...s, date: d.toLocaleDateString() }
			})
		}
	},

	data() {
		return {
			headers: [
				{
					text: 'Date',
					align: 'start',
					value: 'date'
				},
				{ text: 'Action', value: 'action' },
				{ text: 'Price', value: 'price' }
			]
		}
	}
})
</script>

<style scoped></style>
