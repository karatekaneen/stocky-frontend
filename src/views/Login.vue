<template>
	<v-container fill-height>
		<v-layout text-xs-center row wrap align-center>
			<v-spacer />
			<v-flex xs12 sm7 align-center>
				<LoginForm />
			</v-flex>
			<v-spacer />
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginForm from '@/components/LoginForm.vue'

export default Vue.extend({
	components: { LoginForm }
})
</script>

<style scoped></style>
