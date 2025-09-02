'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TableField, PostgreSQLDataType } from '@/types/schema';
import { toast } from 'sonner';

interface FieldConstraintsDialogProps {
  field: TableField;
  onUpdateField: (updates: Partial<TableField>) => void;
  onDeleteField: () => void;
}

const postgresTypes: PostgreSQLDataType[] = [
  'varchar', 'text', 'int', 'integer', 'bigint', 'smallint', 'serial', 'bigserial',
  'decimal', 'numeric', 'real', 'double precision', 'money', 'boolean', 'bit',
  'date', 'time', 'timestamp', 'timestamptz', 'interval', 'uuid', 'json', 'jsonb',
  'bytea', 'inet', 'cidr', 'macaddr', 'xml'
];

export function FieldConstraintsDialog({ field, onUpdateField, onDeleteField }: FieldConstraintsDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: field.name,
    type: field.type,
    nullable: field.nullable,
    primaryKey: field.primaryKey,
    foreignKey: field.foreignKey,
    unique: field.unique,
    autoIncrement: field.autoIncrement || false,
    defaultValue: field.defaultValue || '',
    length: field.length || '',
    precision: field.precision || '',
    scale: field.scale || '',
    comment: field.comment || '',
    checkConstraint: field.checkConstraint || ''
  });

  const handleSave = () => {
    const updates: Partial<TableField> = {
      name: formData.name.trim(),
      type: formData.type,
      nullable: formData.nullable,
      primaryKey: formData.primaryKey,
      foreignKey: formData.foreignKey,
      unique: formData.unique,
      autoIncrement: formData.autoIncrement,
      defaultValue: formData.defaultValue.trim() || undefined,
      length: formData.length ? parseInt(formData.length.toString()) : undefined,
      precision: formData.precision ? parseInt(formData.precision.toString()) : undefined,
      scale: formData.scale ? parseInt(formData.scale.toString()) : undefined,
      comment: formData.comment.trim() || undefined,
      checkConstraint: formData.checkConstraint.trim() || undefined
    };

    onUpdateField(updates);
    setOpen(false);
    toast.success('Field updated successfully');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this field?')) {
      onDeleteField();
      setOpen(false);
      toast.success('Field deleted successfully');
    }
  };

  const resetForm = () => {
    setFormData({
      name: field.name,
      type: field.type,
      nullable: field.nullable,
      primaryKey: field.primaryKey,
      foreignKey: field.foreignKey,
      unique: field.unique,
      autoIncrement: field.autoIncrement || false,
      defaultValue: field.defaultValue || '',
      length: field.length || '',
      precision: field.precision || '',
      scale: field.scale || '',
      comment: field.comment || '',
      checkConstraint: field.checkConstraint || ''
    });
  };

  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, field]);

  const getConstraintBadges = () => {
    const badges = [];
    if (field.primaryKey) badges.push(<Badge key="pk" variant="default" className="text-xs">PK</Badge>);
    if (field.foreignKey) badges.push(<Badge key="fk" variant="secondary" className="text-xs">FK</Badge>);
    if (field.unique && !field.primaryKey) badges.push(<Badge key="unique" variant="outline" className="text-xs">UNIQUE</Badge>);
    if (!field.nullable) badges.push(<Badge key="notnull" variant="destructive" className="text-xs">NOT NULL</Badge>);
    if (field.autoIncrement) badges.push(<Badge key="auto" variant="default" className="text-xs">AUTO</Badge>);
    if (field.defaultValue) badges.push(<Badge key="default" variant="secondary" className="text-xs">DEFAULT</Badge>);
    return badges;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Constraints
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Field
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Field Constraints - {field.name}</DialogTitle>
          <div className="flex flex-wrap gap-1 mt-2">
            {getConstraintBadges()}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Basic Properties */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter field name"
              />
            </div>

            <div>
              <Label htmlFor="type">Data Type</Label>
              <Select value={formData.type} onValueChange={(value: PostgreSQLDataType) => 
                setFormData(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {postgresTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                  placeholder="255"
                />
              </div>
              <div>
                <Label htmlFor="precision">Precision</Label>
                <Input
                  id="precision"
                  type="number"
                  value={formData.precision}
                  onChange={(e) => setFormData(prev => ({ ...prev, precision: e.target.value }))}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="scale">Scale</Label>
                <Input
                  id="scale"
                  type="number"
                  value={formData.scale}
                  onChange={(e) => setFormData(prev => ({ ...prev, scale: e.target.value }))}
                  placeholder="2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                value={formData.defaultValue}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
                placeholder="e.g., 'default_value', now(), uuid_generate_v4()"
              />
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Constraints</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nullable"
                    checked={!formData.nullable}
                    onCheckedChange={(checked: boolean) => 
                      setFormData(prev => ({ ...prev, nullable: !checked }))
                    }
                  />
                  <Label htmlFor="nullable" className="text-sm">NOT NULL</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="primaryKey"
                    checked={formData.primaryKey}
                    onCheckedChange={(checked: boolean) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        primaryKey: !!checked,
                        nullable: checked ? false : prev.nullable,
                        unique: checked ? true : prev.unique
                      }))
                    }
                  />
                  <Label htmlFor="primaryKey" className="text-sm">Primary Key</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unique"
                    checked={formData.unique}
                    onCheckedChange={(checked: boolean) => 
                      setFormData(prev => ({ ...prev, unique: !!checked }))
                    }
                    disabled={formData.primaryKey}
                  />
                  <Label htmlFor="unique" className="text-sm">Unique</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="foreignKey"
                    checked={formData.foreignKey}
                    onCheckedChange={(checked: boolean) => 
                      setFormData(prev => ({ ...prev, foreignKey: !!checked }))
                    }
                  />
                  <Label htmlFor="foreignKey" className="text-sm">Foreign Key</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoIncrement"
                    checked={formData.autoIncrement}
                    onCheckedChange={(checked: boolean) => 
                      setFormData(prev => ({ ...prev, autoIncrement: !!checked }))
                    }
                  />
                  <Label htmlFor="autoIncrement" className="text-sm">Auto Increment</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Field description or comment"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="checkConstraint">Check Constraint</Label>
              <Input
                id="checkConstraint"
                value={formData.checkConstraint}
                onChange={(e) => setFormData(prev => ({ ...prev, checkConstraint: e.target.value }))}
                placeholder="e.g., age > 0, status IN ('active', 'inactive')"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Field
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
