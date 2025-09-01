'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import { Table, Relationship, RelationshipType } from '@/types/schema';
import { createNewRelationship } from '@/lib/storage';

interface RelationshipDialogProps {
  tables: Table[];
  onAddRelationship: (relationship: Relationship) => void;
  children?: React.ReactNode;
}

export function RelationshipDialog({ tables, onAddRelationship, children }: RelationshipDialogProps) {
  const [open, setOpen] = useState(false);
  const [sourceTableId, setSourceTableId] = useState('');
  const [sourceFieldId, setSourceFieldId] = useState('');
  const [targetTableId, setTargetTableId] = useState('');
  const [targetFieldId, setTargetFieldId] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('one-to-many');

  const sourceTable = tables.find(t => t.id === sourceTableId);
  const targetTable = tables.find(t => t.id === targetTableId);

  const handleSubmit = () => {
    if (sourceTableId && sourceFieldId && targetTableId && targetFieldId) {
      const relationship = createNewRelationship(
        sourceTableId,
        sourceFieldId,
        targetTableId,
        targetFieldId
      );
      relationship.type = relationshipType;
      
      onAddRelationship(relationship);
      
      // Reset form
      setSourceTableId('');
      setSourceFieldId('');
      setTargetTableId('');
      setTargetFieldId('');
      setRelationshipType('one-to-many');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Link className="h-4 w-4 mr-1" />
            Add Relationship
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Relationship</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Source Table</Label>
            <Select value={sourceTableId} onValueChange={setSourceTableId}>
              <SelectTrigger className="mt-1">
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

          {sourceTable && (
            <div>
              <Label>Source Field</Label>
              <Select value={sourceFieldId} onValueChange={setSourceFieldId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select source field" />
                </SelectTrigger>
                <SelectContent>
                  {sourceTable.fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name} ({field.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Target Table</Label>
            <Select value={targetTableId} onValueChange={setTargetTableId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select target table" />
              </SelectTrigger>
              <SelectContent>
                {tables.filter(t => t.id !== sourceTableId).map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {targetTable && (
            <div>
              <Label>Target Field</Label>
              <Select value={targetFieldId} onValueChange={setTargetFieldId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select target field" />
                </SelectTrigger>
                <SelectContent>
                  {targetTable.fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name} ({field.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Relationship Type</Label>
            <Select value={relationshipType} onValueChange={(value: RelationshipType) => setRelationshipType(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-to-one">One to One</SelectItem>
                <SelectItem value="one-to-many">One to Many</SelectItem>
                <SelectItem value="many-to-one">Many to One</SelectItem>
                <SelectItem value="many-to-many">Many to Many</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!sourceTableId || !sourceFieldId || !targetTableId || !targetFieldId}
            className="w-full"
          >
            Create Relationship
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
