import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService, TempleContent } from '../../services/firebase.service';

@Component({
  selector: 'app-manage-content',
  template: `
    <div class="manage-content">
      <mat-card *ngFor="let content of contentItems" class="content-card">
        <h3>{{ content.section }}</h3>
        <form [formGroup]="getForm(content.id!)" (ngSubmit)="updateContent(content.id!)">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Content</mat-label>
            <textarea matInput formControlName="content" rows="5"></textarea>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Update</button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .manage-content { display: grid; gap: 1.5rem; }
    .content-card { padding: 2rem; }
    h3 { margin: 0 0 1rem 0; color: #ff6b35; }
    .full-width { width: 100%; }
  `]
})
export class ManageContentComponent implements OnInit {
  contentItems: TempleContent[] = [];
  forms: Map<string, FormGroup> = new Map();

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.contentItems = await this.firebaseService.getContent();
    this.contentItems.forEach(item => {
      if (item.id) {
        this.forms.set(item.id, this.fb.group({
          title: [item.title, Validators.required],
          content: [item.content, Validators.required]
        }));
      }
    });
  }

  getForm(id: string): FormGroup {
    return this.forms.get(id) || this.fb.group({});
  }

  async updateContent(id: string) {
    const form = this.forms.get(id);
    if (form && form.valid) {
      try {
        await this.firebaseService.updateContent(id, form.value);
        this.snackBar.open('Content updated successfully', 'Close', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Error updating content', 'Close', { duration: 3000 });
      }
    }
  }
}
