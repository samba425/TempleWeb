import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  templeInfo = {
    name: 'UTTHARANDHRA SABARIMALA',
    teluguName: 'ఉత్తరాంధ్ర శబరిమల (అయ్యప్ప స్వామి ఆలయం)',
    address: 'Aditya Nagar, Pendurthi, Visakhapatnam, Andhra Pradesh 531173',
    phone: '+91 94907 08933',
    website: 'ayyappasevatrust.org',
    rating: '4.7 (361 reviews)',
    hours: 'Opens 5 PM',
    mapLocation: 'R6H8+3Q Visakhapatnam, Andhra Pradesh'
  };

  features = [
    {
      icon: 'self_improvement',
      title: 'Daily Poojas',
      description: 'Experience divine blessings through our daily prayer rituals and special ceremonies'
    },
    {
      icon: 'event',
      title: 'Makaravilakku Festival',
      description: 'Join us for the sacred Makar Jyothi darshan on 14th January'
    },
    {
      icon: 'volunteer_activism',
      title: 'Mala Dharana',
      description: 'Sacred 41-day vratham and Irumudi samarpan services available from October'
    },
    {
      icon: 'celebration',
      title: 'Navaratri Celebrations',
      description: 'Grand Durga Devi Navaratri Mahotsavam celebrated at the temple'
    }
  ];

  upcomingEvents = [
    {
      date: '14 Jan',
      title: 'Makar Jyothi Darshan',
      time: '12:00 AM - 11:59 PM'
    },
    {
      date: 'Oct - Jan',
      title: 'Mala Dharana Season',
      time: 'Daily 5:00 PM onwards'
    },
    {
      date: 'Sundays',
      title: 'Special Abhishekam',
      time: '6:00 AM'
    }
  ];

  galleryImages = [
    'assets/images/43178806_2226317190966115_7484369083266236416_n.jpg',
    'assets/images/474645972_1102912134661594_7088183194580120380_n.jpg',
    'assets/images/480614142_1340522376959783_2104656479553551940_n.jpg',
    'assets/images/480973372_1170906191712605_3515341891943046139_n (1).jpg',
    'assets/images/486472084_1196186785851212_8874622736568729395_n.jpg'
  ];

  ngOnInit(): void {
    // Initialize component
  }
}
