import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    console.log('✅ Database connected in simple test');

    
    
    const notes = await Note.find({ userId: session.user.id }).limit(1);
    
    return NextResponse.json({
      success: true,
      sessionUserId: session.user.id,
      noteCount: notes.length,
      firstNote: notes[0] ? {
        _id: notes[0]._id.toString(),
        title: notes[0].title,
        userId: notes[0].userId.toString()
      } : null
    });
  } catch (error) {
    console.error('💥 Simple test error:', error);
    
    if (error instanceof Error) {
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
      console.error('💥 Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Simple test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}