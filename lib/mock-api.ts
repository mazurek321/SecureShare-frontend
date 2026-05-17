export async function mockLogin(email: string, password: string) {
  await delay(800)

  if (email === 'admin@test.com' && password === '123456') {
    return {
      token: 'mock-jwt-token-admin',
      user: {
        id: '1',
        email,
        role: 'ADMIN',
      },
    }
  }

  if (email === 'user@test.com' && password === '123456') {
    return {
      token: 'mock-jwt-token-user',
      user: {
        id: '2',
        email,
        role: 'USER',
      },
    }
  }

  throw new Error('Invalid credentials')
}

export async function mockRegister(email: string) {
  await delay(800)

  return {
    message: 'User created',
  }
}

export async function mockFiles() {
  await delay(500)

  return [
    { id: 1, name: 'report.pdf', status: 'SAFE' },
    { id: 2, name: 'virus.exe', status: 'INFECTED' },
    { id: 3, name: 'image.png', status: 'SCANNING' },
  ]
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}