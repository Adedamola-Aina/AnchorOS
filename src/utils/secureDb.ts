/**
 * Secure Database Utility Layer
 * 
 * Centralized Firestore wrapper with timeout handling, error mapping, and type-safe operations.
 * Refactored per CLAUDE.md §3.2 - core helpers extracted to secureDbCore.ts
 *
 * ALL Firestore imports in production src/ must route through this file.
 * Direct 'firebase/firestore' imports are a ARCH violation (BUG-111).
 */

import {
    getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc,
    query, type QueryConstraint,
} from 'firebase/firestore';
import { withTimeout, logOp, getUserDocRef, getUserCollectionPath } from './secureDbCore';

interface SecureDbOptions { timeoutMs?: number; }

export const secureDb = {
    async getDocument<T>(userId: string, path: string[], options: SecureDbOptions = {}): Promise<T | null> {
        const docPath = path.join('/');
        logOp('GET', `users/${userId}/${docPath}`);
        try {
            const docRef = getUserDocRef(userId, ...path);
            const snapshot = await withTimeout(getDoc(docRef), options.timeoutMs, `getDocument(${docPath})`);
            if (!snapshot.exists()) return null;
            return { id: snapshot.id, ...snapshot.data() } as T;
        } catch (error) { console.error(`[SecureDb] Error getting document: ${docPath}`, error); throw error; }
    },

    async queryCollection<T>(userId: string, collectionName: string, constraints: QueryConstraint[] = [], options: SecureDbOptions = {}): Promise<T[]> {
        logOp('QUERY', `users/${userId}/${collectionName}`);
        try {
            const collectionRef = getUserCollectionPath(userId, collectionName);
            const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
            const snapshot = await withTimeout(getDocs(q), options.timeoutMs, `queryCollection(${collectionName})`);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        } catch (error) { console.error(`[SecureDb] Error querying collection: ${collectionName}`, error); throw error; }
    },

    async setDocument(userId: string, path: string[], data: Record<string, unknown>, options: SecureDbOptions = {}): Promise<void> {
        const docPath = path.join('/');
        logOp('SET', `users/${userId}/${docPath}`, data);
        try {
            const docRef = getUserDocRef(userId, ...path);
            await withTimeout(setDoc(docRef, data), options.timeoutMs, `setDocument(${docPath})`);
        } catch (error) { console.error(`[SecureDb] Error setting document: ${docPath}`, error); throw error; }
    },

    async updateDocument(userId: string, path: string[], data: Record<string, unknown>, options: SecureDbOptions = {}): Promise<void> {
        const docPath = path.join('/');
        logOp('UPDATE', `users/${userId}/${docPath}`, data);
        try {
            const docRef = getUserDocRef(userId, ...path);
            await withTimeout(updateDoc(docRef, data), options.timeoutMs, `updateDocument(${docPath})`);
        } catch (error) { console.error(`[SecureDb] Error updating document: ${docPath}`, error); throw error; }
    },

    async deleteDocument(userId: string, path: string[], options: SecureDbOptions = {}): Promise<void> {
        const docPath = path.join('/');
        logOp('DELETE', `users/${userId}/${docPath}`);
        try {
            const docRef = getUserDocRef(userId, ...path);
            await withTimeout(deleteDoc(docRef), options.timeoutMs, `deleteDocument(${docPath})`);
        } catch (error) { console.error(`[SecureDb] Error deleting document: ${docPath}`, error); throw error; }
    },

    async addDocument(userId: string, collectionName: string, data: Record<string, unknown>, options: SecureDbOptions = {}): Promise<string> {
        logOp('ADD', `users/${userId}/${collectionName}`, data);
        try {
            const collectionRef = getUserCollectionPath(userId, collectionName);
            const docRef = await withTimeout(addDoc(collectionRef, data), options.timeoutMs, `addDocument(${collectionName})`);
            return docRef.id;
        } catch (error) { console.error(`[SecureDb] Error adding document: ${collectionName}`, error); throw error; }
    },
};

// ── Re-exports for files that need batch/transaction/raw ops ─────────────────
// All production code must import Firestore primitives from HERE, not from 'firebase/firestore' directly.
export { where, query, orderBy, limit, onSnapshot, writeBatch, runTransaction, serverTimestamp, increment } from 'firebase/firestore';
export type { QueryConstraint, Unsubscribe, DocumentSnapshot, FieldValue, WriteBatch, Firestore } from 'firebase/firestore';
export { withTimeout, mapSecureDbError, getUserDocRef, getUserCollectionPath } from './secureDbCore';
export { db } from '../config/firebase';
// addDoc / setDoc / updateDoc / deleteDoc / doc / collection — exported for batch/transaction callers
export { addDoc, setDoc, updateDoc, deleteDoc, doc, collection, getDocs, getDoc } from 'firebase/firestore';
