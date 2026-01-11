import { Component } from '@angular/core';

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
              <h3>{{ service.title }}</h3>
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
export class ServicesComponent {
  services = [
    { icon: 'self_improvement', title: 'Daily Pooja', description: 'Regular worship services morning and evening', price: 'Free' },
    { icon: 'auto_awesome', title: 'Abhishekam', description: 'Special ritual bathing of the deity', price: '₹500' },
    { icon: 'celebration', title: 'Archana', description: 'Personalized prayer offerings', price: '₹100' },
    { icon: 'restaurant', title: 'Annadanam', description: 'Free meals for devotees', price: 'Sponsored' },
    { icon: 'local_florist', title: 'Seva', description: 'Special service offerings', price: '₹1000+' },
    { icon: 'campaign', title: 'Homam', description: 'Fire ritual ceremonies', price: '₹2000+' }
  ];
}
