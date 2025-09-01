'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Trash2, Eye } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Schema } from '@/types/schema';

export function SchemaSidebar() {
  const { state, setCurrentSchema, createNewSchema, deleteSchema, loadSchemas } = useApp();
  const [newSchemaName, setNewSchemaName] = useState('');

  const handleCreateSchema = () => {
    if (newSchemaName.trim()) {
      const newSchema = createNewSchema(newSchemaName.trim());
      setCurrentSchema(newSchema);
      setNewSchemaName('');
      loadSchemas();
    }
  };

  const handleDeleteSchema = (schemaId: string) => {
    if (confirm('Are you sure you want to delete this schema?')) {
      deleteSchema(schemaId);
      if (state.currentSchema?.id === schemaId) {
        setCurrentSchema(null);
      }
      loadSchemas();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-80 border-r bg-gray-50/50 flex flex-col">
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold mb-3">My Schemas</h2>
        
        <div className="space-y-2">
          <Input
            placeholder="New schema name..."
            value={newSchemaName}
            onChange={(e) => setNewSchemaName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateSchema();
            }}
          />
          <Button 
            onClick={handleCreateSchema}
            disabled={!newSchemaName.trim()}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create New Schema
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {state.schemas.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No schemas yet.</p>
            <p className="text-sm">Create your first schema above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {state.schemas.map((schema) => (
              <Card 
                key={schema.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  state.currentSchema?.id === schema.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-white'
                }`}
                onClick={() => setCurrentSchema(schema)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{schema.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(schema.updatedAt)}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {schema.tables.length} tables
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {schema.relationships.length} relationships
                        </Badge>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSchema(schema);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSchema(schema.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
