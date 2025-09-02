'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, ArrowRight, Trash2, Edit2 } from 'lucide-react';
import { Table, Relationship, RelationshipType } from '@/types/schema';
import { createNewRelationship } from '@/lib/storage';
import { toast } from 'sonner';

interface RelationshipDialogProps {
  children?: React.ReactNode;
  tables: Table[];
  onAddRelationship: (relationship: Relationship) => void;
  existingRelationships?: Relationship[];
  onEditRelationship?: (relationshipId: string, updates: Partial<Relationship>) => void;
  onDeleteRelationship?: (relationshipId: string) => void;
}

export function RelationshipDialog({ 
  children, 
  tables, 
  onAddRelationship, 
  existingRelationships = [],
  onEditRelationship,
  onDeleteRelationship 
}: RelationshipDialogProps) {
  const [open, setOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [formData, setFormData] = useState({
    sourceTableId: '',
    sourceFieldId: '',
    targetTableId: '',
    targetFieldId: '',
    type: 'one-to-many' as RelationshipType,
    name: '',
    onDelete: 'CASCADE' as 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION',
    onUpdate: 'CASCADE' as 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION'
  });

  const resetForm = () => {
    setFormData({
      sourceTableId: '',
      sourceFieldId: '',
      targetTableId: '',
      targetFieldId: '',
      type: 'one-to-many',
      name: '',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    setEditingRelationship(null);
  };

  const handleCreate = () => {
    if (!formData.sourceTableId || !formData.sourceFieldId || !formData.targetTableId || !formData.targetFieldId) {
      toast.error('Please select source and target tables and fields');
      return;
    }

    if (editingRelationship && onEditRelationship) {
      onEditRelationship(editingRelationship.id, {
        sourceTableId: formData.sourceTableId,
        sourceFieldId: formData.sourceFieldId,
        targetTableId: formData.targetTableId,
        targetFieldId: formData.targetFieldId,
        type: formData.type,
        name: formData.name || undefined,
        onDelete: formData.onDelete,
        onUpdate: formData.onUpdate
      });
      toast.success('Relationship updated successfully');
    } else {
      const newRelationship = createNewRelationship(
        formData.sourceTableId,
        formData.sourceFieldId,
        formData.targetTableId,
        formData.targetFieldId,
        formData.type
      );
      
      if (formData.name) {
        newRelationship.name = formData.name;
      }
      newRelationship.onDelete = formData.onDelete;
      newRelationship.onUpdate = formData.onUpdate;

      onAddRelationship(newRelationship);
      toast.success('Relationship created successfully');
    }
    
    setOpen(false);
    resetForm();
  };

  const handleEdit = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setFormData({
      sourceTableId: relationship.sourceTableId,
      sourceFieldId: relationship.sourceFieldId,
      targetTableId: relationship.targetTableId,
      targetFieldId: relationship.targetFieldId,
      type: relationship.type,
      name: relationship.name || '',
      onDelete: relationship.onDelete || 'CASCADE',
      onUpdate: relationship.onUpdate || 'CASCADE'
    });
  };

  const handleDelete = (relationshipId: string) => {
    if (confirm('Are you sure you want to delete this relationship?')) {
      onDeleteRelationship?.(relationshipId);
      toast.success('Relationship deleted successfully');
    }
  };

  const sourceTable = tables.find(t => t.id === formData.sourceTableId);
  const targetTable = tables.find(t => t.id === formData.targetTableId);

  const getRelationshipIcon = (type: RelationshipType) => {
    switch (type) {
      case 'one-to-one': return '1:1';
      case 'one-to-many': return '1:M';
      case 'many-to-one': return 'M:1';
      case 'many-to-many': return 'M:M';
      default: return '1:M';
    }
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Link className="h-4 w-4 mr-1" />
            Add Relationship
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRelationship ? 'Edit Relationship' : 'Create Relationship'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6">
          {/* Relationship Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sourceTable">Source Table</Label>
                <Select
                  value={formData.sourceTableId}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    sourceTableId: value, 
                    sourceFieldId: '' 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetTable">Target Table</Label>
                <Select
                  value={formData.targetTableId}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    targetTableId: value, 
                    targetFieldId: '' 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sourceField">Source Field</Label>
                <Select
                  value={formData.sourceFieldId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sourceFieldId: value }))}
                  disabled={!sourceTable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source field" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceTable?.fields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} ({field.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetField">Target Field</Label>
                <Select
                  value={formData.targetFieldId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetFieldId: value }))}
                  disabled={!targetTable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target field" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetTable?.fields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} ({field.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="type">Relationship Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: RelationshipType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-to-one">One to One (1:1)</SelectItem>
                  <SelectItem value="one-to-many">One to Many (1:M)</SelectItem>
                  <SelectItem value="many-to-one">Many to One (M:1)</SelectItem>
                  <SelectItem value="many-to-many">Many to Many (M:M)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Relationship Name (Optional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., fk_user_posts"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="onDelete">On Delete</Label>
                <Select
                  value={formData.onDelete}
                  onValueChange={(value: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION') => 
                    setFormData(prev => ({ ...prev, onDelete: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASCADE">CASCADE</SelectItem>
                    <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                    <SelectItem value="SET NULL">SET NULL</SelectItem>
                    <SelectItem value="NO ACTION">NO ACTION</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="onUpdate">On Update</Label>
                <Select
                  value={formData.onUpdate}
                  onValueChange={(value: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION') => 
                    setFormData(prev => ({ ...prev, onUpdate: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASCADE">CASCADE</SelectItem>
                    <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                    <SelectItem value="SET NULL">SET NULL</SelectItem>
                    <SelectItem value="NO ACTION">NO ACTION</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Existing Relationships */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Existing Relationships</h4>
              <Badge variant="outline">{existingRelationships.length}</Badge>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {existingRelationships.map((relationship) => {
                const sourceTable = tables.find(t => t.id === relationship.sourceTableId);
                const targetTable = tables.find(t => t.id === relationship.targetTableId);
                const sourceField = sourceTable?.fields.find(f => f.id === relationship.sourceFieldId);
                const targetField = targetTable?.fields.find(f => f.id === relationship.targetFieldId);

                return (
                  <Card key={relationship.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">{sourceTable?.name}</span>
                          <span className="text-gray-500">({sourceField?.name})</span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-medium">{targetTable?.name}</span>
                          <span className="text-gray-500">({targetField?.name})</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getRelationshipIcon(relationship.type)}
                          </Badge>
                          {relationship.name && (
                            <Badge variant="secondary" className="text-xs">
                              {relationship.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEdit(relationship)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(relationship.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {existingRelationships.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Link className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No relationships yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            {editingRelationship ? 'Update Relationship' : 'Create Relationship'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
