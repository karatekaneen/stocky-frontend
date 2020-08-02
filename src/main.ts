import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/auth'

const creds = {
	apiKey: 'AIzaSyD970dXDz3R-n-ISqq9ZTKFHtOvQMzmfEc',
	authDomain: 'makeup-bauhn-se.firebaseapp.com',
	databaseURL: 'https://makeup-bauhn-se.firebaseio.com',
	projectId: 'makeup-bauhn-se',
	storageBucket: 'makeup-bauhn-se.appspot.com',
	messagingSenderId: '1098922947491'
}

Vue.config.productionTip = false

firebase.initializeApp(creds)
Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
