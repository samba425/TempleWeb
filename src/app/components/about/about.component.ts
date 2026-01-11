import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="about">
      <section class="page-hero">
        <div class="hero-content">
          <h1>About Lord Ayyappa</h1>
          <p class="subtitle">Swamiye Saranam Ayyappa</p>
        </div>
      </section>
      
      <section class="section-padding">
        <div class="container">
          <div class="intro-section">
            <div class="intro-icon">🕉️</div>
            <h2>Lord Ayyappa - Dharma Sastha</h2>
            <p class="lead-text">Lord Ayyappa, also known as Dharma Sastha, is a revered Hindu deity worshipped predominantly in South India. He is believed to be the divine son of Harihara - a union of Lord Shiva and Lord Vishnu in the form of Mohini.</p>
          </div>

          <div class="content-grid">
            <mat-card class="info-card">
              <div class="card-icon">⛰️</div>
              <h3>Sabarimala Pilgrimage</h3>
              <p>The temple at Sabarimala, nestled in the Western Ghats of Kerala, is one of the most sacred pilgrimage sites in India. Every year, millions of devotees from across the world undertake this sacred journey.</p>
            </mat-card>

            <mat-card class="info-card">
              <div class="card-icon">🙏</div>
              <h3>41-Day Vratham</h3>
              <p>Devotees observe a strict 41-day penance period (vratham) before the pilgrimage, practicing celibacy, abstaining from worldly pleasures, and following a sattvic lifestyle while wearing the sacred mala.</p>
            </mat-card>

            <mat-card class="info-card">
              <div class="card-icon">🕉️</div>
              <h3>Divine Unity</h3>
              <p>As the son of Harihara, Lord Ayyappa represents the unity of Shaivism and Vaishnavism, symbolizing the harmony of different Hindu traditions and the universal truth.</p>
            </mat-card>

            <mat-card class="info-card">
              <div class="card-icon">🪔</div>
              <h3>Makaravilakku</h3>
              <p>The Makaravilakku festival, celebrated on Makar Sankranti (January 14), is the most auspicious time when devotees witness the divine light appearing on the horizon - a celestial blessing.</p>
            </mat-card>
          </div>

          <mat-card class="temple-info-card">
            <h2>Uttharandhra Sabarimala</h2>
            <p><strong>Our temple</strong> serves as a spiritual haven for devotees in North Andhra Pradesh and surrounding regions. We provide a sacred space for worship, spiritual growth, and community service, following the traditions and rituals of the holy Sabarimala temple.</p>
            
            <div class="temple-features">
              <div class="feature-item">
                <mat-icon>self_improvement</mat-icon>
                <span>Daily Poojas & Rituals</span>
              </div>
              <div class="feature-item">
                <mat-icon>people</mat-icon>
                <span>Community Service</span>
              </div>
              <div class="feature-item">
                <mat-icon>restaurant</mat-icon>
                <span>Annadanam (Free Meals)</span>
              </div>
              <div class="feature-item">
                <mat-icon>school</mat-icon>
                <span>Spiritual Education</span>
              </div>
            </div>

            <div class="temple-location">
              <h3>Visit Us</h3>
              <p><mat-icon>location_on</mat-icon> Aditya Nagar, Pendurthi, Visakhapatnam, Andhra Pradesh 531173</p>
              <p><mat-icon>phone</mat-icon> +91 94907 08933</p>
              <p><mat-icon>schedule</mat-icon> Opens 5:00 PM Daily</p>
            </div>
          </mat-card>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {}
