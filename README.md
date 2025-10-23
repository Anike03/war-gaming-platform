# 🎮 WAR — Win & Rule

A modern **points-based web gaming platform** where players test their skills, earn points, climb leaderboards, and redeem rewards.  
Developed as a **multi-game React + Firebase** project for interactive entertainment and skill-based learning.

---

## 🌐 Live Project & Access

🔗 **Live Deployment:** [https://war-win-rule.web.app](https://war-win-rule.web.app)  
💻 **GitHub Repository:** [https://github.com/aniketsharma9360/war-win-rule](https://github.com/aniketsharma9360/war-win-rule)

🔑 **Admin Login** - coming soon 



---

## ✨ Key Features

### 🎯 Core Experience
- **Games Arena:** 7 fully playable games  
  `Number Grid · Color Grid · Tic-Tac-Toe · QuizQuest · Sudoku · Chess · Crossword`
- **Smart Game Modal:** Choose difficulty with live reward preview  
- **Advanced Scoring:** Difficulty multipliers + streak/time bonuses  
- **Global Leaderboards:** Real-time competitive rankings  

### 👤 User Features
- **Profile Dashboard:** View history, milestones & achievements  
- **Reward System:** Redeem gift cards using earned points  
- **Authentication:** Email/Password + Google OAuth login  
- **Secure Points System:** Cloud-based tracking with anti-cheat logic  

### 🎨 Design & UX
- **Modern Dark Theme:** Neon gradients with high contrast  
- **Responsive Layout:** Fully mobile-friendly (grid adjusts 3×3 on phones)  
- **Accessibility:** Keyboard navigation + color-contrast tested  

---

## 🏗️ Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React 18+ (Hooks, Context API) |
| **Backend** | Firebase Auth + Firestore |
| **Styling** | Custom CSS + Utility Classes |
| **Icons** | Lucide React |
| **Build Tools** | Vite / npm |
| **Deployment** | Firebase Hosting / Vercel |

---

## 📁 Project Structure

src/
├── components/
│ ├── common/
│ │ └── Header.jsx
│ └── games/
│ ├── NumberGrid.jsx
│ ├── ColorGrid.jsx
│ ├── TicTacToe.jsx
│ ├── QuizQuest.jsx
│ ├── Sudoku.jsx
│ ├── Chess.jsx
│ └── Crossword.jsx
├── context/
│ ├── AuthContext.jsx
│ ├── GameContext.jsx
│ └── RedemptionContext.jsx
├── hooks/
│ └── index.js
├── pages/
│ ├── Games.jsx
│ ├── Leaderboard.jsx
│ ├── Profile.jsx
│ └── Redeem.jsx
└── utils/
├── firebase.js
└── gameLogic/
├── numberGrid.js
├── quizData.js
└── colorGrid.js


---

## 🚀 Quick Start

1️⃣ Installation
```bash
git clone https://github.com/aniketsharma9360/war-win-rule
cd war-win-rule
npm install

2️⃣ Firebase Setup

Enable:

Authentication: Email/Password + Google

Firestore Database: For user, games & redemption data

Add your Firebase config to src/utils/firebase.js:

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

3️⃣ Environment Variables

Create .env (for Vite) or .env.local (for CRA):

VITE_FB_API_KEY=your_api_key_here
VITE_FB_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FB_PROJECT_ID=your-project-id
VITE_FB_STORAGE_BUCKET=your-project.appspot.com
VITE_FB_MESSAGING_SENDER_ID=123456789
VITE_FB_APP_ID=1:123456789:web:abcdef123456


🧮 Points System
Difficulty	Base Points	Bonus
Easy	25	Time/Streak
Medium	50	Time/Streak
Hard	75	Time/Streak
Extreme	100	Accuracy & Speed


🗄️ Firestore Structure
users/
  uid/
    displayName, email, points, isAdmin, createdAt

games/
  gameId/
    userId, name, difficulty, score, pointsEarned, duration

redemptions/
  rid/
    userId, vendor, value, points, status, giftCardCode


🔧 Development Commands
# Run dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview


🏆 Game Logic Contract

Each game must call:

onGameEnd({
  completed: boolean,
  score: number,
  pointsEarned?: number,
  duration?: number,
  meta?: Record<string, any>
})


🐛 Troubleshooting
Issue	Solution
Leaderboard empty	Ensure /users/* readable and users have points field
Game not saving	Check GameContext endGame() implementation
onGameEnd not found	Pass correctly from GameModal
Result modal closes too fast	Increased to 15s in current build


🔐 Production Checklist

 Harden Firestore security rules

 Enable admin-only write access

 Optimize images & code-split games

 Add analytics + error logging

 Anti-abuse monitoring for redemptions

🗺️ Roadmap
Coming Soon

🧑‍🤝‍🧑 Party Play: Private multiplayer rooms

🏆 Seasonal Ladders: Reset cycles & rewards

✨ Enhanced Graphics: Three.js / WebGL effects

📱 Progressive Web App (PWA) + offline caching

Future Vision

🤖 AI-powered game suggestions

👑 Clan-based competitions

🪙 Crypto/NFT reward integration

🤝 Contributing

Pull requests are welcome!
Open an issue or suggest a feature via GitHub Discussions.

📝 License

MIT License © 2025 Aniketkumar Sharma

All rights reserved for educational showcase.

⚔️ Ready to Rule?
Play Now →
Created with 💻 + ❤️ by Aniket Sharma
