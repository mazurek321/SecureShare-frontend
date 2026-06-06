export interface UserResponse {
  id: string
  username: string
  role: 'USER' | 'MODERATOR' | 'ADMIN'
}

export interface RoleUpdateRequest {
  newRole: string
}

const BASE_URL = '/api/admin'

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Brak uprawnień administratora.');
    }
    throw new Error(text || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
export const adminService = {
  async getUsers(): Promise<UserResponse[]> {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      credentials: 'include'
    })
    return handleResponse<UserResponse[]>(response)
  },

  async updateUserRole(userId: string, data: RoleUpdateRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
    return handleResponse<void>(response)
  },

  async deleteFile(fileId: string | number): Promise<void> {
  const response = await fetch(`${BASE_URL}/files/${fileId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  return handleResponse<void>(response);
},
}