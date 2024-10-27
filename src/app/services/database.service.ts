import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  //private sqlite:
  //private db!: 
  //private user:

  constructor() { }

  async initializePlugin() {

    // await this.db.open();
    const schema = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      code TEXT UNIQUE,
      scoreLetter TEXT,
      timestamp TEXT,
      isCalories BOOLEAN DEFAULT 0,
      isSugars BOOLEAN DEFAULT 0,
      isSaturatedFat BOOLEAN DEFAULT 0,
      isSalt BOOLEAN DEFAULT 0,
      isColorant BOOLEAN DEFAULT 0,
      isCaffeine BOOLEAN DEFAULT 0
    );`;

    //await this.db.execute(schema)

  }

  async loadProducts() { 
    //const products = await this.db.query(`SELECT * FROM products;`);
    //this.products.set
  }

  async deleteProduct(code: string) { 
    //const products = await this.db.query(`SELECT * FROM products;`);
    //this.products.set
  }

  async getProductByCode(code: string) {
    
  }
}
