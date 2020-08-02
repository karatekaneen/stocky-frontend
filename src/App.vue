<template>
	<v-app>
		<v-app-bar app color="primary">
			<v-spacer></v-spacer>

			<v-btn to="pending" color="accent" light>
				<span class="mr-2 black--text">Pending signals</span>
				<v-icon>pregnant_woman</v-icon>
			</v-btn>
			<v-btn to="about" color="accent" light>
				<span class="mr-2 black--text">About</span>
				<v-icon>mdi-open-in-new</v-icon>
			</v-btn>
		</v-app-bar>

		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'App',

	components: {},

	data: () => ({
		//
	})
})
</script>

<style scoped></style>
