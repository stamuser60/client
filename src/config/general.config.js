import {getServerSideUrl} from './server.config.js'
import {getFetchAuthHeader} from '../services/authToken.service'

const circleDiameter = 55
const serverSideUrl = getServerSideUrl()
const flowsNotificationsSocketUrl = `${serverSideUrl}/flows`
const lobbyNotificationsSocketUrl = `${serverSideUrl}/lobby`
const lastUpdateChannel = "timeUpdate"
const rootId = "HyLcryEuz"
const lobbyId = "GPvp9-gIf"
const modalWidth = 400
const fetchOptions = (method='GET', body) => {
	if (method === 'GET') return {
		method: 'GET',
		headers: {
			'Accept' : 'application/json',
			...getFetchAuthHeader()
		}/*,
		credentials: "include"*/
	} 
	if (method === 'POST') return {
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json',
				...getFetchAuthHeader()
			},
			/*credentials: "include",*/
			body: JSON.stringify(body)
	}
}

export {
	circleDiameter,
	serverSideUrl,
	modalWidth,
	rootId,
	fetchOptions,
	flowsNotificationsSocketUrl,
	lobbyNotificationsSocketUrl,
	lastUpdateChannel,
	lobbyId
}
