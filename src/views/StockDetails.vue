<template>
	<div>
		<div>Det här ska vara graf - {{ $route.params.id }}</div>
		<v-card>
			<v-card-title>
				Signals
			</v-card-title>
			<ul>
				<li v-for="s in signalDoc.signals" :key="s.index">
					{{ s.date }} - {{ s.action }} - {{ s.price }}
				</li>
			</ul>
		</v-card>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Signal } from '@/types'
import DBWrapper from '@/services/DBWrapper'

const { db } = new DBWrapper()

export default Vue.extend({
	data() {
		return {
			signalDoc: [] as Signal[]
		}
	},

	created() {
		this.$bind('signalDoc', db.collection('signals').doc(this.$route.params.id))
	}
})
</script>

<style scoped></style>
