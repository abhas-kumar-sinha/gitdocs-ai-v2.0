import { db, DocumentType } from "@/lib/db/indexedDB";
import { DEFAULT_MARKDOWN } from "../constants/COMPONENTS";

export const getAllDocuments = async () => {
  return await db.documents
    .orderBy("updatedAt")
    .reverse()
    .toArray();
};

export const getDocumentById = async (id: string) => {
  return await db.documents.get(id);
};

export const createDocument = async () => {

  const documentId = crypto.randomUUID();
  const allDocuments = await getAllDocuments();

  const newTitle = `Document ${allDocuments.length + 1}`;

  const newDocument: DocumentType = {
    id: documentId,
    title: newTitle,
    content: DEFAULT_MARKDOWN,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    version: 0,
    sync: "local",
  }

  await db.documents.add(newDocument);

  return newDocument;
};

export const updateDocumentTitle = async (
  id: string,
  newTitle: string
): Promise<DocumentType | null> => {
  const doc = await db.documents.get(id);

  if (!doc) return null;

  const updatedDoc: DocumentType = {
    ...doc,
    title: newTitle,
    updatedAt: Date.now(),
    version: doc.version + 1,
    sync: "local",
  };

  await db.documents.put(updatedDoc);

  return updatedDoc;
};

export const deleteDocument = async (id: string): Promise<void> => {
  await db.documents.delete(id);
};

export const formatUpdatedAt = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp; // ms

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "less than a minute ago";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  return `${years} year${years > 1 ? "s" : ""} ago`;
};
