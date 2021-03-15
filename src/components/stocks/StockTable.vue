<template>
	<v-card>
		<v-card-title>
			<v-text-field
				v-model="search"
				append-icon="search"
				label="Search"
				single-line
				hide-details
			/>
		</v-card-title>
		<v-data-table
			:headers="headers"
			:items="enrichedStocks"
			:search="search"
			sort-by="stock.name"
			group-by="stock.list"
			:items-per-page="25"
			show-group-by
			@click:row="goToDetails"
		/>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { StockContext, Stock } from '@/types'

type StockViewModel = StockContext & { stock: Stock }

export default Vue.extend({
	computed: {
		stocks(): Map<number, Stock> {
			return new Map(this.$store.state.stocks.map((s: Stock) => [s.id, s]))
		},

		enrichedStocks(): StockViewModel[] {
			const stockContext = this.$store.state.stockContexts as StockContext[]
			if (stockContext.length < 1 || this.stocks.size < 1) {
				return []
			}

			return stockContext.map(sc => {
				const stock = this.stocks.get(sc.id)

				if (!stock) {
					throw new Error(`Missing stock with id ${sc.id}`)
				}

				return { ...sc, stock, triggerPrice: parseFloat((sc.triggerPrice ?? 0).toFixed(2)) }
			})
		}
	},

	data() {
		return {
			search: '',

			headers: [
				{
					text: 'name',
					align: 'start',
					groupable: false,
					value: 'stock.name'
				},
				{ text: 'List', value: 'stock.list' },
				{ text: 'Bias', value: 'bias' },
				{ text: 'Trigger Price', value: 'triggerPrice', groupable: false }
			]
		}
	},

	methods: {
		goToDetails(clickedRow: StockViewModel) {
			this.$router.push({ path: `/stocks/${clickedRow.stock.id}` })
		},

		getStock(id: number): Stock | {} {
			const stock = this.stocks.get(id)

			if (stock) {
				return stock
			} else {
				return {}
			}
		}
	}
})
</script>

<style scoped></style>
