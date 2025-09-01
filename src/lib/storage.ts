import { Schema, Table, Relationship, PostgreSQLDataType, RelationshipType } from '@/types/schema';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'schemaViz_schemas';

export function getSchemasFromStorage(): Schema[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const schemas = JSON.parse(data);
      return schemas.map((schema: any) => ({
        ...schema,
        createdAt: new Date(schema.createdAt),
        updatedAt: new Date(schema.updatedAt)
      }));
    }
  } catch (error) {
    console.error('Error parsing schemas:', error);
  }
  
  return [];
}

export function saveSchemaToStorage(schema: Schema): void {
  if (typeof window === 'undefined') return;
  
  const schemas = getSchemasFromStorage();
  const existingIndex = schemas.findIndex(s => s.id === schema.id);
  
  if (existingIndex >= 0) {
    schemas[existingIndex] = { ...schema, updatedAt: new Date() };
  } else {
    schemas.push(schema);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemas));
}

export function deleteSchemaFromStorage(schemaId: string): void {
  if (typeof window === 'undefined') return;
  
  const schemas = getSchemasFromStorage();
  const updatedSchemas = schemas.filter(s => s.id !== schemaId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSchemas));
}

export function createNewSchema(name: string): Schema {
  return {
    id: uuidv4(),
    name,
    description: '',
    tables: [],
    relationships: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function createNewTable(name: string, position: { x: number; y: number }): Table {
  return {
    id: uuidv4(),
    name,
    fields: [
      {
        id: uuidv4(),
        name: 'id',
        type: 'uuid',
        nullable: false,
        primaryKey: true,
        foreignKey: false,
        unique: true
      }
    ],
    position,
    color: '#f3f4f6'
  };
}

export function createNewField(name: string = '', type: PostgreSQLDataType = 'varchar'): any {
  return {
    id: uuidv4(),
    name,
    type,
    nullable: true,
    primaryKey: false,
    foreignKey: false,
    unique: false
  };
}

export function createNewRelationship(
  sourceTableId: string,
  sourceFieldId: string,
  targetTableId: string,
  targetFieldId: string,
  relType: RelationshipType = 'one-to-many'
): Relationship {
  return {
    id: uuidv4(),
    sourceTableId,
    sourceFieldId,
    targetTableId,
    targetFieldId,
    type: relType
  };
}

// URL Sharing Functions
export function encodeSchemaToUrl(schema: Schema): string {
  try {
    const compressedData = btoa(JSON.stringify(schema));
    return `${window.location.origin}${window.location.pathname}?schema=${encodeURIComponent(compressedData)}`;
  } catch (error) {
    console.error('Error encoding schema to URL:', error);
    return '';
  }
}

export function decodeSchemaFromUrl(): Schema | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const schemaData = urlParams.get('schema');
    
    if (!schemaData) return null;
    
    const decodedData = atob(decodeURIComponent(schemaData));
    const schema = JSON.parse(decodedData);
    
    // Convert date strings back to Date objects
    return {
      ...schema,
      createdAt: new Date(schema.createdAt),
      updatedAt: new Date(schema.updatedAt)
    };
  } catch (error) {
    console.error('Error decoding schema from URL:', error);
    return null;
  }
}

export function updateUrlWithSchema(schema: Schema): void {
  if (typeof window === 'undefined') return;
  
  try {
    const compressedData = btoa(JSON.stringify(schema));
    const newUrl = `${window.location.pathname}?schema=${encodeURIComponent(compressedData)}`;
    window.history.replaceState(null, '', newUrl);
  } catch (error) {
    console.error('Error updating URL with schema:', error);
  }
}

export function clearUrlSchema(): void {
  if (typeof window === 'undefined') return;
  
  const newUrl = window.location.pathname;
  window.history.replaceState(null, '', newUrl);
}
