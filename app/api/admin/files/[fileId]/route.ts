import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params
    const cookieStore = cookies()
    const resolvedCookieStore = await cookieStore
    const token = resolvedCookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const backendResponse = await fetch(`http://localhost:8080/api/admin/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const errText = await backendResponse.text()
      return NextResponse.json({ error: errText || 'Błąd usuwania pliku' }, { status: backendResponse.status })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Błąd serwera' }, { status: 500 })
  }
}