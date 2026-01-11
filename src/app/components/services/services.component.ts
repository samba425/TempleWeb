import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Service {
  name: string;
  description: string;
  price: string;
  icon: string;
}

@Component({
  selector: 'app-services',
  template: `
    <div class="services">
      <section class="page-hero">
        <h1>Temple Services & Rituals</h1>
      </section>
      <section class="section-padding">
        <div class="container">
          <div class="services-grid">
            <mat-card *ngFor="let service of services">
              <mat-icon>{{ service.icon }}</mat-icon>
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <p class="price">{{ service.price }}</p>
            </mat-card>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadServices();
  }
  
  private loadServices() {
    this.http.get<any>('assets/data/temple-content.json').subscribe({
      next: (data) => {
        this.services = data.services || this.getDefaultServices();
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.services = this.getDefaultServices();
      }
    });
  }
  
  private getDefaultServices(): Service[] {
    return [
      { icon: 'self_improvement', name: 'Daily Pooja', description: 'Regular worship services', price: 'Free' },
      { icon: 'water_drop', name: 'Abhishekam', description: 'Special ritual bathing of deity', price: '₹500' },
      { icon: 'local_florist', name: 'Archana', description: 'Offering of flowers and chanting', price: '₹100' },
      { icon: 'restaurant', name: 'Annadanam', description: 'Free meal distribution', price: 'Sponsored' },
      { icon: 'volunteer_activism', name: 'Seva', description: 'Special service offerings', price: '₹1000+' },
      { icon: 'local_fire_department', name: 'Homam', description: 'Sacred fire ritual', price: '₹2000+' }
    ];
  }
}
