import * as firebase from 'firebase/app'
import 'firebase/auth'

export default class Authenticator {
	private firebase: typeof firebase

	constructor({ _firebase = firebase } = {}) {
		this.firebase = _firebase
	}

	/**
	 * Logs in the user with email + password
	 * @param email Email of the user
	 * @param password Password of the user
	 * @param deps to be injected for testing
	 * @returns The response from the authentication
	 */
	public async login(
		email: string,
		password: string,
		{ firebase = this.firebase } = {}
	): Promise<firebase.auth.UserCredential> {
		try {
			const resp = await firebase.auth().signInWithEmailAndPassword(email, password)
			return resp
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	public getUser({ firebase = this.firebase } = {}): firebase.User | null {
		return firebase.auth().currentUser
	}

	public checkAuth(): boolean {
		try {
			const hasUser = Boolean(this.getUser())
			return hasUser
		} catch (err) {
			console.error(err)
			return false
		}
	}
}
