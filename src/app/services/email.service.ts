import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface EmailData {
  to: string;
  subject: string;
  donorName: string;
  amount: number;
  transactionId: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendDonationReceipt(emailData: EmailData): Observable<any> {
    // This will call a Firebase Cloud Function that sends the email
    // The function will use a service like SendGrid, Nodemailer with Gmail, or AWS SES
    const functionsUrl = environment.emailService.functionsUrl;
    
    return this.http.post(`${functionsUrl}/sendDonationReceipt`, {
      to: emailData.to,
      subject: emailData.subject,
      templateData: {
        donorName: emailData.donorName,
        amount: emailData.amount,
        transactionId: emailData.transactionId,
        date: emailData.date.toLocaleDateString('en-IN'),
        templeName: 'UTTHARANDHRA SABARIMALA',
        templeAddress: 'Aditya Nagar, Pendurthi, Visakhapatnam, Andhra Pradesh 531173'
      }
    });
  }
}
