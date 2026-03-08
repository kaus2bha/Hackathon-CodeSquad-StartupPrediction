# StartupPredict - ML-Powered Startup Success Prediction

A comprehensive MERN stack web application that uses machine learning to predict startup success or failure based on various business metrics and market factors.

## 🚀 Features

- **AI-Powered Predictions**: Advanced machine learning model trained on thousands of startup data points
- **Comprehensive Analysis**: Analyzes funding, team size, revenue, market conditions, and business models
- **Real-time Results**: Get predictions with confidence scores within seconds
- **User Dashboard**: Track prediction history and view analytics
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Secure Authentication**: JWT-based user authentication and authorization
- **Data Visualization**: Interactive charts and graphs for insights

## Demo Videos And Presentation

- Demo Video
  https://drive.google.com/file/d/1178cCWOAswfNoPFQpWAPu5ewLaOje92S/view?usp=drivesdk

- Pitch Video
  https://drive.google.com/file/d/1sfGNk-1G6r9yMPzBrl4Yt8cDWqynIT30/view?usp=drivesdk

- Power Point Presentation
  https://docs.google.com/presentation/d/1C53BOCSwgOrw6mBgTpPWXmm1OS9yj07d/edit?usp=drivesdk&ouid=113131331815429739934&rtpof=true&sd=true


## 🛠️ Technology Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Python** - Machine learning models
- **Python-shell** - Node.js-Python integration

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Machine Learning
- **Python** - ML model development
- **Pickle** - Model serialization
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd startup-prediction-mern
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/startup-prediction
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MODEL_PATH=./models/startup_model.pkl
SCALER_PATH=./models/scaler.pkl
PYTHON_PATH=python3
```

### 4. Set Up MongoDB

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB
```

### 5. Add Your ML Models

Place your trained machine learning models in the `models/` directory:

```
models/
├── startup_model.pkl    # Your trained model
└── scaler.pkl          # Your data scaler (optional)
```

### 6. Install Python Dependencies

```bash
pip install numpy scikit-learn pandas
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Run both backend and frontend concurrently
npm run dev

# Or run them separately:

# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Production Mode

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### Predictions
- `POST /api/predictions` - Create new prediction
- `GET /api/predictions` - Get user's predictions
- `GET /api/predictions/:id` - Get specific prediction

## 🎯 Usage

### 1. User Registration/Login
- Navigate to the registration page to create an account
- Or login with existing credentials

### 2. Make Predictions
- Go to the "Predict" page
- Fill in your startup details:
  - Startup name and industry
  - Funding amount and team size
  - Revenue and years in business
  - Market size and competition level
  - Business model and technology stack

### 3. View Results
- Get instant predictions with confidence scores
- View detailed analysis and recommendations
- Access prediction history in your dashboard

### 4. Track Analytics
- Monitor your prediction history
- View success/failure trends
- Analyze confidence score patterns

## 🔧 Configuration

### ML Model Integration

The application uses a Python script (`python/predict.py`) to load and run your trained models. Make sure your models are compatible with the expected input format:

```python
# Expected input features
features = [
    normalized_funding,
    normalized_team_size,
    normalized_years,
    normalized_revenue,
    market_size_encoded,
    competition_level_encoded,
    business_model_encoded
]
```

### Customizing the Prediction Logic

You can modify the prediction logic in:
- `services/mlService.js` - Node.js service
- `python/predict.py` - Python prediction script

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## 📁 Project Structure

```
startup-prediction-mern/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── models/                 # ML model files
│   ├── startup_model.pkl
│   └── scaler.pkl
├── python/                 # Python ML scripts
│   └── predict.py
├── routes/                 # API routes
│   ├── auth.js
│   └── predictions.js
├── services/               # Business logic
│   └── mlService.js
├── server.js              # Express server
├── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Cross-origin resource sharing protection
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Heroku Deployment

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Heroku CLI:

```bash
heroku create your-app-name
git push heroku main
```

### Vercel Deployment (Frontend)

```bash
cd client
vercel
```

### Railway Deployment (Backend)

```bash
railway login
railway init
railway up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Machine learning community for open-source libraries
- React and Node.js communities for excellent documentation
- All contributors and users of this project

---

**Made with ❤️ for the startup community**
