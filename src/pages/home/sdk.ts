export class FileAPISDK {
  constructor(private baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getList(folder: string) {
    const response = await fetch(`${this.baseUrl}/public/api/v1/folder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder }),
    });

    this._handleErrors(response);
    return await response.json();
  }

  async getFile(folder: string, file: string) {
    const response = await fetch(`${this.baseUrl}/public/api/v1/file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder, file }),
    });

    this._handleErrors(response);
    return await response.text();
  }

  async deleteFile(folder: string, file: string) {
    const response = await fetch(`${this.baseUrl}/public/api/v1/file`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder, file }),
    });

    this._handleErrors(response);
    return await response.text();
  }

  async createFile(folder: string, file: string, content: string) {
    const response = await fetch(`${this.baseUrl}/public/api/v1/create-file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder, file, content }),
    });

    this._handleErrors(response);
    return await response.text();
  }

  _handleErrors(response: any) {
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
  }
}
