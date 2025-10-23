import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise first
    const { id } = await params;
    
    console.log('🧪 === TEST NOTE API ===');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Method 1: Find by ID first, then check user
    const noteById = await Note.findById(id);
    
    if (!noteById) {
      return NextResponse.json({ error: 'Note not found in database' }, { status: 404 });
    }

    // Check if note belongs to user
    if (noteById.userId.toString() !== session.user.id) {
      return NextResponse.json({ 
        error: 'Note belongs to different user',
        noteUserId: noteById.userId.toString(),
        sessionUserId: session.user.id
      }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true,
      note: {
        _id: noteById._id.toString(),
        title: noteById.title,
        content: noteById.content,
        tags: noteById.tags || [],
        userId: noteById.userId.toString(),
        createdAt: noteById.createdAt,
        updatedAt: noteById.updatedAt
      }
    });
    
  } catch (error) {
    console.error('💥 TEST API ERROR:', error);
    
    if (error instanceof Error) {
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
    }
    
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}