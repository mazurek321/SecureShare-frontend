export interface FileItem {
  id: string
  name?: string
  originalFilename: string
  storedFilename?: string
  contentType?: string
  size?: number
  uploadTime?: string
  owner: string | { id: string; username: string }
  ownerId?: string
  isPublic: boolean
  access_level: 'PUBLIC' | 'PRIVATE'
  status?: 'SAFE' | 'SCANNING' | 'PRIVATE_REQUEST' | 'PENDING' | 'APPROVED'
}

export interface AccessRequest {
  id: string
  fileId: string
  fileName: string
  requestedBy: string
  status?: string
}

const FILES_BASE_URL = '/api/files'

async function handleFilesResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  
  if (!response.ok) {
    if (response.status === 401) throw new Error('Sesja wygasła.')
    if (response.status === 403) throw new Error('Brak uprawnień.')
    
    try {
      const parsedError = JSON.parse(text)
      throw new Error(parsedError.error || `Błąd: ${response.status}`)
    } catch {
      throw new Error(text || `Błąd: ${response.status}`)
    }
  }
  
  if (response.status === 204 || !text) return {} as T
  
  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

export const fileService = {
  async uploadFile(file: File, accessLevel: string, isPublic: boolean) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accessLevel', accessLevel);
    formData.append('isPublic', String(isPublic));
    
    const response = await fetch(`${FILES_BASE_URL}/upload`, { 
      method: 'POST', 
      body: formData 
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return response.text();
  },

  async getMyFiles(): Promise<FileItem[]> {
    const response = await fetch(`${FILES_BASE_URL}/my-files`, { 
      method: 'GET',
    })
    return handleFilesResponse<FileItem[]>(response)
  },

  async getSharedWithMe(): Promise<FileItem[]> {
    const response = await fetch(`${FILES_BASE_URL}/shared-with-me`, { 
      method: 'GET',
    })
    return handleFilesResponse<FileItem[]>(response)
  },

  async deleteFile(fileId: string): Promise<string> {
    const response = await fetch(`${FILES_BASE_URL}/${fileId}`, { method: 'DELETE' })
    return handleFilesResponse<string>(response)
  },

  async downloadFile(id: string): Promise<Blob> {
    const response = await fetch(`${FILES_BASE_URL}/download/${id}`, { method: 'GET' })
    if (!response.ok) throw new Error(`Status: ${response.status}`)
    return response.blob()
  },

  async requestAccess(fileId: string): Promise<string> {
    const response = await fetch(`${FILES_BASE_URL}/${fileId}/request-access`, { method: 'POST' })
    return handleFilesResponse<string>(response)
  },

  async searchUserByUsername(username: string): Promise<{ id: string; username: string }> {
    const response = await fetch(`${FILES_BASE_URL}/search/${encodeURIComponent(username)}`, { method: 'GET' })
    return handleFilesResponse<{ id: string; username: string }>(response)
  },

async grantAccess(fileId: string, targetUserId: string): Promise<string> {
  const response = await fetch(`${FILES_BASE_URL}/${fileId}/grant-access/${targetUserId}`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer_Passthrough' 
    }
  })
  return handleFilesResponse<string>(response)
},

  async getPublicFiles(): Promise<FileItem[]> {
    const response = await fetch(`${FILES_BASE_URL}/public`, { method: 'GET' })
    return handleFilesResponse<FileItem[]>(response)
  },

  async getUserFiles(username: string): Promise<FileItem[]> {
    const response = await fetch(`${FILES_BASE_URL}/${encodeURIComponent(username)}/files`, { 
      method: 'GET' 
    })
    console.log(response)
    return handleFilesResponse<FileItem[]>(response)
  },

  async getPendingRequests(): Promise<AccessRequest[]> {
    const response = await fetch(`${FILES_BASE_URL}/pending-requests`, { 
      method: 'GET',
    })
    return handleFilesResponse<AccessRequest[]>(response)
  },
}