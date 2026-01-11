import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

// Unified Schema for Both JSON and Firebase
export interface HeroContent {
  title: string;
  teluguText: string;
  subtitle: string;
  location: string;
  carouselImages: string[];
}

export interface AboutSection {
  heading: string;
  content: string;
}

export interface AboutContent {
  title: string;
  sections: AboutSection[];
}

export interface ServiceItem {
  name: string;
  description: string;
  price: string;
  icon: string;
}

export interface EventItem {
  name: string;
  date: string;
  description: string;
  icon: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  templeName: string;
  address: string;
  phone: string;
  email: string;
  timings: {
    morning: string;
    evening: string;
  };
}

// Complete Temple Content Structure
export interface TempleContentData {
  hero?: HeroContent;
  about?: AboutContent;
  services?: ServiceItem[];
  events?: EventItem[];
  features?: FeatureItem[];
  contact?: ContactInfo;
}

// For Firestore document metadata
export interface TempleContent {
  id?: string;
  section: string;  // "hero", "about", "services", etc.
  data: any;        // The actual content (matches JSON structure)
  updatedAt?: Date;
}

export interface GalleryImage {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  uploadedAt: Date;
}

export interface Donation {
  id?: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'success' | 'failed';
  message?: string;
  createdAt: Date;
  emailSent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  // Content Management - Unified Schema
  
  // Get specific section (hero, about, services, etc.)
  async getContentSection(section: string): Promise<any> {
    const contentRef = doc(this.firestore, 'content', section);
    const snapshot = await getDoc(contentRef);
    if (snapshot.exists()) {
      return snapshot.data()['data'];
    }
    return null;
  }

  // Get all content sections
  async getAllContent(): Promise<TempleContentData> {
    const contentRef = collection(this.firestore, 'content');
    const snapshot = await getDocs(contentRef);
    
    const result: TempleContentData = {};
    snapshot.docs.forEach(doc => {
      const section = doc.id; // 'hero', 'about', 'services', etc.
      result[section as keyof TempleContentData] = doc.data()['data'];
    });
    
    return result;
  }

  // Update specific section
  async updateContentSection(section: string, data: any): Promise<void> {
    const contentRef = doc(this.firestore, 'content', section);
    await updateDoc(contentRef, {
      section: section,
      data: data,
      updatedAt: Timestamp.now()
    });
  }

  // Create new section
  async createContentSection(section: string, data: any): Promise<void> {
    const contentRef = doc(this.firestore, 'content', section);
    await addDoc(collection(this.firestore, 'content'), {
      section: section,
      data: data,
      updatedAt: Timestamp.now()
    });
  }

  // Legacy methods for backward compatibility
  async getContent(): Promise<TempleContent[]> {
    const contentRef = collection(this.firestore, 'content');
    const q = query(contentRef, orderBy('section'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      section: doc.data()['section'],
      data: doc.data()['data'],
      updatedAt: doc.data()['updatedAt']?.toDate()
    } as TempleContent));
  }

  async updateContent(id: string, data: Partial<TempleContent>): Promise<void> {
    const contentRef = doc(this.firestore, 'content', id);
    await updateDoc(contentRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  async addContent(data: Omit<TempleContent, 'id'>): Promise<string> {
    const contentRef = collection(this.firestore, 'content');
    const docRef = await addDoc(contentRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Gallery Management
  async getGalleryImages(): Promise<GalleryImage[]> {
    const galleryRef = collection(this.firestore, 'gallery');
    const q = query(galleryRef, orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data()['uploadedAt']?.toDate()
    } as GalleryImage));
  }

  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async addGalleryImage(data: Omit<GalleryImage, 'id'>): Promise<string> {
    const galleryRef = collection(this.firestore, 'gallery');
    const docRef = await addDoc(galleryRef, {
      ...data,
      uploadedAt: Timestamp.now()
    });
    return docRef.id;
  }

  async deleteGalleryImage(id: string, imageUrl: string): Promise<void> {
    // Delete from Firestore
    const galleryRef = doc(this.firestore, 'gallery', id);
    await deleteDoc(galleryRef);
    
    // Delete from Storage
    try {
      const imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }
  }

  // Donation Management
  async createDonation(data: Omit<Donation, 'id'>): Promise<string> {
    const donationsRef = collection(this.firestore, 'donations');
    const docRef = await addDoc(donationsRef, {
      ...data,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  async updateDonation(id: string, data: Partial<Donation>): Promise<void> {
    const donationRef = doc(this.firestore, 'donations', id);
    await updateDoc(donationRef, data);
  }

  async getDonations(): Promise<Donation[]> {
    const donationsRef = collection(this.firestore, 'donations');
    const q = query(donationsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()['createdAt']?.toDate()
    } as Donation));
  }

  async getDonationById(id: string): Promise<Donation | null> {
    const donationRef = doc(this.firestore, 'donations', id);
    const snapshot = await getDoc(donationRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data()['createdAt']?.toDate()
      } as Donation;
    }
    return null;
  }
}
