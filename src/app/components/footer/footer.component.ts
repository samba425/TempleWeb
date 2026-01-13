import { Component, OnInit } from '@angular/core';
import { ContentService, TempleContent } from '../../services/content.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  content: TempleContent | null = null;
  isLoading = true;

  // Fallback quick links if API fails
  defaultQuickLinks = [
    { label: 'About Temple', route: '/about' },
    { label: 'Services & Rituals', route: '/services' },
    { label: 'Photo Gallery', route: '/gallery' },
    { label: 'Make Donation', route: '/donations' }
  ];

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadContent();
  }

  private async loadContent() {
    try {
      this.content = await this.contentService.getContent();
    } catch (error) {
      console.error('Error loading footer content:', error);
      // Fallback content is already in component template
    } finally {
      this.isLoading = false;
    }
  }

  hasSponsors(): boolean {
    return !!(this.content?.footer?.sponsors && this.content.footer.sponsors.length > 0);
  }
}
