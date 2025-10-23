import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    
    const allUserNotes = await Note.find({ userId: session.user.id });
    
   
    

    const specificNote = await Note.findOne({
      _id: noteId,
      userId: session.user.id
    });


    const noteById = await Note.findById(noteId);

    return NextResponse.json({
      debug: {
        sessionUserId: session.user.id,
        targetNoteId: noteId,
        totalUserNotes: allUserNotes.length,
        specificNoteExists: !!specificNote,
        noteByIdExists: !!noteById,
        noteByIdUserId: noteById?.userId?.toString(),
        usersMatch: noteById?.userId?.toString() === session.user.id
      },
      userNotes: allUserNotes.map(note => ({
        _id: note._id.toString(),
        title: note.title,
        userId: note.userId.toString(),
        matchesTarget: note._id.toString() === noteId
      }))
    });
  } catch (error) {
    console.error('Debug note error:', error);
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}