import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RazorpayService } from '../../services/razorpay.service';
import { FirebaseService } from '../../services/firebase.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {
  donationForm!: FormGroup;
  isProcessing = false;
  predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  constructor(
    private fb: FormBuilder,
    private razorpayService: RazorpayService,
    private firebaseService: FirebaseService,
    private emailService: EmailService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.donationForm = this.fb.group({
      donorName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      amount: [1000, [Validators.required, Validators.min(100)]],
      message: ['']
    });
  }

  selectAmount(amount: number): void {
    this.donationForm.patchValue({ amount });
  }

  async processDonation(): Promise<void> {
    if (this.donationForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000
      });
      return;
    }

    this.isProcessing = true;
    const formValue = this.donationForm.value;

    try {
      // Create Razorpay order
      const orderData = await this.razorpayService.createOrder(
        formValue.amount,
        formValue.donorName,
        formValue.email,
        formValue.phone
      );

      // Save donation to Firebase
      const donationId = await this.firebaseService.createDonation({
        donorName: formValue.donorName,
        email: formValue.email,
        phone: formValue.phone,
        amount: formValue.amount,
        razorpayOrderId: orderData.orderId,
        status: 'pending',
        message: formValue.message,
        createdAt: new Date(),
        emailSent: false
      });

      // Open Razorpay checkout
      await this.razorpayService.openCheckout(
        formValue.amount,
        orderData.orderId,
        formValue.donorName,
        formValue.email,
        formValue.phone,
        (response: any) => this.handlePaymentSuccess(response, donationId),
        () => this.handlePaymentDismiss(donationId)
      );

    } catch (error) {
      console.error('Error processing donation:', error);
      this.snackBar.open('Error processing donation. Please try again.', 'Close', {
        duration: 5000
      });
    } finally {
      this.isProcessing = false;
    }
  }

  private async handlePaymentSuccess(response: any, donationId: string): Promise<void> {
    try {
      // Update donation status
      await this.firebaseService.updateDonation(donationId, {
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        status: 'success'
      });

      // Send email receipt
      const donation = await this.firebaseService.getDonationById(donationId);
      if (donation) {
        this.emailService.sendDonationReceipt({
          to: donation.email,
          subject: 'Donation Receipt - UTTHARANDHRA SABARIMALA',
          donorName: donation.donorName,
          amount: donation.amount,
          transactionId: response.razorpay_payment_id,
          date: new Date()
        }).subscribe({
          next: () => {
            this.firebaseService.updateDonation(donationId, { emailSent: true });
          },
          error: (error) => console.error('Error sending email:', error)
        });
      }

      this.snackBar.open('Donation successful! Thank you for your contribution.', 'Close', {
        duration: 5000
      });

      this.donationForm.reset({ amount: 1000 });

    } catch (error) {
      console.error('Error updating donation:', error);
    }
  }

  private async handlePaymentDismiss(donationId: string): Promise<void> {
    await this.firebaseService.updateDonation(donationId, {
      status: 'failed'
    });
    
    this.snackBar.open('Payment cancelled', 'Close', {
      duration: 3000
    });
  }
}
