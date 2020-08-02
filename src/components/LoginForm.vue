<template>
	<v-card flat>
		<v-form>
			<v-text-field v-model="email" prepend-icon="person" name="Email" label="Email" />
			<v-text-field
				v-model="password"
				prepend-icon="lock"
				name="Password"
				label="Password"
				type="password"
			/>
			<v-card-actions>
				<v-btn
					class="loginbutton"
					color="primary"
					large
					block
					:disabled="!credentialsFulfilled"
					@click="login(email, password)"
					>Login</v-btn
				>
			</v-card-actions>
		</v-form>
		<v-card color="error" v-if="error">{{ error }}</v-card>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Authenticator from '@/services/Authenticator'

type KeyEventHandler = (e: KeyboardEvent) => void

export default Vue.extend({
	data() {
		return {
			email: '',
			password: '',
			error: '' as string,

			keyListener: {} as KeyEventHandler,
			boundListener: {} as KeyEventHandler
		}
	},

	methods: {
		async login(): Promise<void> {
			const auth = new Authenticator()

			try {
				await auth.login(this.email, this.password)

				console.log('logged in')
				// Check for redirect:
				const next = this.$route.query?.next as string

				if (next) {
					this.$router.push(next)
				}
			} catch (err) {
				console.error(err)
				this.error = err.message
			}
		}
	},

	computed: {
		credentialsFulfilled(): boolean {
			return Boolean(this.email && this.password)
		}
	},

	mounted() {
		this.keyListener = (e: KeyboardEvent): void => {
			if (e.key === 'Enter') {
				e.preventDefault()

				this.login()
			}
		}

		this.boundListener = this.keyListener.bind(this)

		document.addEventListener('keydown', this.boundListener)
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.boundListener)
	}
})
</script>

<style scoped></style>
