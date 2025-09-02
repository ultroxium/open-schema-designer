'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Schema } from '@/types/schema';
import { getSchemasFromStorage, saveSchemaToStorage, createNewSchema, decodeSchemaFromUrl, updateUrlWithSchema } from '@/lib/storage';
import { createSampleECommerceSchema, createSampleBlogSchema } from '@/lib/sampleData';

type AppAction = 
  | { type: 'SET_CURRENT_SCHEMA'; payload: Schema | null }
  | { type: 'SET_SCHEMAS'; payload: Schema[] }
  | { type: 'ADD_SCHEMA'; payload: Schema }
  | { type: 'UPDATE_SCHEMA'; payload: Schema }
  | { type: 'DELETE_SCHEMA'; payload: string };

const initialState: AppState = {
  currentSchema: null,
  schemas: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_SCHEMA':
      return { ...state, currentSchema: action.payload };
    case 'SET_SCHEMAS':
      return { ...state, schemas: action.payload };
    case 'ADD_SCHEMA':
      return { ...state, schemas: [...state.schemas, action.payload] };
    case 'UPDATE_SCHEMA':
      const updatedSchemas = state.schemas.map(s => 
        s.id === action.payload.id ? action.payload : s
      );
      return { 
        ...state, 
        schemas: updatedSchemas,
        currentSchema: state.currentSchema?.id === action.payload.id ? action.payload : state.currentSchema
      };
    case 'DELETE_SCHEMA':
      return {
        ...state,
        schemas: state.schemas.filter(s => s.id !== action.payload),
        currentSchema: state.currentSchema?.id === action.payload ? null : state.currentSchema
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  setCurrentSchema: (schema: Schema | null) => void;
  saveSchema: (schema: Schema) => void;
  loadSchemas: () => void;
  loadSchemaById: (schemaId: string) => void;
  createNewSchema: (name: string) => Schema;
  deleteSchema: (schemaId: string) => void;
  shareSchema: (schema: Schema) => string;
  initializeSampleSchemas: () => void;
  resetToSampleSchemas: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check for shared schema in URL first
    const sharedSchema = decodeSchemaFromUrl();
    if (sharedSchema) {
      dispatch({ type: 'SET_CURRENT_SCHEMA', payload: sharedSchema });
    }
    
    // Load local schemas
    const schemas = getSchemasFromStorage();
    dispatch({ type: 'SET_SCHEMAS', payload: schemas });
    
    // // Initialize with sample schemas if no schemas exist and no shared schema
    // if (schemas.length === 0 && !sharedSchema) {
    //   initializeSampleSchemas();
    // } else if (!sharedSchema && schemas.length > 0) {
    //   // Set the first schema as current if no shared schema
    //   setCurrentSchema(schemas[0]);
    // }
  }, []);

  const setCurrentSchema = (schema: Schema | null): void => {
    dispatch({ type: 'SET_CURRENT_SCHEMA', payload: schema });
    
    // Update URL when schema changes
    if (schema) {
      updateUrlWithSchema(schema);
    }
  };

  const saveSchema = (schema: Schema): void => {
    saveSchemaToStorage(schema);
    dispatch({ type: 'UPDATE_SCHEMA', payload: schema });
    
    // Update URL with current schema
    updateUrlWithSchema(schema);
  };

  const loadSchemas = (): void => {
    const schemas = getSchemasFromStorage();
    dispatch({ type: 'SET_SCHEMAS', payload: schemas });
  };

  const loadSchemaById = (schemaId: string): void => {
    const schemas = getSchemasFromStorage();
    const schema = schemas.find(s => s.id === schemaId);
    if (schema) {
      setCurrentSchema(schema);
    }
  };

  const createSchema = (name: string): Schema => {
    const newSchema = createNewSchema(name);
    saveSchemaToStorage(newSchema);
    dispatch({ type: 'ADD_SCHEMA', payload: newSchema });
    return newSchema;
  };

  const deleteSchema = (schemaId: string): void => {
    // Remove from localStorage
    const schemas = getSchemasFromStorage();
    const updatedSchemas = schemas.filter(s => s.id !== schemaId);
    localStorage.setItem('schemaViz_schemas', JSON.stringify(updatedSchemas));
    
    dispatch({ type: 'DELETE_SCHEMA', payload: schemaId });
  };

  const shareSchema = (schema: Schema): string => {
    try {
      const compressedData = btoa(JSON.stringify(schema));
      return `${window.location.origin}${window.location.pathname}?schema=${encodeURIComponent(compressedData)}`;
    } catch (error) {
      console.error('Error creating share URL:', error);
      return '';
    }
  };

  const initializeSampleSchemas = (): void => {
    const existingSchemas = getSchemasFromStorage();
    
    // Check if sample schemas already exist by name
    const hasEcommerce = existingSchemas.some(s => s.name === 'E-Commerce Platform');
    const hasBlog = existingSchemas.some(s => s.name === 'Blog Platform');
    
    // Only create schemas that don't exist
    if (!hasEcommerce) {
      const ecommerceSchema = createSampleECommerceSchema();
      saveSchemaToStorage(ecommerceSchema);
      dispatch({ type: 'ADD_SCHEMA', payload: ecommerceSchema });
    }
    
    if (!hasBlog) {
      const blogSchema = createSampleBlogSchema();
      saveSchemaToStorage(blogSchema);
      dispatch({ type: 'ADD_SCHEMA', payload: blogSchema });
    }
    
    // Refresh schemas from storage to ensure consistency
    const updatedSchemas = getSchemasFromStorage();
    dispatch({ type: 'SET_SCHEMAS', payload: updatedSchemas });
  };

  const resetToSampleSchemas = (): void => {
    // Clear existing schemas
    localStorage.removeItem('schemaViz_schemas');
    dispatch({ type: 'SET_SCHEMAS', payload: [] });
    
    // Reinitialize with fresh sample data
    initializeSampleSchemas();
  };

  const value: AppContextType = {
    state,
    setCurrentSchema,
    saveSchema,
    loadSchemas,
    loadSchemaById,
    createNewSchema: createSchema,
    deleteSchema,
    shareSchema,
    initializeSampleSchemas,
    resetToSampleSchemas
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
