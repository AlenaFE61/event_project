const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // Це дозволяє серверу обробляти JSON в тілі запитів
app.use(express.static('public')); // Віддає статичні файли з папки 'public'
app.use(express.urlencoded({ extended: true })); // Для обробки URL-encoded форм

mongoose.connect('mongodb+srv://oyukhymyk:ortgmOoSCuLSDq5I@projectcluster.titrjmf.mongodb.net/?retryWrites=true&w=majority&appName=ProjectCluster', {
  dbName: 'EventDB',
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  organizer: String
});

const ParticipantSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  dob: Date,
  source: String,
  eventId: mongoose.Schema.Types.ObjectId
});

const Event = mongoose.model('Event', EventSchema, 'events');
const Participant = mongoose.model('Participant', ParticipantSchema, 'participants');

app.get('/events', async (req, res) => {
  const { sort } = req.query;
  let sortOptions = {};
  if (sort === 'date') {
    sortOptions = { date: 1 };
  } else if (sort === 'title') {
    sortOptions = { title: 1 };
  } else if (sort === 'organizer') {
    sortOptions = { organizer: 1 };
  }

  try {
    const events = await Event.find().sort(sortOptions);
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const participant = new Participant(req.body);
    await participant.save();
    console.log('Participant saved:', participant);
    res.json(participant);
  } catch (err) {
    console.error('Error saving participant:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/participants/:eventId', async (req, res) => {
  try {
    const participants = await Participant.find({ eventId: req.params.eventId });
    res.json(participants);
  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
