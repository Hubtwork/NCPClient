import { generateApiSignature } from '../../utils/helper'
import { Method } from 'axios'
import { ApiClient, ApiRequest } from '../../utils/api_request'
import { SendSMSParamType } from '../../types/param_types'
import { ApiClientResponse, SearchMessageRequestReturnType, SearchMessageResulReturnType, SendSMSReturnType } from '../../types/return_types'
import { BaseURL } from '../../shared/baseurl'
import { NCPAuthKeyType, SMSserviceAuthType } from '../../types/auth_types'

export class SENS {
  
  private baseUrl: string = BaseURL.sens
  /**
   * Get SendSMS Service agent.
   * @access public
   * @param {NCPAuthKeyType} ncpAuthKey NCP API authentication data for using API
   * @param {SMSserviceAuthType} smsAuth Service identification for using SMS Service
   * @returns {SMS} return SMS Service agent
   * @memberof SENS
   */
  public smsService(
    ncpAuthKey: NCPAuthKeyType,
    smsAuth: SMSserviceAuthType
  ): SMS {
    return new SMS(this.baseUrl, ncpAuthKey, smsAuth)
  }

}

class SMS {
  /**
   * The account access Key for API authentication
   * 
   * @access private 
   * @type {ApiClient} 
   * @memberof SMS
   */
  private client: ApiClient
  
  
  /**
   * The account access Key for API authentication
   * 
   * @access private 
   * @type {NCPAuthKeyType} 
   * @memberof SMS
   */
  private ncpAuthKey: NCPAuthKeyType

  /**
   * The phoneNumber, serviceId for using SMS API
   * 
   * @access private 
   * @type {SMSserviceAuthType} 
   * @memberof SMS
   */
  private smsAuth: SMSserviceAuthType

  /**
   * Creates an instance of SMS service agent.
   * 
   * @param {string} baseURL The baseURL of each session ( based on service )
   * @param {NCPAuthKeyType} ncpAuthKey NCP API authentication data for using API
   * @param {SMSserviceAuthType} smsAuth Service identification for using SMS Service
   * @memberof SMS
   */
  constructor(
    baseUrl: string,
    ncpAuthKey: NCPAuthKeyType,
    smsAuth: SMSserviceAuthType
  ) {
    this.smsAuth = smsAuth
    this.ncpAuthKey = ncpAuthKey
    this.client = new ApiClient(ncpAuthKey, baseUrl)
    
  }
  /**
   * Construct SendSMS Service apiRequest. Generate signature for signing, pass SendSMSParams to body.
   * Single / Multiple send mode supported.
   * @async
   * @access public
   * @param {(SendSMSParamType | SendSMSParamType[])} apiRequest - Message-rㄴeference Data with ( to, content ). Single / Multi value passing supported.
   * @param {(number | undefined)} countryCode - CountryCode for recipient. ( default : 82 )
   * @returns {Promise<ApiClientResponse<SendSMSReturnType>>} return Promise response of http request with current ApiRequest configs and handle errors
   * @memberof SMS
   */
  public async sendSMS(smsParam: SendSMSParamType | SendSMSParamType[], countryCode?: number): Promise<ApiClientResponse<SendSMSReturnType>> {
    // construct path and method
    const path = `/sms/v2/services/${this.smsAuth.serviceId}/messages`
    const method: Method = 'POST'
    // construct signature and headers
    const { timestamp, signature } = generateApiSignature({ method: method, url: path, ncpAuthKey: this.ncpAuthKey })
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': this.ncpAuthKey.accessKey,
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-apigw-signature-v2': signature,
    }
    // construct message parameters and body
    countryCode = (countryCode === undefined) ? 82 : countryCode
    smsParam = (smsParam instanceof Array) ? smsParam : [smsParam]
    const body = {
      'type': 'SMS',
      'contentType': 'COMM',
      'countryCode': `${countryCode}`,
      'from': this.smsAuth.phone,
      'content': ' ',
      'messages': smsParam
    }
    const apiRequest: ApiRequest = {
      path: path,
      method: method,
      headers: headers,
      body: body
    }
    return this.client.request<SendSMSReturnType>(apiRequest)
  }

  public async searchMessageRequest(requestId: string): Promise<ApiClientResponse<SearchMessageRequestReturnType>> {
    // construct path and method
    const path = `/sms/v2/services/${this.smsAuth.serviceId}/messages?requestId=${requestId}`
    const method: Method = 'GET'
    // construct signature and headers
    const { timestamp, signature } = generateApiSignature({ method: method, url: path, ncpAuthKey: this.ncpAuthKey })
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': this.ncpAuthKey.accessKey,
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-apigw-signature-v2': signature,
    }
    const apiRequest: ApiRequest = {
      path: path,
      method: method,
      headers: headers
    }
    return this.client.request<SearchMessageRequestReturnType>(apiRequest)
  }

  public async searchMessageResult(messageId: string): Promise<ApiClientResponse<SearchMessageResulReturnType>> {
    // construct path and method
    const path = `/sms/v2/services/${this.smsAuth.serviceId}/messages/${messageId}`
    const method: Method = 'GET'
    // construct signature and headers
    const { timestamp, signature } = generateApiSignature({ method: method, url: path, ncpAuthKey: this.ncpAuthKey })
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': this.ncpAuthKey.accessKey,
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-apigw-signature-v2': signature,
    }
    const apiRequest: ApiRequest = {
      path: path,
      method: method,
      headers: headers
    }
    return this.client.request<SearchMessageResulReturnType>(apiRequest)
  }
}


export class Project {
  
}