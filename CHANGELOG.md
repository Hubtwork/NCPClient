## Changes

#### v1.2.0 ( 2021. 5. 14 )

- Add preprocessed data ([#4](https://github.com/Hubtwork/NCPClient/issues/4))

  - preprocessed data will deliver simple, essentials to client

  - add SENS sms services
  - add PAPAGO services

- Add test with bug fixed

  - bug fix with mocked response for test
  - test with preprocessed data
  - test with latest

- Update readme

  - update readme with preprocessed data exmaple
  - update usage functions with parameters



#### v1.1.2 ( 2021. 5. 1 )

- can import SMS, PAPAGO class for more typescrypty usage

#### v1.1.1 ( 2021. 4. 26 )

- Readme typing error fixed



#### v1.1.0 ( 2021. 4. 23 )

- Adding support for `NaverOpenAPI` 's `Papago NMT API v1`

- Migrating  `Papago NMT API v1` 's service errors to built-in validation



#### v1.0.5 ( 2021. 4. 20 )

**NCPClient will support service's unique error types**

- NCPClient's request module, `ApiRequest` can handle service's unique errors now

  > **service's unique error** means almost parameter validation.
  >
  > If given parameter is incorrect with NCP-defined format, It will return **ApiClientResponse with error** and request won't send.

**[ SENS - SMS service ] SearchMessageRequest / SearchMessageResult now supported**

- Using **SendSMS API** , you can get `requestId` of request from response

- **SearchMessageRequest** with requestId from **SendSMS API's response** will return the detail delivery request

  ~~~typescript
  const { isSuccess, data } = await smsService.searchMessageRequest('requestId')
  ~~~

- **SearchMessageResponse** with messageId from **SearchMessageRequest API's response** will return the detail delivery results

  ~~~typescript
  const { isSuccess, data } = await smsService.searchMessageResult('messageId')
  ~~~

**Dependency changed**

- **crypto** changed to built-in module, so deprecated in dependency



#### v1.0.4 ( 2021. 4. 18 )

**ApiRequest clarity guaranteed**

- `ApiRequest` will be used more clearly to request **http requests**
- `ApiRequest` represent **root Interface that defines the configuration** for the request

**ApiClient, the request Wrapper added**

- After this updates, no pure `axiosInstance.request` will be used

- `ApiClient` , custom request wrapper **handles errors** and **return uniformed custom response**

- **Error Handling** - url validation, error response from server / other reasons

- **Uniformed Response** 

  ~~~typescript
  type ApiClientResponse = {
    isSuccess: boolean
    // if isSuccess, will contain data and no errorMessage
    data?: T
    // if isFailed, will contain errorMessage and no data
    errorMessage?: {}
  }
  ~~~

**[ SENS - SMS service ] SendSMS support Multi-mode**

- `sendSMS` will support **sending SMS to multiple people**
- User can pass param `SendSMSParamType[]` if want to send to multiple SMS at the same time

**Ensure API Service scalability**

  - Other NCP API Service will be added continuously, so consider **scalability**.

- `SMS` Service agent can be generated like below

  ~~~javascript
  var { SENS } = require('ncp-client')
  ...
  const sens = new SENS()
  const smsService = sens.smsService(ncpAuthKey, smsAuthKey)
  ~~~

  

