import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

export function useFirestore() {
  /**
   * Add a product to the user's wishlist
   */
  const addToWishlist = async (userId, product) => {
    try {
      await addDoc(collection(db, 'wishlists'), {
        userId,
        productId: product.id || product.title,
        title: product.title,
        image: product.image || '',
        price: product.price || 0,
        targetPrice: product.targetPrice || 0,
        source: product.source || '',
        url: product.url || '',
        rating: product.rating || 0,
        createdAt: serverTimestamp(),
      });
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error('Failed to add to wishlist.');
      throw err;
    }
  };

  /**
   * Remove a product from wishlist by Firestore doc ID
   */
  const removeFromWishlist = async (userId, docId) => {
    try {
      await deleteDoc(doc(db, 'wishlists', docId));
      toast.success('Removed from wishlist.');
    } catch (err) {
      toast.error('Failed to remove.');
      throw err;
    }
  };

  /**
   * Fetch all wishlist items for a user
   */
  const getWishlist = async (userId) => {
    try {
      const q = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('getWishlist error:', err);
      return [];
    }
  };

  /**
   * Save onboarding preferences for a user
   */
  const savePreferences = async (userId, prefs) => {
    try {
      await setDoc(
        doc(db, 'users', userId),
        { preferences: prefs, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error('savePreferences error:', err);
      throw err;
    }
  };

  /**
   * Get user preferences
   */
  const getPreferences = async (userId) => {
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) return snap.data().preferences || {};
      return {};
    } catch {
      return {};
    }
  };

  /**
   * Update target price for a wishlist item
   */
  const updateTargetPrice = async (docId, targetPrice) => {
    try {
      await setDoc(
        doc(db, 'wishlists', docId),
        { targetPrice, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error('updateTargetPrice error:', err);
      throw err;
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    savePreferences,
    getPreferences,
    updateTargetPrice,
  };
}
