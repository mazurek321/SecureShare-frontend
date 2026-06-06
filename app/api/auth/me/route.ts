import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const resolvedCookieStore = cookieStore instanceof Promise ? await cookieStore : cookieStore
    const token = resolvedCookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Niezalogowany (Brak tokenu)' }, { status: 401 })
    }

    const backendResponse = await fetch('http://localhost:8080/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const errText = await backendResponse.text()
      return NextResponse.json({ error: errText || 'Błąd pobierania profilu' }, { status: backendResponse.status })
    }

    const userData = await backendResponse.json()
    return NextResponse.json(userData)

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Błąd serwera proxy me' }, { status: 500 })
  }
}