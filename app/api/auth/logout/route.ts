import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    const resolvedCookieStore = cookieStore instanceof Promise ? await cookieStore : cookieStore
    
    resolvedCookieStore.delete('auth_token')
    resolvedCookieStore.delete('user_profile')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Błąd podczas wylogowywania' }, { status: 500 })
  }
}