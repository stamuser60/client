import Cookies from 'js-cookie'
import jsonwebtoken from 'jsonwebtoken'
import { NameToAdfsClaim } from '../config/adfs_config'

function getBlankToken() {
  return undefined
}

function isBlankToken(token) {
  return token === 'undefined'
}

function storeAuthToken(token) {
  localStorage.setItem(`authToken`, token)
}

function authTokenFromStorage() {
  return localStorage.getItem('authToken')
}

/**
 * Returns the authentication header for the http request when calling the backend.
 */
export function getFetchAuthHeader() {
  let authToken = authTokenFromStorage()
  if (isBlankToken(authToken)) {
    return {}
  }
  return { Authorization: 'Bearer ' + authToken }
}

export function decodeAuthToken(token) {
  return jsonwebtoken.verify(token, process.env.REACT_APP_ADFS_SECRET)
}

function parseAuthToken(decodedToken) {
  let parsedTokenInfo = {}
  Object.entries(NameToAdfsClaim).forEach(
    ([name, adfsClaim]) => {
      if (decodedToken[adfsClaim]) {
        parsedTokenInfo[name] = decodedToken[adfsClaim]
      }
    }
  )
  if (decodedToken['iat']) {
    parsedTokenInfo['iat'] = decodedToken['iat']
  }
  if (decodedToken['exp']) {
    parsedTokenInfo['exp'] = decodedToken['exp']
  }
  return parsedTokenInfo
}

function signNewAuthJWT(tokenInfo) {
  return jsonwebtoken.sign(tokenInfo, process.env.REACT_APP_ADFS_SECRET)
}

function authTokenFromCookie() {
  const token = Cookies.get(process.env.REACT_APP_ADFS_COOKIE_NAME)
  if (token) {
    return token
  }
  throw new Error('No authentication token available')
}

/**
 * This function should be called with the initialization of the website.
 * Responsible for setting the jwt inside the local storage, for using when calling the backend.
 */
export function setAuthToken() {
  let token, newToken
  try {
    token = authTokenFromCookie()
    let decodedToken = decodeAuthToken(token)
    let parsedToken = parseAuthToken(decodedToken)
    newToken = signNewAuthJWT(parsedToken)
  } catch (e) {
    console.log('Error getting auth token: ', e.message)
    newToken = getBlankToken()
  }
  storeAuthToken(newToken)
  return newToken
}

