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

      <div
        *ngFor="let document of documents"
        class="document-card"
        (click)="selectDocument(document)"
        [class.active]="selectedDocument && selectedDocument.id === document.id"
      >
        <div class="document-icon">
          <i class="material-icons">{{ getDocumentIcon(document.type) }}</i>
        </div>
        <div class="document-info">
          <h2 class="document-title">{{ document.name }}</h2>
          <p class="document-author">Od: {{ getDocumentAuthor(document) }}</p>
          <p class="document-date">{{ formatDate(document.modifiedAt) }}</p>
        </div>
        <div
          class="document-actions"
          *ngIf="selectedDocument && selectedDocument.id === document.id"
        >
          <button
            class="action-button reject"
            (click)="rejectDocument(document.id); $event.stopPropagation()"
          >
            <i class="material-icons">close</i>
            Odmietnuť
          </button>
          <button
            class="action-button approve"
            (click)="approveDocument(document.id); $event.stopPropagation()"
          >
            <i class="material-icons">check_circle</i>
            Potvrdiť
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-bottom: 70px; /* Priestor pre spodný navigačný panel */
        background-color: #f5f5f5;
        min-height: 100vh;
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

      .document-card {
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 12px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        cursor: pointer;
        transition: box-shadow 0.2s, transform 0.2s;
      }

      .document-card:hover {
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
      }

      .document-card.active {
        box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3);
        border: 2px solid #673ab7;
        transform: translateY(-2px);
        position: relative;
      }

      .document-card.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
      }

      .document-icon {
        display: flex;
        align-items: center;
        padding: 16px 16px 0;
      }

      .document-icon i {
        color: #673ab7;
        font-size: 24px;
        background-color: #f0ebff;
        padding: 8px;
        border-radius: 50%;
      }

      .document-info {
        padding: 8px 16px 16px;
      }

      .document-title {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .document-author {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: #666;
      }

      .document-date {
        margin: 0;
        font-size: 12px;
        color: #888;
      }

      .document-actions {
        display: flex;
        border-top: 1px solid #f0f0f0;
        animation: fadeIn 0.3s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .action-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        border: none;
        background: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        gap: 8px;
        transition: background-color 0.2s;
      }

      .action-button i {
        font-size: 18px;
      }

      .reject {
        color: #666;
        border-right: 1px solid #f0f0f0;
      }

      .reject:hover {
        background-color: #f9f9f9;
      }

      .approve {
        color: #5e35b1;
      }

      .approve:hover {
        background-color: #f0ebff;
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
  selectedDocument: FolderItem | null = null;

  constructor(
    private documentService: DocumentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  selectDocument(document: FolderItem): void {
    if (this.selectedDocument && this.selectedDocument.id === document.id) {
      // Ak klikneme na už vybraný dokument, zrušíme výber
      this.selectedDocument = null;
    } else {
      // Inak nastavíme vybraný dokument
      this.selectedDocument = document;
    }
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

  approveDocument(documentId: string): void {
    const user = this.userService.getCurrentUserValue();

    this.documentService
      .approvePersonDocument(user.tenantId, user.personId, documentId)
      .subscribe({
        next: () => {
          console.log('Dokument úspešne potvrdený');
          // Aktualizácia zoznamu dokumentov po potvrdení
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Chyba pri potvrdzovaní dokumentu', err);
        },
      });
  }

  rejectDocument(documentId: string): void {
    const user = this.userService.getCurrentUserValue();

    this.documentService
      .rejectPersonDocument(user.tenantId, user.personId, documentId)
      .subscribe({
        next: () => {
          console.log('Dokument úspešne odmietnutý');
          // Aktualizácia zoznamu dokumentov po odmietnutí
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Chyba pri odmietaní dokumentu', err);
        },
      });
  }

  getDocumentAuthor(document: FolderItem): string {
    // Toto je len ukážka, v reálnej aplikácii by ste získali autora z dokumentu
    // alebo z iného zdroja dát
    return 'Peter Hlavný';
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
