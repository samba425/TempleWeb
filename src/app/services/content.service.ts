import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TempleContent {
  hero: {
    title: string;
    teluguText: string;
    subtitle: string;
    location: string;
    carouselImages: string[];
  };
  about: {
    title: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
  };
  services: Array<{
    name: string;
    description: string;
    price: string;
    icon: string;
  }>;
  gallery?: Array<{
    url: string;
    title: string;
    description: string;
  }>;
  contact: {
    templeName: string;
    address: string;
    phone: string;
    email: string;
    timings: {
      morning: string;
      evening: string;
    };
    website?: string;
  };
  footer?: {
    description: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
    };
    quickLinks: Array<{
      label: string;
      route: string;
    }>;
    additionalInfo?: string;
    sponsors?: Array<{
      name: string;
      role?: string;
    }>;
  };
  events: Array<{
    name: string;
    date: string;
    description: string;
    icon: string;
    startDate?: string;
    endDate?: string;
  }>;
  announcements?: Array<{
    id?: string;
    title: string;
    message: string;
    startDate: string;
    endDate: string;
    priority: 'high' | 'medium' | 'low';
    isActive?: boolean;
  }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private contentDocRef = doc(this.firestore, 'siteContent/templeContent');
  private fallbackContentPath = 'assets/data/temple-content.json';

  constructor(
    private firestore: Firestore,
    private http: HttpClient
  ) {}

  /**
   * Get temple content with Firebase as primary source and local JSON as fallback
   */
  async getContent(): Promise<TempleContent> {
    try {
      // Try to get from Firebase first
      const docSnap = await getDoc(this.contentDocRef);
      
      if (docSnap.exists()) {
        console.log('Content loaded from Firebase');
        return docSnap.data() as TempleContent;
      } else {
        console.log('No Firebase content found, loading from local file');
        return await this.getFallbackContent();
      }
    } catch (error) {
      console.error('Error fetching from Firebase, using fallback:', error);
      return await this.getFallbackContent();
    }
  }

  /**
   * Get content from local JSON file (fallback)
   */
  private async getFallbackContent(): Promise<TempleContent> {
    try {
      const content = await firstValueFrom(
        this.http.get<TempleContent>(this.fallbackContentPath)
      );
      console.log('Fallback content loaded from:', this.fallbackContentPath);
      return content;
    } catch (error) {
      console.error('Error loading fallback content:', error);
      // Return default empty structure if all fails
      return this.getDefaultContent();
    }
  }

  /**
   * Save content to Firebase
   */
  async saveContent(content: TempleContent): Promise<void> {
    try {
      await setDoc(this.contentDocRef, content);
      console.log('Content saved to Firebase successfully');
    } catch (error) {
      console.error('Error saving content to Firebase:', error);
      throw error;
    }
  }

  /**
   * Default empty content structure
   */
  private getDefaultContent(): TempleContent {
    return {
      hero: {
        title: 'UTTHARANDHRA SABARIMALA',
        teluguText: 'ఉత్తరాంధ్ర శబరిమల',
        subtitle: 'Swamiye Saranam Ayyappa',
        location: 'Pendurthi, Visakhapatnam',
        carouselImages: []
      },
      about: {
        title: 'About Temple',
        sections: []
      },
      services: [],
      contact: {
        templeName: 'UTTHARANDHRA SABARIMALA',
        address: 'Aditya Nagar, Pendurthi, Visakhapatnam, Andhra Pradesh 531173',
        phone: '+91 99999 99999',
        email: 'info@ayyappasevatrust.org',
        website: 'ayyappasevatrust.org',
        timings: {
          morning: '5:00 AM - 12:00 PM',
          evening: '5:00 PM - 9:00 PM'
        }
      },
      footer: {
        description: 'Dedicated to Lord Ayyappa, spreading divine blessings and spiritual enlightenment in Visakhapatnam.',
        socialLinks: {
          facebook: 'https://facebook.com/uttharandhratemple',
          twitter: 'https://twitter.com/uttharandhratemple',
          instagram: 'https://instagram.com/uttharandhratemple',
          youtube: 'https://youtube.com/@uttharandhratemple'
        },
        quickLinks: [
          { label: 'About Temple', route: '/about' },
          { label: 'Services & Rituals', route: '/services' },
          { label: 'Photo Gallery', route: '/gallery' },
          { label: 'Make Donation', route: '/donations' }
        ],
        additionalInfo: 'Special Poojas on Saturdays | Mandala Season: Nov - Jan'
      },
      events: [],
      announcements: [],
      features: []
    };
  }

  /**
   * Initialize Firebase with local content (run once)
   */
  async initializeWithLocalContent(): Promise<void> {
    const fallbackContent = await this.getFallbackContent();
    await this.saveContent(fallbackContent);
    console.log('Firebase initialized with local content');
  }
}
