import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { UserService } from '../../services/user.service';
import { FolderItem, Document } from '../../models/document.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <div class="header-content">
        <i class="material-icons header-icon">description</i>
        <h1>Dokumenty</h1>
      </div>
    </div>
    <div class="content">
      <div *ngIf="loading" class="loading">
        <p>Načítavam dokumenty...</p>
      </div>

      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div
        *ngIf="!loading && !error && (!documents || documents.length === 0)"
        class="empty-state"
      >
        <i class="material-icons">folder_open</i>
        <p>Žiadne dokumenty neboli nájdené</p>
      </div>

      <div *ngFor="let document of documents" class="document-item">
        <div class="document-icon">
          <i class="material-icons">{{ getDocumentIcon(document.type) }}</i>
        </div>
        <div class="document-info">
          <h2>{{ document.name }}</h2>
          <p class="date">{{ formatDate(document.modifiedAt) }}</p>
        </div>
        <div class="document-actions">
          <i
            class="material-icons document-download"
            (click)="downloadDocument(document.id)"
            >file_download</i
          >
          <i
            class="material-icons document-open"
            (click)="openDocument(document.id)"
            >open_in_new</i
          >
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-bottom: 70px; /* Priestor pre spodný navigačný panel */
      }

      .header {
        background-color: #673ab7;
        color: white;
        padding: 0 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 10;
        height: 64px;
        display: flex;
        align-items: center;
      }

      .header-content {
        display: flex;
        align-items: center;
      }

      .header-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        text-align: left;
      }

      .content {
        padding: 16px;
        padding-bottom: 60px; /* Dodatočný priestor pre navigačný panel */
      }

      .document-item {
        display: flex;
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        align-items: center;
      }

      .document-icon {
        margin-right: 16px;
      }

      .document-icon i {
        color: #673ab7;
        font-size: 24px;
      }

      .document-info {
        flex: 1;
      }

      .document-info h2 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 500;
      }

      .document-info p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }

      .document-info .date {
        font-size: 12px;
        color: #888;
      }

      .document-actions {
        display: flex;
        gap: 16px;
      }

      .document-download,
      .document-open {
        color: #666;
        cursor: pointer;
      }

      .document-download:hover,
      .document-open:hover {
        color: #673ab7;
      }

      .loading,
      .error,
      .empty-state {
        text-align: center;
        padding: 32px 16px;
        color: #666;
      }

      .empty-state i {
        font-size: 48px;
        color: #ddd;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class DocumentsComponent implements OnInit {
  documents: FolderItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private documentService: DocumentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.error = null;

    const user = this.userService.getCurrentUserValue();

    this.documentService
      .getPersonDocuments(user.tenantId, user.personId)
      .subscribe({
        next: (response) => {
          this.documents = response.items || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Chyba pri načítaní dokumentov', err);
          this.error =
            'Nepodarilo sa načítať dokumenty. Skúste to prosím neskôr.';
          this.loading = false;
        },
      });
  }

  downloadDocument(documentId: string): void {
    const user = this.userService.getCurrentUserValue();

    this.documentService
      .downloadPersonDocument(user.tenantId, user.personId, documentId)
      .subscribe({
        next: (document) => {
          if (document.downloadUrl) {
            window.open(document.downloadUrl, '_blank');
          } else {
            console.error('Dokument nemá URL na stiahnutie');
          }
        },
        error: (err) => {
          console.error('Chyba pri sťahovaní dokumentu', err);
        },
      });
  }

  openDocument(documentId: string): void {
    const user = this.userService.getCurrentUserValue();

    this.documentService
      .openPersonDocument(user.tenantId, user.personId, documentId)
      .subscribe({
        next: (document) => {
          if (document.downloadUrl) {
            window.open(document.downloadUrl, '_blank');
          } else {
            console.error('Dokument nemá URL na otvorenie');
          }
        },
        error: (err) => {
          console.error('Chyba pri otváraní dokumentu', err);
        },
      });
  }

  getDocumentIcon(type: string | null): string {
    if (!type) return 'description';

    switch (type.toLowerCase()) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'ppt':
      case 'pptx':
        return 'slideshow';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'description';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK');
  }
}
