<template>
	<v-app>
		<template>
			<v-card>
				<v-navigation-drawer
					app
					floating
					expand-on-hover
					color="primary"
					permanent
					class="darken-3"
				>
					<v-list>
						<v-list-item class="px-2">
							<v-list-item-avatar color="secondary">
								<span class="white--text headline">{{ initial }}</span>
							</v-list-item-avatar>
						</v-list-item>

						<v-list-item link>
							<v-list-item-content>
								<v-list-item-title class="title">{{ email }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>

					<v-divider></v-divider>

					<v-list nav dense>
						<v-list-item link to="pending">
							<v-list-item-icon>
								<v-icon>accessible_forward</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Pending Signals</v-list-item-title>
						</v-list-item>
						<v-list-item link to="stocks">
							<v-list-item-icon>
								<v-icon>list</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Stocks</v-list-item-title>
						</v-list-item>
						<v-list-item link to="about">
							<v-list-item-icon>
								<v-icon>info</v-icon>
							</v-list-item-icon>
							<v-list-item-title>About</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-navigation-drawer>
			</v-card>
		</template>
		<v-main>
			<v-container fluid>
				<v-row class="fill-height">
					<v-col>
						<transition name="fade">
							<router-view />
						</transition>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'

export default Vue.extend({
	name: 'App',

	components: {},

	data: () => ({
		email: 'test',
		initial: 'x'
	}),

	methods: {
		createAuthObserver() {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					this.email = user.email || ''
					this.initial = (user.email || 'U').substring(0, 1).toLocaleUpperCase()
					// User is signed in.
				} else {
					// No user is signed in.
				}
			})
		}
	},

	created() {
		this.createAuthObserver()
	}
})
</script>

<style scoped></style>
