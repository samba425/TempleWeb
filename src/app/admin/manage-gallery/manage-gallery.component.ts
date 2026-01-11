import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService, GalleryImage } from '../../services/firebase.service';

@Component({
  selector: 'app-manage-gallery',
  template: `
    <div class="manage-gallery">
      <mat-card class="upload-card">
        <h2>Upload New Image</h2>
        <form [formGroup]="uploadForm" (ngSubmit)="uploadImage()">
          <input type="file" accept="image/*" (change)="onFileSelected($event)" #fileInput hidden>
          <button mat-raised-button type="button" (click)="fileInput.click()">
            <mat-icon>cloud_upload</mat-icon>
            Select Image
          </button>
          <p *ngIf="selectedFile">{{ selectedFile.name }}</p>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <input matInput formControlName="category">
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="!selectedFile || uploadForm.invalid || isUploading">
            {{ isUploading ? 'Uploading...' : 'Upload' }}
          </button>
        </form>
      </mat-card>

      <div class="gallery-grid">
        <mat-card *ngFor="let image of images" class="gallery-item">
          <img [src]="image.imageUrl" [alt]="image.title">
          <h3>{{ image.title }}</h3>
          <p>{{ image.description }}</p>
          <button mat-raised-button color="warn" (click)="deleteImage(image)">
            <mat-icon>delete</mat-icon> Delete
          </button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .manage-gallery { display: grid; gap: 2rem; }
    .upload-card { padding: 2rem; }
    h2 { margin: 0 0 1.5rem 0; }
    .full-width { width: 100%; }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .gallery-item {
      padding: 1rem;
      text-align: center;
      img { width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 1rem; }
      h3 { margin: 0.5rem 0; font-size: 1.1rem; }
      p { color: #666; margin-bottom: 1rem; }
    }
  `]
})
export class ManageGalleryComponent implements OnInit {
  uploadForm: FormGroup;
  images: GalleryImage[] = [];
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['General', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    this.images = await this.firebaseService.getGalleryImages();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadImage() {
    if (!this.selectedFile || this.uploadForm.invalid) return;

    this.isUploading = true;
    try {
      const path = `gallery/${Date.now()}_${this.selectedFile.name}`;
      const imageUrl = await this.firebaseService.uploadImage(this.selectedFile, path);
      
      await this.firebaseService.addGalleryImage({
        ...this.uploadForm.value,
        imageUrl,
        uploadedAt: new Date()
      });

      this.snackBar.open('Image uploaded successfully', 'Close', { duration: 3000 });
      this.uploadForm.reset({ category: 'General' });
      this.selectedFile = null;
      await this.loadImages();
    } catch (error) {
      this.snackBar.open('Error uploading image', 'Close', { duration: 3000 });
    } finally {
      this.isUploading = false;
    }
  }

  async deleteImage(image: GalleryImage) {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await this.firebaseService.deleteGalleryImage(image.id!, image.imageUrl);
        this.snackBar.open('Image deleted successfully', 'Close', { duration: 3000 });
        await this.loadImages();
      } catch (error) {
        this.snackBar.open('Error deleting image', 'Close', { duration: 3000 });
      }
    }
  }
}
