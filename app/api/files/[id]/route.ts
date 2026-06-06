import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.cookies.get('auth_token')?.value
    const res = await fetch(`http://localhost:8080/api/files/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })
    const text = await res.text()
    if (!res.ok) {
      return NextResponse.json({ error: text || 'Backend error' }, { status: res.status })
    }
    return new NextResponse(text, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}