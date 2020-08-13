import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import DBWrapper from '@/services/DBWrapper'
import { Stock, StockContext } from '@/types'

const creds = {
	apiKey: 'AIzaSyD970dXDz3R-n-ISqq9ZTKFHtOvQMzmfEc',
	authDomain: 'makeup-bauhn-se.firebaseapp.com',
	databaseURL: 'https://makeup-bauhn-se.firebaseio.com',
	projectId: 'makeup-bauhn-se',
	storageBucket: 'makeup-bauhn-se.appspot.com',
	messagingSenderId: '1098922947491'
}

firebase.initializeApp(creds)

const { db } = new DBWrapper()

type BaseState = {
	stocks: Stock[]
	stockContexts: StockContext[]
	signalsFullWidth: boolean
	priceChartFullWidth: boolean
}

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// Cached data:
		stocks: [] as Stock[],
		stockContexts: [] as StockContext[],

		// Settings:
		signalsFullWidth: false,
		priceChartFullWidth: false
	},
	mutations: {
		...vuexfireMutations,
		setSignalFullWidth: (state: BaseState, value: boolean) => (state.signalsFullWidth = value)
	},
	actions: {
		bindStocks: firestoreAction(({ bindFirestoreRef }) => {
			return bindFirestoreRef('stocks', db.collection('securities'))
		}),

		bindStockContexts: firestoreAction(({ bindFirestoreRef }) => {
			return bindFirestoreRef('stockContexts', db.collection('context'))
		}),

		loadStocks({ state, dispatch }) {
			const bState = state as BaseState

			if (bState.stocks.length < 1) {
				dispatch('bindStocks')
			}
		},

		loadContexts({ state, dispatch }) {
			const bState = state as BaseState

			if (bState.stockContexts.length < 1) {
				dispatch('bindStockContexts')
			}
		}
	},
	modules: {}
})
