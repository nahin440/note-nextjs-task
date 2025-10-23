
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

interface QueryFilter {
  userId: string;
  $or?: Array<{
    title?: { $regex: string; $options: string };
    content?: { $regex: string; $options: string };
    tags?: { $in: RegExp[] };
  }>;
  tags?: { $in: string[] };
}

interface SortOptions {
  [key: string]: 1 | -1;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'updatedAt';
    const limit = searchParams.get('limit');

    const query: QueryFilter = { userId: session.user.id };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Tag filtering
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    // Sorting
    const sortOptions: SortOptions = {};
    if (sort === 'title') {
      sortOptions.title = 1;
    } else if (sort === 'createdAt') {
      sortOptions.createdAt = -1;
    } else if (sort === 'updatedAt') {
      sortOptions.updatedAt = -1;
    }

    let queryBuilder = Note.find(query).sort(sortOptions);
    
    
    
    if (limit) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }

    const notes = await queryBuilder;

    return NextResponse.json({ 
      notes: notes.map(note => ({
        _id: note._id.toString(),
        title: note.title,
        content: note.content,
        tags: note.tags,
        userId: note.userId.toString(),
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('📝 === CREATE NOTE API ===');
    
    const session = await getServerSession(authOptions);
    console.log('👤 Session user ID:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.log('❌ No session - UNAUTHORIZED');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📦 Request body:', body);
    
    const { title, content, tags } = body;

    if (!title || !content) {
      console.log('❌ Missing title or content');
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('✅ Database connected');

    const noteData = {
      title,
      content,
      tags: tags || [],
      userId: session.user.id,
    };

    console.log('💾 Creating note with data:', noteData);

    const note = await Note.create(noteData);
    console.log('✅ Note created successfully:', note._id);

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
    }, { status: 201 });
  } catch (error) {
    console.error('💥 Create note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}