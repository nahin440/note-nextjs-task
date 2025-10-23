import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  userId: {
    type: String, // Make sure this matches what you're storing
    required: true,
  },
}, {
  timestamps: true,
});

// If you're using ObjectId for userId, change it to:
// userId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'User',
//   required: true,
// },

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);