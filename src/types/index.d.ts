export type Stock = {
	name: string
	list: string
	id: number
}

export type Signal = {
	date: string
	type: string
	action: string
	price: number
	stock: Stock
	status: string
}
export type PendingSignal = Omit<Signal, 'price'> & {
	price: null
}

export type StockContext = {
	bias: 'bull' | 'bear' | 'neutral'
	highPrice: number
	lowPrice: number
	regime: 'bull' | 'bear' | 'neutral'
	triggerPrice: number
	id: number
}
