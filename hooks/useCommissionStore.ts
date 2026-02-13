
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Commission, CommissionStatus } from '../types';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useCommissionStore = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'commissions'), orderBy('dateAdded', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCommissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Commission)));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching commissions:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addCommission = async (data: any) => {
    try {
      const docRef = await addDoc(collection(db, 'commissions'), { 
        ...data, 
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const updateCommissionStatus = async (id: string, status: CommissionStatus) => {
    try {
      await updateDoc(doc(db, 'commissions', id), { 
        status,
        lastUpdated: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error updating status: ", e);
      alert("更新狀態失敗，請檢查網路");
    }
  };

  const updateCommission = async (id: string, data: Partial<Commission>) => {
    try {
      await updateDoc(doc(db, 'commissions', id), { 
        ...data,
        lastUpdated: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error updating commission: ", e);
      alert("更新失敗，請檢查網路");
    }
  };

  const deleteCommission = async (id: string) => { 
    try {
      await deleteDoc(doc(db, 'commissions', id)); 
    } catch (e) {
      console.error("Error deleting commission: ", e);
      alert("刪除失敗，請檢查網路");
    }
  };

  return { commissions, loading, addCommission, updateCommissionStatus, updateCommission, deleteCommission };
};
