import Dexie, { Table } from "dexie";

/* ======================
   Types
====================== */

export type SyncType = "local" | "synced";

export interface DocumentType {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  sync: SyncType;
}

/* ======================
   Database
====================== */

export class GitdocsLocalDB extends Dexie {
  documents!: Table<DocumentType, string>;

  constructor() {
    super("gitdocs_ai_db");

    this.version(1).stores({
      documents: "id, title, updatedAt",
    });
  }
}

export const db = new GitdocsLocalDB();
