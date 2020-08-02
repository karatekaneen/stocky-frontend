import firebase, { firestore } from 'firebase/app'
import 'firebase/firestore'

export default class DBWrapper {
	public db: firestore.Firestore

	constructor({ _firebase = firebase } = {}) {
		this.db = _firebase.firestore()
	}
}
