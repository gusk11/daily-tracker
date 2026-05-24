import { NextRequest, NextResponse } from 'next/server';
import { verifyPin, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, message: 'PIN erforderlich' },
        { status: 400 }
      );
    }

    const isValid = await verifyPin(pin);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'PIN ist nicht korrekt' },
        { status: 401 }
      );
    }

    await createSession();

    return NextResponse.json(
      { success: true, message: 'Login erfolgreich' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Login' },
      { status: 500 }
    );
  }
}
