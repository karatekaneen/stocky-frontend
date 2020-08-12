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

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		stocks: [] as Stock[],
		stockContexts: [] as StockContext[]
	},
	mutations: vuexfireMutations,
	actions: {
		bindStocks: firestoreAction(({ bindFirestoreRef }) => {
			return bindFirestoreRef('stocks', db.collection('securities'))
		}),
		bindStockContexts: firestoreAction(({ bindFirestoreRef }) => {
			return bindFirestoreRef('stockContexts', db.collection('context'))
		})
	},
	modules: {}
})
