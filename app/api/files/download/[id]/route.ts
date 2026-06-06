import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.cookies.get('auth_token')?.value
    const res = await fetch(`http://localhost:8080/api/files/download/${id}`, {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text || 'Backend error' }, { status: res.status })
    }
    const blob = await res.blob()
    const headers = new Headers()
    headers.set('Content-Type', res.headers.get('Content-Type') || 'application/octet-stream')
    headers.set('Content-Disposition', res.headers.get('Content-Disposition') || 'attachment')
    return new NextResponse(blob, { status: 200, headers })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}