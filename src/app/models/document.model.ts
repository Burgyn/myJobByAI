export interface Document {
  id: string;
  name: string | null;
  type: string | null;
  createdAt: string;
  modifiedAt: string;
  downloadUrl: string | null;
  size: number;
  contentType: string | null;
}

export interface FolderContent {
  items: FolderItem[] | null;
}

export interface FolderItem {
  id: string;
  name: string | null;
  type: string | null;
  createdAt: string;
  modifiedAt: string;
}
