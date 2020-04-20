import { lobbyId } from '../config/general.config'

export const getIdFromPath = (path) => {
	const pathArr = path.split('/'),
	last = pathArr[pathArr.length - 1],
	secondLast = pathArr[pathArr.length - 2]
	if (last === 'lobby' || last === 'flow') return lobbyId
	if (last === ''){
		if (secondLast === 'lobby' || secondLast === 'flow' || secondLast === ''){
			return lobbyId
		}
		return secondLast
	}
	return last
}

export const MODES = {
	NORMAL: 'NORMAL',
	OPEN: 'OPEN',
	EDIT: 'EDIT',
	PRESENTATION: 'PRESENTATION'
}