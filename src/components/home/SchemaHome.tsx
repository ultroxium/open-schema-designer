'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Trash2, Eye, Search, Home, ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Schema } from '@/types/schema';

export function SchemaHome() {
  const router = useRouter();
  const { state, setCurrentSchema, createNewSchema, deleteSchema, loadSchemas } = useApp();
  const [newSchemaName, setNewSchemaName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateSchema = () => {
    if (newSchemaName.trim()) {
      const newSchema = createNewSchema(newSchemaName.trim());
      router.push(`/my-designs?schema=${newSchema.id}`);
      setNewSchemaName('');
      loadSchemas();
    }
  };

  const handleOpenSchema = (schema: Schema) => {
    router.push(`/my-designs?schema=${schema.id}`);
  };

  const handleDeleteSchema = (schemaId: string) => {
    if (confirm('Are you sure you want to delete this schema?')) {
      deleteSchema(schemaId);
      loadSchemas();
    }
  };

  const filteredSchemas = state.schemas.filter(schema =>
    schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schema.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* back button */}
        <Button variant={'outline'} onClick={handleBackHome}>
          <ArrowLeft/>
        </Button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Schemas</h1>
          <p className="text-gray-600 mb-6">
            Design and visualize your database schemas with an intuitive drag-and-drop interface
          </p>
          
          {/* Search and Create */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search schemas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="New schema name..."
                value={newSchemaName}
                onChange={(e) => setNewSchemaName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateSchema();
                }}
                className="w-64 bg-white"
              />
              <Button 
                onClick={handleCreateSchema}
                disabled={!newSchemaName.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Schema
              </Button>
            </div>
          </div>
        </div>

        {/* Schema Grid */}
        {filteredSchemas.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No schemas found' : 'No schemas yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first database schema to get started'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => {
                setNewSchemaName('My First Schema');
                setTimeout(handleCreateSchema, 100);
              }}>
                <Plus className="h-4 w-4 mr-1" />
                Create Your First Schema
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemas.map((schema) => (
              <Card 
                key={schema.id}
                className="hover:shadow-lg transition-all cursor-pointer group bg-white shadow-none"
                onClick={() => handleOpenSchema(schema)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1 truncate">{schema.name}</CardTitle>
                      {schema.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {schema.description}
                        </p>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSchema(schema);
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
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="text-xs">
                          {schema.tables.length} tables
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {schema.relationships.length} relationships
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Updated {formatDate(schema.updatedAt)}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSchema(schema);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Open Schema
                    </Button>
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
