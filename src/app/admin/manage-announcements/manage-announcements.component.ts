import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService, Announcement } from '../../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-announcements',
  templateUrl: './manage-announcements.component.html',
  styleUrls: ['./manage-announcements.component.scss']
})
export class ManageAnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  displayedColumns: string[] = ['title', 'dates', 'status', 'actions'];
  isLoading = false;
  
  // Modal state
  showModal = false;
  editingAnnouncement: Announcement | null = null;
  announcementForm!: FormGroup;
  isSaving = false;

  constructor(
    private firebaseService: FirebaseService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadAnnouncements();
  }

  initForm() {
    this.announcementForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      message: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isActive: [true],
      imageUrl: ['']
    });
  }

  async loadAnnouncements() {
    this.isLoading = true;
    try {
      this.announcements = await this.firebaseService.getAnnouncements();
      this.announcements.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } catch (error) {
      console.error('Error loading announcements:', error);
      this.snackBar.open('❌ Error loading announcements', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  openCreateModal() {
    this.editingAnnouncement = null;
    this.announcementForm.reset({ isActive: true });
    this.showModal = true;
  }

  openEditModal(announcement: Announcement) {
    this.editingAnnouncement = announcement;
    this.announcementForm.patchValue(announcement);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingAnnouncement = null;
    this.announcementForm.reset();
  }

  async saveAnnouncement() {
    if (this.announcementForm.invalid) {
      this.snackBar.open('⚠️ Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    try {
      const formData = this.announcementForm.value;

      if (formData.id) {
        await this.firebaseService.updateAnnouncement(formData.id, formData);
        this.snackBar.open('✅ Updated successfully!', 'Close', { duration: 3000 });
      } else {
        await this.firebaseService.createAnnouncement(formData);
        this.snackBar.open('✅ Created successfully!', 'Close', { duration: 3000 });
      }

      await this.loadAnnouncements();
      this.closeModal();
    } catch (error) {
      console.error('Error saving announcement:', error);
      this.snackBar.open('❌ Error saving', 'Close', { duration: 3000 });
    } finally {
      this.isSaving = false;
    }
  }

  async deleteAnnouncement(announcement: Announcement) {
    if (!announcement.id) return;

    const confirmed = confirm(`Delete "${announcement.title}"?`);
    if (!confirmed) return;

    try {
      await this.firebaseService.deleteAnnouncement(announcement.id);
      this.snackBar.open('🗑️ Deleted', 'Close', { duration: 2000 });
      await this.loadAnnouncements();
    } catch (error) {
      console.error('Error deleting:', error);
      this.snackBar.open('❌ Error deleting', 'Close', { duration: 3000 });
    }
  }

  async toggleActive(announcement: Announcement) {
    if (!announcement.id) return;

    try {
      const newActiveState = !announcement.isActive;
      const updatedData = { ...announcement, isActive: newActiveState };
      
      await this.firebaseService.updateAnnouncement(announcement.id, updatedData);
      
      // Update local state
      announcement.isActive = newActiveState;
      
      // Force change detection by creating new array reference
      this.announcements = [...this.announcements];
      
      this.snackBar.open(
        newActiveState ? '✅ Activated' : '⏸️ Deactivated', 
        'Close', 
        { duration: 2000 }
      );
    } catch (error) {
      console.error('Error toggling:', error);
      this.snackBar.open('❌ Error', 'Close', { duration: 3000 });
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('❌ Please select an image file', 'Close', { duration: 3000 });
      return;
    }

    try {
      const base64 = await this.compressAndConvertToBase64(file);
      const base64Size = (base64.length * 3) / 4;
      
      if (base64Size > 100 * 1024) {
        this.snackBar.open('❌ Image too large (max 100KB)', 'Close', { duration: 4000 });
        return;
      }

      this.announcementForm.patchValue({ imageUrl: base64 });
      this.snackBar.open('✅ Image uploaded', 'Close', { duration: 2000 });
    } catch (error) {
      console.error('Error processing image:', error);
      this.snackBar.open('❌ Error processing image', 'Close', { duration: 3000 });
    }
  }

  private compressAndConvertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxDimension = 800;
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.8;
          let base64 = canvas.toDataURL('image/jpeg', quality);
          let iterations = 0;
          
          while ((base64.length * 3) / 4 > 100 * 1024 && quality > 0.1 && iterations < 10) {
            quality -= 0.1;
            base64 = canvas.toDataURL('image/jpeg', quality);
            iterations++;
          }
          
          resolve(base64);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  removeImage(): void {
    this.announcementForm.patchValue({ imageUrl: '' });
    this.snackBar.open('🗑️ Image removed', 'Close', { duration: 2000 });
  }

  getAnnouncementStatusLabel(announcement: Announcement): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!announcement.isActive) return '⚫ Inactive';

    const startDate = new Date(announcement.startDate);
    const endDate = new Date(announcement.endDate);
    const removalDate = new Date(endDate);
    removalDate.setDate(removalDate.getDate() + 2);

    if (today < startDate) return '⏳ Scheduled';
    if (today > removalDate) return '🔴 Expired';
    if (today > endDate) return '🟡 Expiring Soon';
    return '🟢 Active';
  }
}
