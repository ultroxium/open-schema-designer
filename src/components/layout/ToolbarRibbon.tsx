'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Link, ChevronUp, ChevronDown, Home, Share2, Check } from 'lucide-react';
import { RelationshipDialog } from '@/components/schema/RelationshipDialog';
import { useApp } from '@/contexts/AppContext';
import { createNewTable } from '@/lib/storage';
import { Relationship } from '@/types/schema';

export function ToolbarRibbon() {
  const { state, saveSchema, setCurrentSchema, shareSchema, resetToSampleSchemas } = useApp();
  const [schemaName, setSchemaName] = useState(state.currentSchema?.name || '');
  const [copied, setCopied] = useState(false);

  const currentSchema = state.currentSchema;

  React.useEffect(() => {
    if (currentSchema) {
      setSchemaName(currentSchema.name);
    }
  }, [currentSchema]);

  const handleAddTable = useCallback(() => {
    if (!currentSchema) return;

    // Create table at a random position to avoid overlap
    const position = { 
      x: Math.random() * 400 + 100, 
      y: Math.random() * 300 + 100 
    };
    const newTable = createNewTable(`table_${currentSchema.tables.length + 1}`, position);
    
    const updatedSchema = {
      ...currentSchema,
      tables: [...currentSchema.tables, newTable],
      updatedAt: new Date()
    };

    setCurrentSchema(updatedSchema);
  }, [currentSchema, setCurrentSchema]);

  const handleAddRelationship = useCallback((relationship: Relationship) => {
    if (!currentSchema) return;

    const updatedSchema = {
      ...currentSchema,
      relationships: [...currentSchema.relationships, relationship],
      updatedAt: new Date()
    };

    setCurrentSchema(updatedSchema);
  }, [currentSchema, setCurrentSchema]);

  const handleSaveSchema = () => {
    if (!currentSchema) return;

    let schemaToSave = currentSchema;
    
    if (schemaName.trim() && schemaName !== currentSchema.name) {
      schemaToSave = {
        ...currentSchema,
        name: schemaName.trim(),
        updatedAt: new Date()
      };
      setCurrentSchema(schemaToSave);
    }

    const finalSchema = {
      ...schemaToSave,
      updatedAt: new Date()
    };

    saveSchema(finalSchema);
    setCurrentSchema(finalSchema);
  };

  const handleShareSchema = () => {
    if (currentSchema) {
      const shareUrl = shareSchema(currentSchema);
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackHome = () => {
    setCurrentSchema(null);
  };

  if (!currentSchema) return null;

  return (
    <div className="border bg-white fixed top-5 left-0 right-0 z-50 rounded-xl max-w-7xl mx-auto">
      {/* Main Toolbar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation & Schema Info */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleBackHome}
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <Input
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                className="text-lg font-semibold border-none shadow-none p-0 h-auto bg-transparent"
                placeholder="Schema name..."
              />
              {/* <Badge variant="secondary">
                {currentSchema.tables.length} tables, {currentSchema.relationships.length} relationships
              </Badge> */}
            </div>
          </div>

          <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 pr-3 border-r">
                <Button onClick={handleAddTable} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Table
                </Button>
                <RelationshipDialog 
                  tables={currentSchema.tables} 
                  onAddRelationship={handleAddRelationship}
                >
                  <Button variant="outline" size="sm">
                    <Link className="h-4 w-4 mr-1" />
                    Relationship
                  </Button>
                </RelationshipDialog>
              </div>

              <div className="flex items-center space-x-1">
                <Button onClick={handleSaveSchema} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  onClick={handleShareSchema}
                  variant="outline" 
                  size="sm"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Share2 className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
