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

export interface TempleContent {
  id?: string;
  section: string;
  title: string;
  content: string;
  imageUrl?: string;
  updatedAt: Date;
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

  // Content Management
  async getContent(): Promise<TempleContent[]> {
    const contentRef = collection(this.firestore, 'content');
    const q = query(contentRef, orderBy('section'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
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
