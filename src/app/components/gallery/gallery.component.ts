import { Component, OnInit } from '@angular/core';
import { FirebaseService, GalleryImage } from '../../services/firebase.service';
import { ContentService } from '../../services/content.service';

interface GalleryData {
  url: string;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images: GalleryImage[] = [];
  localImages: string[] = [];
  isLoading = false;
  
  // Pagination
  currentPage = 0;
  imagesPerPage = 20;
  displayedImages: any[] = [];
  hasMore = true;
  
  // Filtering
  selectedCategory = 'all';
  categories = ['all', 'festivals', 'daily-pooja', 'special-events', 'temple'];
  
  // Preview modal state
  showPreview = false;
  currentImageIndex = 0;
  currentImage = '';

  constructor(
    private firebaseService: FirebaseService,
    private contentService: ContentService
  ) {}

  async ngOnInit() {
    // Load from ContentService (Firebase first, then JSON fallback)
    this.loadFromContentService();
    
    // Try to load Firebase gallery images in background
    try {
      this.images = await this.firebaseService.getGalleryImages();
      // Merge both local and Firebase images
      this.loadMoreImages();
    } catch (error) {
      console.error('Firebase not available, using JSON fallback:', error);
      this.loadMoreImages(); // Load from local images only
    }
  }
  
  loadMoreImages() {
    this.isLoading = true;
    
    // Combine Firebase images and local images
    const firebaseImages = this.images.map(img => ({
      imageUrl: img.imageUrl,
      title: img.title,
      category: img.category,
      isFirebase: true
    }));
    
    const localImagesFormatted = this.localImages.map(url => ({
      imageUrl: url,
      title: 'Temple Image',
      category: 'temple',
      isFirebase: false
    }));
    
    // Merge: Firebase images first, then local images
    const allImages = [...firebaseImages, ...localImagesFormatted];
    
    const start = this.currentPage * this.imagesPerPage;
    const end = start + this.imagesPerPage;
    const newImages = allImages.slice(start, end);
    
    this.displayedImages = [...this.displayedImages, ...newImages];
    this.currentPage++;
    this.hasMore = end < allImages.length;
    this.isLoading = false;
  }
  
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 0;
    this.displayedImages = [];
    
    // Combine Firebase and local images
    const firebaseImages = this.images.map(img => ({
      imageUrl: img.imageUrl,
      title: img.title,
      category: img.category,
      isFirebase: true
    }));
    
    const localImagesFormatted = this.localImages.map(url => ({
      imageUrl: url,
      title: 'Temple Image',
      category: 'temple',
      isFirebase: false
    }));
    
    const allImages = [...firebaseImages, ...localImagesFormatted];
    
    let imagesToDisplay;
    
    if (category === 'all') {
      imagesToDisplay = allImages;
    } else {
      // Filter by category
      imagesToDisplay = allImages.filter(img => img.category?.toLowerCase() === category.toLowerCase());
    }
    
    const end = Math.min(this.imagesPerPage, imagesToDisplay.length);
    this.displayedImages = imagesToDisplay.slice(0, end);
    this.hasMore = imagesToDisplay.length > this.imagesPerPage;
  }
  
  private async loadFromContentService() {
    try {
      const data = await this.contentService.getContent();
      if (data.gallery && Array.isArray(data.gallery)) {
        this.localImages = data.gallery.map((item: GalleryData) => item.url);
      } else {
        this.localImages = this.getDefaultImages();
      }
    } catch (error) {
      console.error('Error loading gallery from ContentService:', error);
      this.localImages = this.getDefaultImages();
    }
  }
  
  private loadFromJSON() {
    // This method is now replaced by loadFromContentService
    // Keeping for backward compatibility if needed
    this.loadFromContentService();
  }
  
  private getDefaultImages(): string[] {
    return [
      'assets/images/1.jpg',
      'assets/images/2.jpg',
      'assets/images/3.jpg',
      'assets/images/4.jpg',
      'assets/images/5.jpg'
    ];
  }

  openPreview(imagePath: string, index: number) {
    this.currentImage = imagePath;
    this.currentImageIndex = index;
    this.showPreview = true;
    document.body.style.overflow = 'hidden';
  }

  closePreview() {
    this.showPreview = false;
    document.body.style.overflow = 'auto';
  }

  nextImage() {
    const allImages = this.getAllImageUrls();
    this.currentImageIndex = (this.currentImageIndex + 1) % allImages.length;
    this.currentImage = allImages[this.currentImageIndex];
  }

  previousImage() {
    const allImages = this.getAllImageUrls();
    this.currentImageIndex = (this.currentImageIndex - 1 + allImages.length) % allImages.length;
    this.currentImage = allImages[this.currentImageIndex];
  }

  private getAllImageUrls(): string[] {
    // Combine both Firebase and local images for navigation
    const firebaseUrls = this.images.map(img => img.imageUrl);
    return [...firebaseUrls, ...this.localImages];
  }

  handleKeyPress(event: KeyboardEvent) {
    if (!this.showPreview) return;
    
    if (event.key === 'Escape') {
      this.closePreview();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      this.previousImage();
    }
  }
}
