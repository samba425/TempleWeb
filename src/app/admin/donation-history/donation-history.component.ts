import { Component, OnInit } from '@angular/core';
import { FirebaseService, Donation } from '../../services/firebase.service';

@Component({
  selector: 'app-donation-history',
  template: `
    <mat-card>
      <h2>All Donations</h2>
      <table mat-table [dataSource]="donations" class="full-width">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let donation">{{ donation.createdAt | date:'short' }}</td>
        </ng-container>
        <ng-container matColumnDef="donorName">
          <th mat-header-cell *matHeaderCellDef>Donor Name</th>
          <td mat-cell *matCellDef="let donation">{{ donation.donorName }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let donation">{{ donation.email }}</td>
        </ng-container>
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let donation">₹{{ donation.amount }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let donation">
            <span [class]="'status-' + donation.status">{{ donation.status }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="emailSent">
          <th mat-header-cell *matHeaderCellDef>Email Sent</th>
          <td mat-cell *matCellDef="let donation">
            <mat-icon [color]="donation.emailSent ? 'primary' : 'warn'">
              {{ donation.emailSent ? 'check_circle' : 'cancel' }}
            </mat-icon>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </mat-card>
  `,
  styles: [`
    mat-card { padding: 2rem; }
    h2 { margin: 0 0 1.5rem 0; }
    .full-width { width: 100%; }
    .status-success { color: #4caf50; font-weight: 600; }
    .status-pending { color: #ff9800; font-weight: 600; }
    .status-failed { color: #f44336; font-weight: 600; }
  `]
})
export class DonationHistoryComponent implements OnInit {
  donations: Donation[] = [];
  displayedColumns = ['date', 'donorName', 'email', 'amount', 'status', 'emailSent'];

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.donations = await this.firebaseService.getDonations();
  }
}
