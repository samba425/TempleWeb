import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hero: any = {
    title: 'UTTHARANDHRA SABARIMALA',
    teluguText: 'ఉత్తరాంధ్ర శబరిమల (అయ్యప్ప స్వామి ఆలయం)',
    subtitle: 'Swamiye Saranam Ayyappa',
    location: 'Pendurthi, Visakhapatnam, Andhra Pradesh',
    carouselImages: [
      'assets/images/1.jpg',
      'assets/images/2.jpg',
      'assets/images/3.jpg'
    ]
  };

  features: any[] = [];
  upcomingEvents: any[] = [];
  activeAnnouncements: any[] = [];
  selectedAnnouncement: any = null;
  isLoading = true;

  constructor(
    private contentService: ContentService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.loadContent();
  }

  async loadContent() {
    this.isLoading = true;
    try {
      const data = await this.contentService.getContent();
      
      if (data.hero) {
        this.hero = data.hero;
      }
      if (data.features) {
        this.features = data.features;
      }
      if (data.events) {
        this.upcomingEvents = this.filterActiveEvents(data.events);
      }
      
      // Fetch announcements from Firebase directly
      try {
        this.activeAnnouncements = await this.firebaseService.getActiveAnnouncements();
      } catch (error) {
        console.error('Error loading announcements:', error);
        this.activeAnnouncements = [];
      }
    } catch (error) {
      console.error('Error loading content:', error);
      // Fallback data already set in component properties
      this.features = [
        {
          icon: 'self_improvement',
          title: 'Daily Poojas',
          description: 'Experience divine blessings through our daily prayer rituals'
        },
        {
          icon: 'event',
          title: 'Makaravilakku Festival',
          description: 'Join us for the sacred Makar Jyothi darshan'
        },
        {
          icon: 'volunteer_activism',
          title: 'Mala Dharana',
          description: 'Sacred 41-day vratham services available'
        },
        {
          icon: 'celebration',
          title: 'Navaratri Celebrations',
          description: 'Grand Durga Devi Navaratri Mahotsavam'
        }
      ];
      
      this.upcomingEvents = [
        {
          name: 'Makar Jyothi Darshan',
          date: '14 Jan',
          description: 'Special darshan',
          icon: 'event'
        }
      ];
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Filter events to show only active ones (within date range)
   * Auto-remove events 2 days after endDate
   */
  filterActiveEvents(events: any[]): any[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      // If no date range specified, show the event
      if (!event.startDate && !event.endDate) {
        return true;
      }
      
      const startDate = event.startDate ? new Date(event.startDate) : null;
      const endDate = event.endDate ? new Date(event.endDate) : null;
      
      // Add 2 days buffer after end date
      if (endDate) {
        const removalDate = new Date(endDate);
        removalDate.setDate(removalDate.getDate() + 2);
        
        // If past removal date, don't show
        if (today > removalDate) {
          return false;
        }
      }
      
      // Check if event has started
      if (startDate && today < startDate) {
        return false;
      }
      
      return true;
    });
  }

  openAnnouncementModal(announcement: any) {
    this.selectedAnnouncement = announcement;
  }

  closeAnnouncementModal() {
    this.selectedAnnouncement = null;
  }

  galleryImages = [
    'assets/images/1.jpg',
    'assets/images/2.jpg',
    'assets/images/3.jpg',
    'assets/images/4.jpg',
    'assets/images/5.jpg'
  ];
}
