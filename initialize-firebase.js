const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWW0AaVK_o2ELFbWLlRmEMPmPYEyMZ8z4",
  authDomain: "uttharandhra-sabarimala.firebaseapp.com",
  projectId: "uttharandhra-sabarimala",
  storageBucket: "uttharandhra-sabarimala.firebasestorage.app",
  messagingSenderId: "880432670779",
  appId: "1:880432670779:web:28b1950c20821d7ae54e48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeDatabase() {
  try {
    console.log('🔄 Reading temple content from JSON file...');
    
    // Read the local JSON file
    const contentPath = path.join(__dirname, 'src', 'assets', 'data', 'temple-content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    console.log('📤 Uploading to Firebase Firestore...');
    
    // Upload to Firestore
    const contentRef = doc(db, 'siteContent', 'templeContent');
    await setDoc(contentRef, contentData);
    
    console.log('✅ SUCCESS! Firebase database initialized with temple content');
    console.log('');
    console.log('📊 Uploaded content includes:');
    console.log(`   - Hero section with ${contentData.hero.carouselImages.length} carousel images`);
    console.log(`   - ${contentData.services.length} services`);
    console.log(`   - ${contentData.events.length} events`);
    console.log(`   - ${contentData.features.length} features`);
    console.log(`   - ${contentData.footer?.quickLinks?.length || 0} quick links`);
    console.log(`   - ${contentData.footer?.sponsors?.length || 0} sponsors`);
    console.log('');
    console.log('🌐 Your website now loads data from Firebase!');
    console.log('🔐 You can now edit content from: https://uttharandhra-sabarimala.web.app/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
