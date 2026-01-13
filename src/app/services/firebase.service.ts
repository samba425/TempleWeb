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
  startDate?: string; // ISO date string for event start
  endDate?: string;   // ISO date string for event end (auto-remove after endDate + 2 days)
}

export interface Announcement {
  id?: string;
  title: string;
  message: string;
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string (auto-remove after endDate + 2 days)
  priority: 'high' | 'medium' | 'low';
  isActive?: boolean;
  imageUrl?: string;  // Optional image URL for the announcement
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
  announcements?: Announcement[];
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
    // Compress image before converting to base64 (fits in Firestore, loads faster)
    const compressedFile = await this.compressImage(file, 800, 0.7); // Max 800px width, 70% quality
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsDataURL(compressedFile);
    });
  }

  private compressImage(file: File, maxWidth: number, quality: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Calculate new dimensions (maintain aspect ratio)
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas size and draw compressed image
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob then file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
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
    // Delete from Firestore (base64 images stored directly in Firestore)
    const galleryRef = doc(this.firestore, 'gallery', id);
    await deleteDoc(galleryRef);
    // No separate storage to clean up - base64 is deleted with the document
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

  // Announcements Management
  async getAnnouncements(): Promise<Announcement[]> {
    const announcementsRef = collection(this.firestore, 'announcements');
    const q = query(announcementsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as unknown as Announcement));
  }

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    const announcementRef = doc(this.firestore, 'announcements', id);
    const snapshot = await getDoc(announcementRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as unknown as Announcement;
    }
    return null;
  }

  async createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Promise<string> {
    const announcementsRef = collection(this.firestore, 'announcements');
    const docRef = await addDoc(announcementsRef, {
      ...data,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
    const announcementRef = doc(this.firestore, 'announcements', id);
    await updateDoc(announcementRef, data);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const announcementRef = doc(this.firestore, 'announcements', id);
    await deleteDoc(announcementRef);
  }

  // Get active announcements (for public display)
  async getActiveAnnouncements(): Promise<Announcement[]> {
    const announcements = await this.getAnnouncements();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return announcements.filter(announcement => {
      // Check if manually disabled
      if (announcement.isActive === false) {
        return false;
      }

      const startDate = new Date(announcement.startDate);
      const endDate = new Date(announcement.endDate);

      // Add 2 days buffer after end date
      const removalDate = new Date(endDate);
      removalDate.setDate(removalDate.getDate() + 2);

      // Check if within active date range (including 2-day buffer)
      return today >= startDate && today <= removalDate;
    }).sort((a, b) => {
      // Sort by priority: high > medium > low
      const priorityOrder: any = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}

