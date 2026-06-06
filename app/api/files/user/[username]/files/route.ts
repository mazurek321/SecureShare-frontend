import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params
    const res = await fetch(`http://localhost:8080/api/files/${encodeURIComponent(username)}/files`, {
      method: 'GET'
    })

    const text = await res.text()
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}