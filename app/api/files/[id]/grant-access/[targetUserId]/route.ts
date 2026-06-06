import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string; targetUserId: string }> }
) {
  const { id, targetUserId } = await context.params
  const token = req.cookies.get('auth_token')?.value

  // LOGOWANIE - SPRAWDŹ TERMINAL
  console.log("--- PROXY DEBUG ---");
  console.log("Token z ciasteczka:", token ? "OBECNY" : "BRAK");
  console.log("URL Backend:", `http://localhost:8080/api/files/${id}/grant-access/${targetUserId}`);

  if (!token) {
    return NextResponse.json({ error: 'Brak tokenu.' }, { status: 401 });
  }

  const res = await fetch(`http://localhost:8080/api/files/${id}/grant-access/${targetUserId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // Tu wysyłasz token do Javy
      'Content-Type': 'application/json'
    },
  })

  const text = await res.text()
  console.log("Backend status:", res.status);
  console.log("Backend response:", text);

  if (!res.ok) {
    return NextResponse.json({ error: text }, { status: res.status })
  }

  return new NextResponse(text, { status: 200 })
}