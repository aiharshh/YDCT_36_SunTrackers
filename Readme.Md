# SunTrackers - PowerWestJava 🌞

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)

**PowerWestJava** is a unified platform designed to democratize renewable energy in West Java, Indonesia. It connects schools, local investors, and the government to accelerate solar adoption through AI-powered planning, community investment opportunities, and real-time impact analytics.

## 🚀 Features

### ☀️ Solar Planner (AI-Powered)
- Calculate solar potential, costs, and savings for schools based on local irradiance data
- AI-powered advisor for personalized recommendations
- Interactive calculator for different scenarios

### 💰 Community Investment
- Gamified marketplace allowing locals to fund solar projects with micro-investments
- Track investment progress and returns
- Support local educational institutions

### 📊 Impact Analytics (Login Required)
- Real-time dashboards tracking carbon reduction and energy transition progress
- Visual analytics for schools, investors, and government stakeholders
- Performance metrics and reporting
- **Access restricted to authenticated users only**

### 🔐 Secure Authentication
- Full user management via Firebase Authentication
- Support for Email/Password registration and login
- Secure session management with automatic state tracking
- Protected routes for sensitive features

### 🤖 AI Chat Assistant (Login Required)
- Intelligent advisor powered by GROQ API
- Help with solar planning and investment decisions
- Real-time support and guidance
- Context-aware navigation suggestions
- **Access restricted to authenticated users only** to prevent unauthorized API usage

### 🌍 Bilingual Support
- Full English and Indonesian (Bahasa) language support
- Toggle language from Navbar or Login page
- AI assistant responds in user's preferred language
- Consistent translations across all pages

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0 with Vite
- **Routing**: React Router DOM v7.10.1
- **Authentication**: Firebase v12.7.0
- **Styling**: Custom CSS (No frameworks)
- **Visual Effects**: Canvas Confetti v1.9.4
- **Build Tool**: Vite v7.2.4

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: GROQ SDK & Google Generative AI
- **CORS**: Cross-Origin Resource Sharing enabled
- **Data Parsing**: Body Parser

### APIs & Services
- **GROQ API**: AI chat functionality
- **Google Generative AI**: Enhanced AI capabilities
- **Firebase**: Authentication and user management

## 📦 Project Structure

```
YDCT_36_SunTrackers/
├── Readme.Md                          # Main comprehensive README
├── The Architecture.md                # Architecture documentation
├── DEV_SETUP.md                       # Development setup guide
├── TODO_ChatbotNavigation.md         # Chatbot implementation tracking
├── package.json                       # Root package config
├── package-lock.json
│
├── backend/                           # Node.js Express API
│   ├── index.js                      # Main server file with AI endpoints
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json
│   └── .env                          # Environment variables (GROQ_API_KEY, PORT)
│
├── frontend/                          # React application
│   ├── README.md                     # Default Vite template
│   ├── package.json                  # Frontend dependencies
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── public/                       # Static assets
│   │   ├── vite.svg
│   │   ├── background.jpg
│   │   ├── dashboard-admin.png
│   │   ├── dashboard-school.png
│   │   ├── Home_SolarPanelBackground.png
│   │   ├── SolarExplanation.png
│   │   ├── SolarPanelExplanation.jpeg
│   │   ├── data/                     # CSV data files
│   │   │   ├── admin.csv
│   │   │   ├── schools.csv
│   │   │   ├── school_energy_log.csv
│   │   │   └── *.csv files
│   │   └── geo/                      # GeoJSON files
│   │       └── Kota_Kabupaten_Jawa_Barat.geojson
│   │
│   └── src/                         # React source code
│       ├── main.jsx                 # Entry point
│       ├── App.jsx                  # Main app with routing
│       ├── App.css                   # Global styles
│       ├── index.css                 # Global CSS reset
│       ├── firebase.js               # Firebase configuration & auth helpers
│       ├── assets/                   # React assets
│       │   └── react.svg
│       │
│       ├── components/               # Reusable components
│       │   ├── Navbar.jsx           # Navigation bar with auth state
│       │   ├── Footer.jsx           # Footer with team & quick links
│       │   ├── ScrollToTop.jsx      # Scroll management
│       │   ├── SchoolView.jsx        # School dashboard view
│       │   ├── AdminView.jsx        # Admin dashboard view
│       │   ├── SchoolReal.jsx        # Real school data display
│       │   ├── SolarPanelExplanation.jsx
│       │   ├── HowInvestmentWorks.jsx
│       │   └── *.jsx
│       │
│       ├── pages/                    # Main application pages
│       │   ├── Home.jsx             # Landing page
│       │   ├── Login.jsx            # Login/Register with auth redirect
│       │   ├── Planner.jsx          # Solar calculator
│       │   ├── Invest.jsx           # Investment marketplace
│       │   ├── Analysis.jsx         # Impact dashboard (protected)
│       │   ├── Chat.jsx             # AI chat assistant (protected)
│       │   ├── Profile.jsx          # User profile (protected)
│       │   ├── Articles.jsx         # Knowledge center
│       │   ├── ArticleDetail.jsx    # Article reader
│       │   ├── Portfolio.jsx        # Investment portfolio
│       │   ├── Checkout.jsx         # Payment checkout
│       │   ├── TopUp.jsx            # Wallet top-up
│       │   └── Receipt.jsx          # Transaction receipt
│       │
│       ├── context/                  # React context providers
│       │   └── LanguageContext.jsx   # Bilingual support (EN/ID)
│       │
│       ├── services/                 # API utilities
│       │   └── api.js
│       │
│       ├── advisor/                  # AI advisor
│       │   └── advisor.js
│       │
│       ├── data/                     # Static data
│       │   ├── articlesData.js      # Articles content
│       │   └── vendor.js
│       │
│       └── styles/                   # Page-specific CSS
│           ├── Chat.css              # Chatbot styles + auth prompts
│           ├── Login.css
│           ├── Navbar.css
│           ├── Invest.css
│           ├── Planner.css
│           ├── Analysis.css
│           ├── Articles.css
│           ├── ArticleDetail.css
│           ├── Profile.css
│           ├── Home.css
│           ├── Footer.css (inline)
│           └── *.css
│
└── scripts/
    └── smoke-test.sh                # Test script
```

## 🔐 Protected Routes

The following routes require authentication:

| Route | Page | Description |
|-------|------|-------------|
| `/analysis` | Impact Dashboard | Real-time monitoring data |
| `/chat` | AI Chat Assistant | AI-powered advisor (API-protected) |
| `/profile` | User Profile | Investment history & settings |

### Authentication Flow:
1. **Non-authenticated users** attempting to access protected routes will see:
   - **Chat**: Dedicated "Login Required" screen with explanation
   - **Dashboard**: Authentication prompt modal/bubble
   - **Profile**: Redirect to login
2. **After login**: Users are redirected to their intended destination
3. **Navbar**: Protected links (Chat, Analysis) are hidden or show login prompts

### API Cost Protection:
- Chatbot access is restricted to logged-in users only
- Prevents unauthorized API calls and controls usage costs
- Clear messaging about authentication requirements

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account for authentication
- GROQ API key for AI functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/febbyvnr/YDCT_36_SunTrackers
   cd YDCT_36_SunTrackers
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   npm install groq-sdk
   node index.js
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Environment Setup**
   
   **Backend (.env file in backend directory):**
   ```
   GROQ_API_KEY=your_groq_api_key
   PORT=5001
   ```

   **Frontend (.env file in frontend directory):**
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:5001
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev  # or npm start
   ```
   Server will run on `http://localhost:5001`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

## 📋 Usage Guide

### Getting Started
1. **Login/Register**: Create an account or login (required for chatbot & dashboard)
2. **Home**: Access the home page to see all available features
3. **Solar Planning**: Use the calculator to estimate solar potential and costs
4. **Investment**: Browse and fund community solar projects
5. **Analytics**: View impact dashboards and progress tracking (login required)
6. **AI Chat**: Get personalized advice from the AI advisor (login required)

### Key Pages
| Path | Page | Auth Required |
|------|------|---------------|
| `/home` | Main landing page | No |
| `/login` | Login/Register | No |
| `/planner` | Solar Calculator | No |
| `/invest` | Investment Marketplace | No |
| `/articles` | Knowledge Center | No |
| `/chat` | AI Chat Assistant | ✅ Yes |
| `/analysis` | Impact Dashboard | ✅ Yes |
| `/profile` | User Profile | ✅ Yes |

### Bilingual Support
- Click the 🌐 icon in the Navbar or Login page to toggle between English and Indonesian
- AI Chat responds in your selected language
- All UI text updates dynamically

## 🧪 Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (development)

### Key Implementation Details

#### Authentication System
```javascript
// Firebase auth state tracking
onAuthStateChanged(auth, (user) => {
  setIsAuthenticated(!!user);
});

// Protected route navigation
const handleNavigate = (route) => {
  const page = NAVIGATION_PAGES.find(p => p.route === route);
  if (page?.requiresAuth && !isAuthenticated) {
    setShowAuthPrompt(true);
    return;
  }
  navigate(route);
};
```

#### Bilingual Support
```javascript
// Language toggle in LanguageContext
const toggleLanguage = () => {
  setLanguage(prev => prev === 'en' ? 'id' : 'en');
};
```

#### Chatbot with Navigation
- Context-aware navigation suggestions
- Protected route detection
- Automatic auth prompts for restricted pages

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration provided
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent formatting

## 🌟 Key Features Deep Dive

### Solar Planning Engine
- Location-based solar irradiance calculations
- Cost estimation including installation and maintenance
- ROI calculations and payback period analysis
- Environmental impact assessment

### Investment Platform
- Micro-investment opportunities starting from small amounts
- Gamified progress tracking with visual rewards
- Project progress updates and milestone celebrations
- Community building features

### Analytics Dashboard
- Real-time energy generation tracking
- Carbon footprint reduction metrics
- Financial performance indicators
- Community impact visualization

### AI Chat Assistant
- Powered by GROQ API for intelligent responses
- Context-aware navigation suggestions
- Supports both English and Indonesian
- Protected access to control API usage

## 🔒 Security

- Firebase Authentication for secure user management
- Protected routes for sensitive features
- Session-based redirect after authentication
- CORS configuration for API security
- Environment variables for sensitive data
- Secure API key management

## 📊 Performance

- Vite for fast development and optimized builds
- React 19 for improved performance
- Efficient API design with minimal latency
- Optimized bundle size and lazy loading

## 🌍 Environmental Impact

This project aims to accelerate renewable energy adoption in West Java by:
- Reducing carbon emissions through solar adoption
- Making renewable energy accessible to educational institutions
- Creating economic opportunities through community investment
- Building awareness about clean energy benefits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Developed for the **YDCT SL2 with Meta 2025** competition as part of efforts to democratize renewable energy in Indonesia.

### Team Members:
- **Febian Nurwanto**
- **Harsh Hublikar**
- **Isha Samanat**
- **Kim Seulkichan**
- **Kishore K**
- **Shraddha Gajanan Desai**

## 🤝 Support

For support, contact team members or join community discussions.

## 🗺️ Roadmap

- [ ] Mobile application development
- [ ] Integration with local solar installation companies
- [ ] Advanced analytics with machine learning
- [ ] Government dashboard for policy makers
- [ ] Integration with utility companies for grid management

---

**Built with 💚 for a sustainable future in West Java** 🌱

