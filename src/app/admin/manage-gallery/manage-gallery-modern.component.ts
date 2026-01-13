import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { FirebaseService, GalleryImage } from '../../services/firebase.service';

@Component({
  selector: 'app-manage-gallery-modern',
  templateUrl: './manage-gallery-modern.component.html',
  styleUrls: ['./manage-gallery-modern.component.scss']
})
export class ManageGalleryModernComponent implements OnInit {
  uploadForm: FormGroup;
  images: GalleryImage[] = [];
  filteredImages: GalleryImage[] = [];
  paginatedImages: GalleryImage[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;
  isLoading = false;
  isDragging = false;
  
  // Pagination
  pageSize = 12;
  pageIndex = 0;
  totalImages = 0;
  
  // Search
  searchQuery = '';

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['General', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    this.isLoading = true;
    try {
      this.images = await this.firebaseService.getGalleryImages();
      this.totalImages = this.images.length;
      this.filteredImages = [...this.images];
      this.updatePagination();
    } catch (error) {
      console.error('Error loading images:', error);
      this.snackBar.open('Error loading images', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        this.snackBar.open('Image too large. Max 10MB allowed.', 'Close', { duration: 3000 });
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('Please select an image file (PNG, JPG, JPEG)', 'Close', { duration: 3000 });
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
  }

  getFileSize(): string {
    if (!this.selectedFile) return '';
    const bytes = this.selectedFile.size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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

      this.snackBar.open('✅ Image uploaded successfully!', 'Close', { duration: 3000 });
      this.uploadForm.reset({ category: 'General' });
      this.selectedFile = null;
      this.imagePreview = null;
      await this.loadImages();
    } catch (error: any) {
      console.error('Upload error:', error);
      this.snackBar.open('❌ Upload failed: ' + error.message, 'Close', { duration: 5000 });
    } finally {
      this.isUploading = false;
    }
  }

  async deleteImage(image: GalleryImage) {
    if (confirm(`Delete "${image.title}"?`)) {
      try {
        await this.firebaseService.deleteGalleryImage(image.id!, image.imageUrl);
        this.snackBar.open('🗑️ Image deleted successfully', 'Close', { duration: 3000 });
        await this.loadImages();
      } catch (error) {
        this.snackBar.open('❌ Error deleting image', 'Close', { duration: 3000 });
      }
    }
  }

  filterImages() {
    if (!this.searchQuery.trim()) {
      this.filteredImages = [...this.images];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredImages = this.images.filter(img => 
        img.title?.toLowerCase().includes(query) ||
        img.description?.toLowerCase().includes(query) ||
        img.category?.toLowerCase().includes(query)
      );
    }
    this.pageIndex = 0;
    this.updatePagination();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePagination() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedImages = this.filteredImages.slice(startIndex, endIndex);
  }

  getImageDate(uploadedAt: any): Date {
    if (!uploadedAt) return new Date();
    // Handle Firestore Timestamp objects
    if (uploadedAt.toDate && typeof uploadedAt.toDate === 'function') {
      return uploadedAt.toDate();
    }
    // Handle Date objects
    if (uploadedAt instanceof Date) {
      return uploadedAt;
    }
    // Handle string dates
    return new Date(uploadedAt);
  }
}
