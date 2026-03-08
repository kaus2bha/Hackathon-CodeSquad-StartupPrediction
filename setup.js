#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up StartupPredict...\n');

// Check if Node.js is installed
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm is not available. Please install npm first.');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: './client', stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚙️ Creating .env file...');
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/startup-prediction

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# ML Model Configuration
MODEL_PATH=./models/startup_model.pkl
SCALER_PATH=./models/scaler.pkl

# Python Configuration
PYTHON_PATH=python3
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

// Create models directory if it doesn't exist
const modelsDir = path.join(__dirname, 'models');
if (!fs.existsSync(modelsDir)) {
  console.log('\n📁 Creating models directory...');
  fs.mkdirSync(modelsDir);
  console.log('✅ Models directory created');
  
  // Create placeholder files
  const placeholderContent = `# Place your trained ML model here
# This should be your .pkl file from your training process
`;
  
  fs.writeFileSync(path.join(modelsDir, 'startup_model.pkl'), placeholderContent);
  fs.writeFileSync(path.join(modelsDir, 'scaler.pkl'), placeholderContent);
  console.log('✅ Placeholder model files created');
} else {
  console.log('✅ Models directory already exists');
}

// Check Python installation
console.log('\n🐍 Checking Python installation...');
try {
  const pythonVersion = execSync('python3 --version', { encoding: 'utf8' }).trim();
  console.log(`✅ ${pythonVersion}`);
  
  // Check if required Python packages are installed
  console.log('📦 Checking Python dependencies...');
  try {
    execSync('python3 -c "import numpy, sklearn, pandas"', { stdio: 'pipe' });
    console.log('✅ Required Python packages are installed');
  } catch (error) {
    console.log('⚠️ Installing required Python packages...');
    try {
      execSync('pip3 install numpy scikit-learn pandas', { stdio: 'inherit' });
      console.log('✅ Python packages installed successfully');
    } catch (pipError) {
      console.log('⚠️ Failed to install Python packages. Please install them manually:');
      console.log('   pip3 install numpy scikit-learn pandas');
    }
  }
} catch (error) {
  console.log('⚠️ Python3 not found. Please install Python 3.8+ for ML functionality');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Place your trained ML models in the models/ directory');
console.log('3. Update the .env file with your configuration');
console.log('4. Run "npm run dev" to start the application');
console.log('\n🌐 The application will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('\n📚 For more information, check the README.md file');
