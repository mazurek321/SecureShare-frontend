import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const headers: HeadersInit = {}
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else {
      const authHeader = request.headers.get('Authorization')
      if (authHeader) {
        headers['Authorization'] = authHeader
      }
    }

    const res = await fetch('http://localhost:8080/api/files/public', {
      method: 'GET',
      headers: headers
    })
    
    const text = await res.text()
    if (!res.ok) {
      return NextResponse.json({ error: text || 'Backend error' }, { status: res.status })
    }
    return new NextResponse(text, { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}