const axios = require('axios')
import { MockApiClient, ApiRequest } from './mock/mock_apiClient'
import { ApiClientResponse, NCPAuthKeyType } from '../utils/types';

let ncpAuthKey: NCPAuthKeyType = {
  accessKey: 'GCk1oT4Yu0SiByPg5rRN',
  secretKey: 'byszL5gtgauX6yRj4DCGHouGFp0HAH6atyQrDM50'
}

type testDataType = {
  name: string
}

jest.mock("axios")

describe('61713112', () => {
  let client: MockApiClient
  let ncpAuthKey: NCPAuthKeyType

  beforeAll(() => {
    ncpAuthKey = {
      accessKey: "accessKey",
      secretKey: "secretKey"
    }
    client = new MockApiClient( ncpAuthKey, 'http://api.test.com', 2000 )
  })

  beforeEach(() => axios.mockClear())

  test('create NCPClient', () => {
    expect(
      () =>
      new MockApiClient( ncpAuthKey, 'http://api.test.com', 2000 )
    ).not.toThrow()
  })

  test('successful apiRequest', async () => {
    
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        status: 202,
        data: {
          name: 'hubtwork'
        }
      })
    )

    const apiRequest: ApiRequest = {
      path: '/static/test',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const response = await client.request<testDataType>(apiRequest)
    expect(response.isSuccess).toEqual(true)
    if (response.data) {
      console.log('data detected')
      const data: testDataType = response.data || undefined
      expect(data !== undefined).toEqual(true)
      expect(data.name).toEqual('hubtwork')
    }
  })

  test('Response with invalid httpStatusCode', async () => {
    
    axios.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 404,
          statusText: 'Not found'
        },
        request: {},
        config: {}
      })
    )

    const apiRequest: ApiRequest = {
      path: '/static/testsss1',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const response = await client.request<testDataType>(apiRequest)
    console.log(response)
    expect(response.isSuccess).toEqual(false)
    expect(response.errorMessage).toEqual('Unexpected HTTP Status Code : 404')
  })

  test('No response from server', async () => {
    
    axios.mockImplementationOnce(() =>
      Promise.reject({
        request: {},
        config: {}
      })
    )

    const apiRequest: ApiRequest = {
      path: '/unreached',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const response = await client.request<testDataType>(apiRequest)
    console.log(response)
    expect(response.isSuccess).toEqual(false)
    expect(response.errorMessage).toEqual('No response from the server')
  })

  test('Request Configuration Occured', async () => {
    
    axios.mockImplementationOnce(() =>
      Promise.reject({
        config: {}
      })
    )

    const apiRequest: ApiRequest = {
      path: '/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const response = await client.request<testDataType>(apiRequest)
    console.log(response)
    expect(response.isSuccess).toEqual(false)
    expect(response.errorMessage).toEqual('Error occured during setup request')
  })

})