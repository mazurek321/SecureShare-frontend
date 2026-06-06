import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    
    if (!body || !body.username || !body.password) {
      return NextResponse.json({ error: 'Brak wymaganych danych logowania' }, { status: 400 })
    }

    const { username, password } = body

    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const backendResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const responseText = await backendResponse.text()

    if (!backendResponse.ok) {
      return NextResponse.json({ error: responseText || 'Nieprawidłowy login lub hasło' }, { status: backendResponse.status })
    }

    const token = responseText
    const cookieStore = cookies()
    const resolvedCookieStore = cookieStore instanceof Promise ? await cookieStore : cookieStore
    
    resolvedCookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    resolvedCookieStore.set('user_profile', JSON.stringify({ username: username }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return NextResponse.json({
      username: username
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Błąd serwera proxy' }, { status: 500 })
  }
}