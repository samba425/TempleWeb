import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService, Donation } from '../../services/firebase.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeView = 'overview';
  recentDonations: Donation[] = [];
  totalDonations = 0;
  monthlyDonations = 0;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      const donations = await this.firebaseService.getDonations();
      this.recentDonations = donations.slice(0, 5);
      
      // Calculate totals
      this.totalDonations = donations
        .filter(d => d.status === 'success')
        .reduce((sum, d) => sum + d.amount, 0);

      // Calculate monthly
      const thisMonth = new Date().getMonth();
      this.monthlyDonations = donations
        .filter(d => d.status === 'success' && d.createdAt.getMonth() === thisMonth)
        .reduce((sum, d) => sum + d.amount, 0);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  setActiveView(view: string) {
    this.activeView = view;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
