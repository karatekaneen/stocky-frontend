<template>
	<v-container fluid>
		<v-row>
			<v-col cols="4">
				<div>Det här ska vara graf - {{ $route.params.id }}</div>
			</v-col>
			<v-col :cols="signalFullWidth ? 12 : 6" v-if="signalDoc && signalDoc.signals">
				<signal-table :signals="signalDoc.signals">
					<template #actions>
						<v-icon @click="signalFullWidth = !signalFullWidth">
							{{ signalFullWidth ? 'fullscreen_exit' : 'fullscreen' }}
						</v-icon>
					</template>
				</signal-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Signal } from '@/types'
import DBWrapper from '@/services/DBWrapper'
import SignalTable from '@/components/signals/SignalTable.vue'

const { db } = new DBWrapper()

export default Vue.extend({
	components: { SignalTable },

	data() {
		return {
			signalDoc: [] as Signal[],
			signalFullWidth: false
		}
	},

	created() {
		this.$bind('signalDoc', db.collection('signals').doc(this.$route.params.id))
	}
})
</script>

<style scoped></style>
