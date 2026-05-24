import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await destroySession();

    return NextResponse.json(
      { success: true, message: 'Logout erfolgreich' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Logout' },
      { status: 500 }
    );
  }
}
