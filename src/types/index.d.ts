export type Stock = {
	name: string
	list: string
	id: number
}

export type PendingSignal = {
	date: string
	type: string
	action: string
	price: null
	stock: Stock
	status: string
}

export type StockContext = {
	bias: 'bull' | 'bear' | 'neutral'
	highPrice: number
	lowPrice: number
	regime: 'bull' | 'bear' | 'neutral'
	triggerPrice: number
	id: number
}
