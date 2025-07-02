# 🎯 Wordle Speedrun Challenge

A competitive Wordle game where players race through multiple words in succession, building streaks and competing on live leaderboards. Miss a word? Start over from streak 1!

## 🚀 Features

### 🎮 **Core Gameplay**
- **Progressive Streak System**: Solve words 1, 2, 3, etc. in sequence
- **Continuous Timer**: Clock runs across all words in your streak
- **High-Stakes Risk**: Miss any word and restart from streak 1
- **5,757 Word Database**: Massive variety using curated 5-letter words

### 🏆 **Competitive Elements**
- **Live Leaderboards**: Separate rankings for each streak level
- **Real-time Updates**: See your competition as they play
- **Personal Bests**: Track your fastest times per streak level
- **Global Rankings**: Compete with players worldwide

### 🔐 **User System**
- **Secure Authentication**: Email/password with Supabase Auth
- **User Profiles**: Custom usernames and persistent progress
- **Session Management**: Resume active games across devices
- **Progress Tracking**: Complete game history and statistics

### 🎨 **Modern UI/UX**
- **Beautiful Design**: Gradient backgrounds and smooth animations
- **Responsive Layout**: Perfect on mobile and desktop
- **Real-time Feedback**: Instant validation and progress updates
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Backend**: Supabase (Auth + Database + Real-time)
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toast system

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/jasonpurdy4/wordle-speedrun-challenge.git
cd wordle-speedrun-challenge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Database**
   - In Supabase dashboard, go to SQL Editor
   - Copy and run the contents of `database-setup.sql`
   - This creates all tables, policies, and triggers

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to start playing!

## 📊 Database Schema

### **profiles**
- User information and settings
- Links to Supabase Auth users

### **game_sessions**
- Active game state tracking
- Current streak, timer, and word
- Session persistence across devices

### **leaderboards**
- Competition records by streak level
- Completion times and rankings
- Real-time leaderboard updates

## 🎯 Game Rules

### **How to Play**
1. **Sign Up/Login** to your account
2. **Start Challenge** to begin your first word
3. **Solve Words** in sequence to build your streak
4. **Race the Clock** - timer runs continuously
5. **Compete** on leaderboards for each streak level

### **Scoring System**
- **Streak Level**: How many words you've solved in sequence
- **Completion Time**: Total time from start to completing that streak level
- **Leaderboard Ranking**: Fastest times win for each streak level

### **Risk/Reward**
- ✅ **Solve a word**: Move to next word, streak increases
- ❌ **Miss a word**: Game over, start from streak 1
- ⏱️ **Timer**: Continues running across all words in streak

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
# Connect to Vercel and deploy
```

### **Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

### **Environment Variables**
Make sure to set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🔧 Development

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication forms
│   ├── ui/             # Shadcn/ui components
│   ├── GameGrid.tsx    # Wordle game grid
│   ├── Keyboard.tsx    # Virtual keyboard
│   ├── Leaderboard.tsx # Competition rankings
│   └── SpeedrunWordle.tsx # Main game component
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── GameContext.tsx # Game state management
├── lib/               # Utilities and configuration
│   └── supabase.ts    # Supabase client setup
├── pages/             # Route components
│   └── Auth.tsx       # Login/signup page
├── utils/             # Helper functions
│   ├── wordList.ts    # 5,757 word database
│   └── wordleLogic.ts # Game logic utilities
└── App.tsx            # Main application component
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎮 Game Features Deep Dive

### **Progressive Difficulty**
- Each streak level becomes more prestigious
- Leaderboards get more competitive at higher streaks
- Risk increases as you have more to lose

### **Real-time Competition**
- See live leaderboard updates
- Know when someone beats your record
- Real-time session tracking

### **Session Persistence**
- Resume games across devices
- Never lose progress due to connection issues
- Automatic session recovery

## 🏆 Leaderboard System

### **Streak-Based Rankings**
- Separate leaderboard for each streak level
- Streak 1: Fastest single word
- Streak 2: Fastest two words in sequence
- Streak 10: Elite 10-word speedrun champions

### **Ranking Algorithm**
- Primary: Completion time (ascending)
- Secondary: Completion date (earlier wins ties)
- Updates in real-time as games complete

## 🔐 Security & Privacy

### **Authentication**
- Secure email/password authentication via Supabase
- Row Level Security (RLS) on all database tables
- User data isolation and protection

### **Data Privacy**
- No personal data collection beyond email/username
- Game statistics stored securely
- GDPR compliant data handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🎯 Roadmap

- [ ] **Mobile App**: React Native version
- [ ] **Daily Challenges**: Special themed competitions
- [ ] **Team Competitions**: Group challenges and tournaments
- [ ] **Advanced Stats**: Detailed performance analytics
- [ ] **Social Features**: Friend challenges and sharing
- [ ] **Achievements**: Badge system for milestones

---

## 🎮 Ready to Play?

**Start your speedrun challenge now!**

The clock is ticking, the words are waiting, and the leaderboard is calling your name. How high can your streak go?

[🚀 **PLAY NOW**](https://your-deployment-url.com)
