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
    

    const { id } = await params;
    
    console.log('🔍 === INDIVIDUAL NOTE API DEBUG START ===');
    
    

    const session = await getServerSession(authOptions);
    console.log('👤 Session exists:', !!session);
    console.log('👤 Session user ID:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.log('❌ No user ID in session - UNAUTHORIZED');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📝 Looking for note ID:', id);
    console.log('👤 For user ID:', session.user.id);

    



    await connectDB();
    console.log('✅ Database connected');

    


    console.log('🔎 Trying to find any note with this ID...');
    const anyNote = await Note.findById(id);
    console.log('📝 FindById result:', anyNote ? 'FOUND' : 'NOT FOUND');

    if (anyNote) {
      console.log('📝 Note exists in database:');
      console.log('   - ID:', anyNote._id.toString());
      console.log('   - Title:', anyNote.title);
      console.log('   - User ID:', anyNote.userId.toString());
      console.log('   - User ID type:', typeof anyNote.userId);
      console.log('   - Session User ID:', session.user.id);
      console.log('   - Session User ID type:', typeof session.user.id);
      console.log('   - Users match:', anyNote.userId.toString() === session.user.id);
    }

    


    console.log('🔎 Trying main query with userId filter...');
    const note = await Note.findOne({
      _id: id,
      userId: session.user.id
    });

    console.log('📝 Main query result:', note ? 'FOUND' : 'NOT FOUND');

    if (note) {
      console.log('✅ SUCCESS: Note found with userId filter');
      console.log('📝 Note details:');
      console.log('   - Title:', note.title);
      console.log('   - User ID:', note.userId.toString());
      
      


      return NextResponse.json({ 
        note: {
          _id: note._id.toString(),
          title: note.title,
          content: note.content,
          tags: note.tags || [],
          userId: note.userId.toString(),
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        }
      });
    } else {
      console.log('❌ Note not found with userId filter');
      
      

      console.log('🔎 Getting all notes for user...');
      const userNotes = await Note.find({ userId: session.user.id });
      console.log(`📝 User has ${userNotes.length} notes:`);
      userNotes.forEach((userNote, index) => {
        console.log(`   ${index + 1}. ID: ${userNote._id.toString()}, Title: ${userNote.title}`);
        console.log(`      ID match: ${userNote._id.toString() === id}`);
      });

      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
  } catch (error) {
    console.error('💥 ERROR in individual note API:');
    
    

    if (error instanceof Error) {
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
      if (error.stack) {
        console.error('💥 Error stack:', error.stack);
      }
    } else {
      console.error('💥 Unknown error type:', error);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise first
    const { id } = await params;
    
    console.log('✏️ === UPDATE NOTE API ===');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      {
        title,
        content,
        tags: tags || [],
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      note: {
        _id: note._id.toString(),
        title: note.title,
        content: note.content,
        tags: note.tags,
        userId: note.userId.toString(),
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });
  } catch (error) {
    console.error('Update note error:', error);
    
    if (error instanceof Error) {
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    

    const { id } = await params;
    
    console.log('🗑️ === DELETE NOTE API ===');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    
    if (error instanceof Error) {
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}