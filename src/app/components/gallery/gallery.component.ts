import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseService, GalleryImage } from '../../services/firebase.service';

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
  
  // Preview modal state
  showPreview = false;
  currentImageIndex = 0;
  currentImage = '';

  constructor(
    private firebaseService: FirebaseService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    // Load from JSON first (fallback)
    this.loadFromJSON();
    
    // Try to load Firebase images in background
    try {
      this.images = await this.firebaseService.getGalleryImages();
    } catch (error) {
      console.error('Firebase not available, using JSON fallback:', error);
    }
  }
  
  private loadFromJSON() {
    this.http.get<any>('assets/data/temple-content.json').subscribe({
      next: (data) => {
        if (data.gallery && Array.isArray(data.gallery)) {
          this.localImages = data.gallery.map((item: GalleryData) => item.url);
        } else {
          this.localImages = this.getDefaultImages();
        }
      },
      error: (err) => {
        console.error('Error loading gallery from JSON:', err);
        this.localImages = this.getDefaultImages();
      }
    });
  }
  
  private getDefaultImages(): string[] {
    return [
      'assets/images/480614142_1340522376959783_2104656479553551940_n.jpg',
      'assets/images/486472084_1196186785851212_8874622736568729395_n.jpg',
      'assets/images/474645972_1102912134661594_7088183194580120380_n.jpg',
      'assets/images/480973372_1170906191712605_3515341891943046139_n (1).jpg',
      'assets/images/43178806_2226317190966115_7484369083266236416_n.jpg'
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
    this.currentImageIndex = (this.currentImageIndex + 1) % this.localImages.length;
    this.currentImage = this.localImages[this.currentImageIndex];
  }

  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.localImages.length) % this.localImages.length;
    this.currentImage = this.localImages[this.currentImageIndex];
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
