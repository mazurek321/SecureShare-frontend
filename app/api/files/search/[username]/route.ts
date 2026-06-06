import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params
    const res = await fetch(`http://localhost:8080/api/files/search/${encodeURIComponent(username)}`, {
      method: 'GET',
    })

    const text = await res.text()
    if (!res.ok) {
      return NextResponse.json({ error: text || 'User not found' }, { status: res.status })
    }

    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: 200 })
    } catch {
      return new NextResponse(text, { status: 200 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}