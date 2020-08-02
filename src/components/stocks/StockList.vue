<template>
	<v-card>
		<v-toolbar color="cyan" dark>
			<v-app-bar-nav-icon></v-app-bar-nav-icon>

			<v-toolbar-title>Inbox</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-btn icon>
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
		</v-toolbar>

		<v-list three-line max-height="80vh" style="overflow-y: scroll">
			<template>
				<v-list-item @click="doStuff" v-for="s in stockContext" :key="s.id">
					<v-list-item-avatar>
						<v-avatar :color="s.bias === 'bull' ? 'success' : 'error'">
							<v-icon color="white" x-large dark>
								{{ s.bias === 'bull' ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
							</v-icon>
						</v-avatar>
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title>
							{{ getStock(s.id).name }}
						</v-list-item-title>
						<v-list-item-subtitle>{{ getStock(s.id).list }} - </v-list-item-subtitle>
						{{ s.bias === 'bear' ? 'Buy' : 'Sell' }} @ {{ s.triggerPrice.toFixed(1) }}
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-list>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import DBWrapper from '@/services/DBWrapper'
import { StockContext, Stock } from '@/types'

const { db } = new DBWrapper()

export default Vue.extend({
	computed: {
		stocks(): Map<number, Stock> {
			return new Map(this.allStocks.map(s => [s.id, s]))
		}
	},

	data() {
		return {
			stockContext: [] as StockContext[],
			allStocks: [] as Stock[]
		}
	},

	methods: {
		doStuff() {
			console.log('stuff')
		},

		getStock(id: number): Stock | {} {
			const stock = this.stocks.get(id)

			if (stock) {
				return stock
			} else {
				return {}
			}
		}
	},

	firestore: {
		stockContext: db.collection('context'),
		allStocks: db.collection('securities')
	}
})
</script>

<style scoped></style>
