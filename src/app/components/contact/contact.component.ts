import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;

  templeInfo = {
    name: 'UTTHARANDHRA SABARIMALA',
    teluguName: 'ఉత్తరాంధ్ర శబరిమల (అయ్యప్ప స్వామి ఆలయం)',
    address: 'Aditya Nagar, Pendurthi, Visakhapatnam, Andhra Pradesh 531173',
    phone: '99999 99999',
    email: 'info@ayyappaswami.org',
    website: 'ayyappasevatrust.org',
    coordinates: 'R6H8+3Q Visakhapatnam, Andhra Pradesh',
    rating: '4.7 ⭐ (361 Reviews)',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3798.259380127987!2d83.21471877517511!3d17.826471683137513!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39672e4402347b%3A0x4b2fdb2ba4c36b30!2sUTTHARANDHRA%20SABARIMALA%20(Ayyappa%20Swamy%20Temple%20)!5e0!3m2!1sen!2sin!4v1768118103865!5m2!1sen!2sin'
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      // In production, send this to Firebase or email service
      console.log('Contact form:', this.contactForm.value);
      this.snackBar.open('Thank you for contacting us! We will get back to you soon.', 'Close', {
        duration: 5000
      });
      this.contactForm.reset();
    }
  }
}
