import { Method } from "axios"
import { generateApiSignature } from "../../utils/helper"
import { NCPClient, BaseURL, ApiRequest } from "../../utils/network_helper"
import { SMSserviceAuthType, NCPAuthKeyType, SendSMSParamType, SendSMSReturnType } from "../../utils/types"

export class SMS {

  private baseUrl: string
  private client: NCPClient
  
  private smsAuth: SMSserviceAuthType

  constructor(
    ncpAuthKey: NCPAuthKeyType,
    smsAuth: SMSserviceAuthType
  ) {
    this.smsAuth = smsAuth
    this.baseUrl = BaseURL.sens
    this.client = new NCPClient(ncpAuthKey, this.baseUrl)
  }

  public async sendSMS(
    smsParam: SendSMSParamType
  ): Promise<SendSMSReturnType>
  {
    // construct Api Request for sendSMS service.
    const apiRequest = new APISendSMS(
      this.client.ncpAuthKey,
      this.smsAuth,
      smsParam
    )
    try {
      const response = await this.client.request(apiRequest)
      console.log(response)
      if (response.status === 202) {
        return {
          isSuccess: true,  
          status: response.status,
          statusText: response.statusText,
          data: response.data
        }
      } else {
        return {
          isSuccess: false,  
          status: response.status,
          statusText: response.statusText,
        }
      }
    } catch (error) {
      return {
        isSuccess: false,
        status: error.response.status || 500,
        statusText: error.response.statusText || 'Internal Server Error',
      };
    }
  }
}

class APISendSMS implements ApiRequest {
  path: string
  method: Method = 'POST'
  headers: { [key: string]: string }
  body?: { [key: string]: any } | undefined

  constructor(
    ncpAuthKey: NCPAuthKeyType,
    smsAuth: SMSserviceAuthType,
    smsParam: SendSMSParamType,
  ) {
    const { accessKey, secretKey } = ncpAuthKey
    const { phone, serviceId } = smsAuth
    const { to, content, countryCode = '82' } = smsParam
    this.path = `/sms/v2/services/${serviceId}/messages`
    const { timestamp, signature } = generateApiSignature({ method: this.method, url: this.path, ncpAuthKey })
    this.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key': accessKey,
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-apigw-signature-v2': signature,
    }
    this.body = {
      'type': 'SMS',
      'contentType': 'COMM',
      'countryCode': countryCode,
      'from': phone,
      'content': content,
      'messages': [
        {
          'to': to,
        },
      ],
    }
  }
}