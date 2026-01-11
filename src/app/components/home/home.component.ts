import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      'assets/images/480614142_1340522376959783_2104656479553551940_n.jpg',
      'assets/images/486472084_1196186785851212_8874622736568729395_n.jpg',
      'assets/images/474645972_1102912134661594_7088183194580120380_n.jpg'
    ]
  };

  features: any[] = [];
  upcomingEvents: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    this.http.get<any>('assets/data/temple-content.json').subscribe({
      next: (data) => {
        if (data.hero) {
          this.hero = data.hero;
        }
        if (data.features) {
          this.features = data.features;
        }
        if (data.events) {
          this.upcomingEvents = data.events;
        }
      },
      error: (error) => {
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
      }
    });
  }

  galleryImages = [
    'assets/images/43178806_2226317190966115_7484369083266236416_n.jpg',
    'assets/images/474645972_1102912134661594_7088183194580120380_n.jpg',
    'assets/images/480614142_1340522376959783_2104656479553551940_n.jpg',
    'assets/images/480973372_1170906191712605_3515341891943046139_n (1).jpg',
    'assets/images/486472084_1196186785851212_8874622736568729395_n.jpg'
  ];
}
