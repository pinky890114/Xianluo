import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ShowcaseItem } from '../types';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export const useShopStore = () => {
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'showcase'), orderBy('dateAdded', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShowcaseItem[];
      setShowcaseItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addShowcaseItem = async (url: string) => {
    try {
      await addDoc(collection(db, 'showcase'), {
        url,
        dateAdded: Date.now(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("上傳失敗，請稍後再試");
    }
  };

  const removeShowcaseItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'showcase', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert("刪除失敗，請稍後再試");
    }
  };

  return { showcaseItems, loading, addShowcaseItem, removeShowcaseItem };
};