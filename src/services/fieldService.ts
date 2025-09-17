import { Venue as Field } from '../types';
import { mockFields } from '../data/mockFields';

class FieldService {
  private fields: Field[] = mockFields;
  private idCounter: number = Date.now();

  // Tạo unique ID
  private generateId(): string {
    this.idCounter += 1;
    return `field_${this.idCounter}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getFields(): Promise<Field[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.fields;
  }

  async getField(id: string): Promise<Field | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.fields.find(f => f.id === id) || null;
  }

  async createField(fieldData: Omit<Field, 'id' | 'rating' | 'totalBookings'>): Promise<Field> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newField: Field = {
      ...fieldData,
      id: this.generateId(),
      rating: 0,
      totalBookings: 0
    };
    
    this.fields.push(newField);
    return newField;
  }

  async updateField(id: string, updates: Partial<Field>): Promise<Field> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fieldIndex = this.fields.findIndex(f => f.id === id);
    if (fieldIndex === -1) {
      throw new Error('Không tìm thấy sân');
    }
    
    this.fields[fieldIndex] = { ...this.fields[fieldIndex], ...updates };
    return this.fields[fieldIndex];
  }

  async deleteField(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const fieldIndex = this.fields.findIndex(f => f.id === id);
    if (fieldIndex === -1) {
      throw new Error('Không tìm thấy sân');
    }
    
    this.fields.splice(fieldIndex, 1);
  }
}

export const fieldService = new FieldService();