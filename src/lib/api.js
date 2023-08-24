export const $api = {
  get,
  post,
  put,
  delete: _delete
}

const TOKEN = process.env.REACT_APP_API_TOKEN
const BASE_PATH = process.env.REACT_APP_BASE_PATH

function get (url) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${TOKEN}`
    }
  }
  return fetch(BASE_PATH + url, requestOptions).then(handleResponse)
}

function post (url, body) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${TOKEN}`
    },
    body: JSON.stringify(body)
  }
  return fetch(BASE_PATH + url, requestOptions).then(handleResponse)
}

function put (url, body) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${TOKEN}`
    },
    body: JSON.stringify(body)
  }
  return fetch(BASE_PATH + url, requestOptions).then(handleResponse)
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete (url) {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${TOKEN}`
    }
  }
  return fetch(BASE_PATH + url, requestOptions).then(handleResponse)
}

// helper functions

function handleResponse (response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
