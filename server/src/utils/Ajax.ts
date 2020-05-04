import fetch from 'node-fetch'


enum HTTPMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
  }
  
  /**
   * Class wrapper to make requests to the backend
   */
  export default class Ajax {
    authToken: string
    root = process.env.CHESS_API_ROOT
  
    constructor(authToken: string = '') {
      this.authToken = authToken
    }
  
    /**
     * GET request to endpoint
     */
    get(endpoint: string) {
      return this.request(HTTPMethod.GET, endpoint)
    }
  
    /**
     * POST request to endpoint
     */
    post(endpoint: string, data: Record<string, any>) {
      return this.request(HTTPMethod.POST, endpoint, data)
    }
  
    /**
     * PUT request to endpoint
     */
    put(endpoint: string, data: Record<string, any>) {
      return this.request(HTTPMethod.PUT, endpoint, data)
    }
  
    /**
     * DELETE request to endpoint
     */
    delete(endpoint: string) {
      return this.request(HTTPMethod.DELETE, endpoint)
    }
  
    private async request(method: HTTPMethod, url: string, data: Record<string, any> | null = null) {
  
      const response = await fetch(this.root + url, {
        method,
        body: data ? JSON.stringify(data) : undefined,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
  
      if (!(response.status >= 200 && response.status < 300)) throw new Error(response.statusText)
    
  
      return response.json()
    }
  
  }
  