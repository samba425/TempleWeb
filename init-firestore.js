const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase config (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyDHq0n7JN7wCVCLI_1s7SjY5x5MqV0RtNc",
  authDomain: "uttharandhra-sabarimala.firebaseapp.com",
  projectId: "uttharandhra-sabarimala",
  storageBucket: "uttharandhra-sabarimala.firebasestorage.app",
  messagingSenderId: "72046519850",
  appId: "1:72046519850:web:f43d0e9f7e2b3a91b5f8b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeFirestore() {
  try {
    // Read the temple content JSON
    const contentPath = path.join(__dirname, 'src/assets/data/temple-content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    console.log('📖 Read temple content from JSON file');
    
    // Upload to Firestore
    const docRef = doc(db, 'siteContent', 'templeContent');
    await setDoc(docRef, content);
    
    console.log('✅ Successfully initialized Firestore with temple content!');
    console.log('📊 Uploaded data includes:');
    console.log(`   - Hero section: ${content.hero.title}`);
    console.log(`   - Services: ${content.services?.length || 0} items`);
    console.log(`   - Events: ${content.events?.length || 0} items`);
    console.log(`   - Features: ${content.features?.length || 0} items`);
    console.log(`   - Footer: ${content.footer ? 'Configured' : 'Not set'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    process.exit(1);
  }
}

initializeFirestore();
