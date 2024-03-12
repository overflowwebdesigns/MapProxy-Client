import Store from 'electron-store'

const defaults = {
	PORT: 8080,
}
const store = new Store({ defaults })

export { store }
