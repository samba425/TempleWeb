import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService, TempleContent } from '../../services/content.service';

interface ServiceItem {
  name: string;
  description: string;
  price: string;
  icon: string;
}

interface EventItem {
  name: string;
  date: string;
  description: string;
  icon: string;
  startDate?: string;
  endDate?: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface SponsorItem {
  name: string;
  role?: string;
}

interface QuickLinkItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-manage-content',
  templateUrl: './manage-content.component.html',
  styleUrls: ['./manage-content.component.scss']
})
export class ManageContentComponent implements OnInit {
  content: TempleContent | null = null;
  isLoading = false;
  isInitializing = false;
  activeTab = 0;
  
  // Modal state
  showModal = false;
  modalType: 'service' | 'event' | 'feature' | 'sponsor' | 'quicklink' | 'hero' | 'contact' | 'footer' = 'service';
  editingIndex: number = -1;
  itemForm!: FormGroup;
  isSaving = false;

  // Table data
  services: ServiceItem[] = [];
  events: EventItem[] = [];
  features: FeatureItem[] = [];
  sponsors: SponsorItem[] = [];
  quickLinks: QuickLinkItem[] = [];

  displayedColumnsServices = ['name', 'price', 'actions'];
  displayedColumnsEvents = ['name', 'date', 'actions'];
  displayedColumnsFeatures = ['title', 'actions'];
  displayedColumnsSponsors = ['name', 'role', 'actions'];
  displayedColumnsQuickLinks = ['label', 'route', 'actions'];

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private snackBar: MatSnackBar
  ) {
    this.initForm('service');
  }

  async ngOnInit() {
    await this.loadContent();
  }

  async loadContent() {
    this.isLoading = true;
    try {
      this.content = await this.contentService.getContent();
      this.services = this.content.services || [];
      this.events = this.content.events || [];
      this.features = this.content.features || [];
      this.sponsors = this.content.footer?.sponsors || [];
      this.quickLinks = this.content.footer?.quickLinks || [];
    } catch (error) {
      console.error('Error loading content:', error);
      this.snackBar.open('❌ Error loading content', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  initForm(type: 'service' | 'event' | 'feature' | 'sponsor' | 'quicklink' | 'hero' | 'contact' | 'footer') {
    this.modalType = type;
    
    switch(type) {
      case 'service':
        this.itemForm = this.fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          price: ['', Validators.required],
          icon: ['temple_hindu', Validators.required]
        });
        break;
      case 'event':
        this.itemForm = this.fb.group({
          name: ['', Validators.required],
          date: ['', Validators.required],
          description: ['', Validators.required],
          icon: ['event', Validators.required],
          startDate: [''],
          endDate: ['']
        });
        break;
      case 'feature':
        this.itemForm = this.fb.group({
          icon: ['star', Validators.required],
          title: ['', Validators.required],
          description: ['', Validators.required]
        });
        break;
      case 'sponsor':
        this.itemForm = this.fb.group({
          name: ['', Validators.required],
          role: ['']
        });
        break;
      case 'quicklink':
        this.itemForm = this.fb.group({
          label: ['', Validators.required],
          route: ['', Validators.required]
        });
        break;
      case 'hero':
        this.itemForm = this.fb.group({
          title: ['', Validators.required],
          teluguText: [''],
          subtitle: [''],
          location: ['']
        });
        break;
      case 'contact':
        this.itemForm = this.fb.group({
          templeName: ['', Validators.required],
          address: ['', Validators.required],
          phone: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          website: [''],
          morningTimings: [''],
          eveningTimings: ['']
        });
        break;
      case 'footer':
        this.itemForm = this.fb.group({
          description: ['', Validators.required],
          facebook: [''],
          twitter: [''],
          instagram: [''],
          youtube: [''],
          additionalInfo: ['']
        });
        break;
    }
  }

  openCreateModal(type: 'service' | 'event' | 'feature' | 'sponsor' | 'quicklink') {
    this.editingIndex = -1;
    this.initForm(type);
    this.showModal = true;
  }

  openEditModal(type: 'service' | 'event' | 'feature' | 'sponsor' | 'quicklink', index: number) {
    this.editingIndex = index;
    this.initForm(type);
    
    let data: any;
    if (type === 'service') data = this.services[index];
    else if (type === 'event') data = this.events[index];
    else if (type === 'feature') data = this.features[index];
    else if (type === 'sponsor') data = this.sponsors[index];
    else if (type === 'quicklink') data = this.quickLinks[index];
    
    this.itemForm.patchValue(data);
    this.showModal = true;
  }

  openHeroModal() {
    if (!this.content) return;
    this.initForm('hero');
    this.itemForm.patchValue(this.content.hero);
    this.showModal = true;
  }

  openContactModal() {
    if (!this.content) return;
    this.initForm('contact');
    this.itemForm.patchValue({
      ...this.content.contact,
      morningTimings: this.content.contact.timings?.morning || '',
      eveningTimings: this.content.contact.timings?.evening || ''
    });
    this.showModal = true;
  }

  openFooterModal() {
    if (!this.content) return;
    this.initForm('footer');
    this.itemForm.patchValue({
      description: this.content.footer?.description || '',
      facebook: this.content.footer?.socialLinks?.facebook || '',
      twitter: this.content.footer?.socialLinks?.twitter || '',
      instagram: this.content.footer?.socialLinks?.instagram || '',
      youtube: this.content.footer?.socialLinks?.youtube || '',
      additionalInfo: this.content.footer?.additionalInfo || ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingIndex = -1;
    this.itemForm.reset();
  }

  async saveItem() {
    if (this.itemForm.invalid || !this.content) {
      this.snackBar.open('⚠️ Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    try {
      const formData = this.itemForm.value;
      
      if (this.modalType === 'service') {
        if (this.editingIndex >= 0) {
          this.services[this.editingIndex] = formData;
        } else {
          this.services.push(formData);
        }
        this.content.services = [...this.services];
      } else if (this.modalType === 'event') {
        if (this.editingIndex >= 0) {
          this.events[this.editingIndex] = formData;
        } else {
          this.events.push(formData);
        }
        this.content.events = [...this.events];
      } else if (this.modalType === 'feature') {
        if (this.editingIndex >= 0) {
          this.features[this.editingIndex] = formData;
        } else {
          this.features.push(formData);
        }
        this.content.features = [...this.features];
      } else if (this.modalType === 'sponsor') {
        if (!this.content.footer) {
          this.content.footer = {
            description: '',
            socialLinks: {},
            quickLinks: [],
            sponsors: []
          };
        }
        if (!this.content.footer.sponsors) {
          this.content.footer.sponsors = [];
        }
        if (this.editingIndex >= 0) {
          this.sponsors[this.editingIndex] = formData;
        } else {
          this.sponsors.push(formData);
        }
        this.content.footer.sponsors = [...this.sponsors];
      } else if (this.modalType === 'quicklink') {
        if (!this.content.footer) {
          this.content.footer = {
            description: '',
            socialLinks: {},
            quickLinks: [],
            sponsors: []
          };
        }
        if (!this.content.footer.quickLinks) {
          this.content.footer.quickLinks = [];
        }
        if (this.editingIndex >= 0) {
          this.quickLinks[this.editingIndex] = formData;
        } else {
          this.quickLinks.push(formData);
        }
        this.content.footer.quickLinks = [...this.quickLinks];
      } else if (this.modalType === 'hero') {
        this.content.hero = {
          ...this.content.hero,
          ...formData
        };
      } else if (this.modalType === 'contact') {
        this.content.contact = {
          templeName: formData.templeName,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          timings: {
            morning: formData.morningTimings,
            evening: formData.eveningTimings
          }
        };
      } else if (this.modalType === 'footer') {
        this.content.footer = {
          description: formData.description,
          socialLinks: {
            facebook: formData.facebook,
            twitter: formData.twitter,
            instagram: formData.instagram,
            youtube: formData.youtube
          },
          quickLinks: this.content.footer?.quickLinks || [
            { label: 'About Temple', route: '/about' },
            { label: 'Services & Rituals', route: '/services' },
            { label: 'Photo Gallery', route: '/gallery' },
            { label: 'Make Donation', route: '/donations' }
          ],
          additionalInfo: formData.additionalInfo
        };
      }

      await this.contentService.saveContent(this.content);
      this.snackBar.open('✅ Saved successfully!', 'Close', { duration: 3000 });
      this.closeModal();
    } catch (error) {
      console.error('Error saving:', error);
      this.snackBar.open('❌ Error saving', 'Close', { duration: 3000 });
    } finally {
      this.isSaving = false;
    }
  }

  async deleteItem(type: 'service' | 'event' | 'feature' | 'sponsor' | 'quicklink', index: number) {
    if (!this.content) return;

    const confirmed = confirm('Delete this item?');
    if (!confirmed) return;

    try {
      if (type === 'service') {
        this.services.splice(index, 1);
        this.content.services = [...this.services];
      } else if (type === 'event') {
        this.events.splice(index, 1);
        this.content.events = [...this.events];
      } else if (type === 'feature') {
        this.features.splice(index, 1);
        this.content.features = [...this.features];
      } else if (type === 'sponsor') {
        this.sponsors.splice(index, 1);
        if (!this.content.footer) {
          this.content.footer = {
            description: '',
            socialLinks: {},
            quickLinks: [],
            sponsors: []
          };
        }
        this.content.footer.sponsors = [...this.sponsors];
      } else if (type === 'quicklink') {
        this.quickLinks.splice(index, 1);
        if (!this.content.footer) {
          this.content.footer = {
            description: '',
            socialLinks: {},
            quickLinks: [],
            sponsors: []
          };
        }
        this.content.footer.quickLinks = [...this.quickLinks];
      }

      await this.contentService.saveContent(this.content);
      this.snackBar.open('🗑️ Deleted', 'Close', { duration: 2000 });
    } catch (error) {
      console.error('Error deleting:', error);
      this.snackBar.open('❌ Error deleting', 'Close', { duration: 3000 });
    }
  }

  async initializeFirebase() {
    const confirmed = confirm('This will upload all content from the local JSON file to Firebase. Continue?');
    if (!confirmed) return;

    this.isInitializing = true;
    try {
      await this.contentService.initializeWithLocalContent();
      this.snackBar.open('✅ Firebase initialized successfully! Reloading content...', 'Close', { duration: 3000 });
      await this.loadContent();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      this.snackBar.open('❌ Error initializing Firebase', 'Close', { duration: 3000 });
    } finally {
      this.isInitializing = false;
    }
  }
}
