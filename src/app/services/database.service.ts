import { inject, Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { catchError, from, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private firestore = inject(Firestore);
  
  constructor() { }

  getCollectionChanges<T>(path: string) {
    const refcollection = collection(this.firestore, path);
    console.log("Path "+path);
    return collectionData(refcollection) as Observable<T[]>;
  }
  
  createDocument(path: string, docId: string, data: any) {
    const document = doc(this.firestore, `${path}/${docId}`);
    return setDoc(document, data);
  }

  deleteDocument(path: string, docId: string) {
    const document = doc(this.firestore,  `${path}/${docId}`)
    return deleteDoc(document)
  }

}
