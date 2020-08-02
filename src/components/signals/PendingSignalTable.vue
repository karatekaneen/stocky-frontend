<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col cols="9" md="10" sm="12" xs="12">
				<v-card light shaped>
					<v-card-title>
						Pending signals
					</v-card-title>
					<v-card-subtitle>
						Signaler som skall exekveras vid nästa öppning. Uppdateras ca 19:15
					</v-card-subtitle>

					<v-card-text>
						<v-data-table
							:headers="headers"
							:items="signals"
							:items-per-page="50"
							class="elevation-1"
						/>
					</v-card-text>

					<v-card-actions>
						Some actions here
						<v-spacer />
						<v-btn fab x-small color="accent" @click="testa">
							<v-icon>
								delete
							</v-icon>
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import DBWrapper from '@/services/DBWrapper'

const { db } = new DBWrapper()

type Stock = {
	name: string
	list: string
	id: number
}

type PendingSignal = {
	date: string
	type: string
	action: string
	price: null
	stock: Stock
	status: string
}

export default Vue.extend({
	data() {
		return {
			signals: [] as PendingSignal[],
			headers: [
				{
					text: 'Stock',
					align: 'start',
					value: 'stock.name'
				},
				{ text: 'Type', value: 'type' },
				{ text: 'action', value: 'action' },
				{ text: 'List', value: 'stock.list' }
			]
		}
	},

	methods: {
		async testa() {
			const d = await db.collection('pending-signals').get()
			d.docs.forEach(doc => {
				console.log(doc.data())
			})
		}
	},

	firestore: {
		signals: db.collection('pending-signals')
	}
	// stuff
})
</script>

<style scoped></style>
