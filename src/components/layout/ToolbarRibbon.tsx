'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Link, ChevronUp, ChevronDown, Home, Share2, Check, Download, Upload, FileText, Database } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { RelationshipDialog } from '@/components/schema/RelationshipDialog';
import { useApp } from '@/contexts/AppContext';
import { createNewTable } from '@/lib/storage';
import { generateSQLFromSchema, generatePrismaSchema } from '@/lib/schemaGenerator';
import {
  generateMySQLFromSchema,
  generateTypeORMEntities,
  generateDjangoModels,
  generateLaravelMigrations
} from '@/lib/exporters';
import {
  importFromJSON,
  importFromSQL,
  importFromPrisma
} from '@/lib/importers';
import { Relationship } from '@/types/schema';
import { toast } from 'sonner';

export function ToolbarRibbon() {
  const { state, saveSchema, setCurrentSchema, shareSchema, resetToSampleSchemas } = useApp();
  const [schemaName, setSchemaName] = useState(state.currentSchema?.name || '');
  const [copied, setCopied] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState<'json' | 'sql' | 'prisma'>('json');
  const [importData, setImportData] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    toast.success('Table added successfully');
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

  const handleEditRelationship = useCallback((relationshipId: string, updates: Partial<Relationship>) => {
    if (!currentSchema) return;

    const updatedSchema = {
      ...currentSchema,
      relationships: currentSchema.relationships.map(rel => 
        rel.id === relationshipId ? { ...rel, ...updates } : rel
      ),
      updatedAt: new Date()
    };

    setCurrentSchema(updatedSchema);
  }, [currentSchema, setCurrentSchema]);

  const handleDeleteRelationship = useCallback((relationshipId: string) => {
    if (!currentSchema) return;

    const updatedSchema = {
      ...currentSchema,
      relationships: currentSchema.relationships.filter(rel => rel.id !== relationshipId),
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
    toast.success('Schema saved successfully');
  };

  const handleShareSchema = () => {
    if (currentSchema) {
      const shareUrl = shareSchema(currentSchema);
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Share link copied to clipboard');
    }
  };

  const handleExportSQL = () => {
    if (!currentSchema) return;
    
    try {
      const sql = generateSQLFromSchema(currentSchema);
      const blob = new Blob([sql], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentSchema.name.replace(/\s+/g, '_')}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('SQL file exported successfully');
    } catch (error) {
      console.error('Error exporting SQL:', error);
      toast.error('Failed to export SQL file');
    }
  };

  const handleExportPrisma = () => {
    if (!currentSchema) return;
    
    try {
      const prisma = generatePrismaSchema(currentSchema);
      const blob = new Blob([prisma], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentSchema.name.replace(/\s+/g, '_')}.prisma`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Prisma schema exported successfully');
    } catch (error) {
      console.error('Error exporting Prisma:', error);
      toast.error('Failed to export Prisma schema');
    }
  };

  const handleExportJSON = () => {
    if (!currentSchema) return;
    
    try {
      const json = JSON.stringify(currentSchema, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentSchema.name.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('JSON schema exported successfully');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error('Failed to export JSON schema');
    }
  };

  const handleImportSchema = () => {
    if (!importData.trim()) {
      toast.error('Please provide import data');
      return;
    }

    try {
      let importedSchema;
      
      switch (importType) {
        case 'json':
          importedSchema = importFromJSON(importData);
          break;
        case 'sql':
          importedSchema = importFromSQL(importData);
          break;
        case 'prisma':
          importedSchema = importFromPrisma(importData);
          break;
        default:
          throw new Error('Invalid import type');
      }

      setCurrentSchema(importedSchema);
      setImportDialogOpen(false);
      setImportData('');
      toast.success(`Schema imported successfully from ${importType.toUpperCase()}`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Failed to import schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
      
      // Auto-detect file type
      if (file.name.endsWith('.json')) {
        setImportType('json');
      } else if (file.name.endsWith('.sql')) {
        setImportType('sql');
      } else if (file.name.endsWith('.prisma')) {
        setImportType('prisma');
      }
    };
    reader.readAsText(file);
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
                  existingRelationships={currentSchema.relationships}
                  onEditRelationship={handleEditRelationship}
                  onDeleteRelationship={handleDeleteRelationship}
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
                
                <DropdownMenu open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Import
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-96">
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Import Type</label>
                        <select 
                          value={importType} 
                          onChange={(e) => setImportType(e.target.value as 'json' | 'sql' | 'prisma')}
                          className="w-full p-2 border rounded"
                        >
                          <option value="json">JSON Schema</option>
                          <option value="sql">SQL DDL</option>
                          <option value="prisma">Prisma Schema</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Import Data</label>
                        <textarea
                          value={importData}
                          onChange={(e) => setImportData(e.target.value)}
                          placeholder="Paste your schema here..."
                          className="w-full h-32 p-2 border rounded text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Or upload file</label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json,.sql,.prisma"
                          onChange={handleFileImport}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setImportDialogOpen(false);
                            setImportData('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleImportSchema}
                          disabled={!importData.trim()}
                        >
                          Import
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportSQL}>
                      <Database className="h-4 w-4 mr-2" />
                      Export SQL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPrisma}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export Prisma
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJSON}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
