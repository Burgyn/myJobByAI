import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, FolderContent } from '../models/document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private baseUrl = 'https://26d7-195-146-148-132.ngrok-free.app/api/company';

  // Hlavičky pre GET požiadavky
  private headers = new HttpHeaders({
    // Pre GET požiadavky nepotrebujeme Content-Type, ale môžeme použiť Accept
    Accept: 'application/json', // Povie serveru, že očakávame JSON odpoveď
    'X-Requested-With': 'XMLHttpRequest', // Táto hlavička je bezpečná
  });

  constructor(private http: HttpClient) {}

  getPersonDocuments(
    tenantId: string,
    personId: string
  ): Observable<FolderContent> {
    const url = `${this.baseUrl}/${tenantId}/documents/persons/${personId}`;
    return this.http.get<FolderContent>(url, { headers: this.headers });
  }

  getPersonDocumentsForFolder(
    tenantId: string,
    personId: string,
    folderId: string
  ): Observable<FolderContent> {
    const url = `${this.baseUrl}/${tenantId}/documents/persons/${personId}/${folderId}`;
    return this.http.get<FolderContent>(url, { headers: this.headers });
  }

  downloadPersonDocument(
    tenantId: string,
    personId: string,
    documentId: string
  ): Observable<Document> {
    const url = `${this.baseUrl}/${tenantId}/documents/persons/${personId}/document/${documentId}`;
    return this.http.get<Document>(url, { headers: this.headers });
  }

  openPersonDocument(
    tenantId: string,
    personId: string,
    documentId: string
  ): Observable<Document> {
    const url = `${this.baseUrl}/${tenantId}/documents/persons/${personId}/document/${documentId}/open`;
    return this.http.get<Document>(url, { headers: this.headers });
  }
}
