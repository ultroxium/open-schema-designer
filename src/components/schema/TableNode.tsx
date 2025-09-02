'use client';

import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Key, Link, Table as TableIcon } from 'lucide-react';
import { Table, TableField, PostgreSQLDataType } from '@/types/schema';
import { createNewField } from '@/lib/storage';
import { FieldConstraintsDialog } from './FieldConstraintsDialog';
import { toast } from 'sonner';

interface TableNodeProps {
  data: {
    table: Table;
    onUpdateTable: (table: Table) => void;
    onDeleteTable: (tableId: string) => void;
    highlightedFields: string[];
  };
}

const postgresTypes: PostgreSQLDataType[] = [
  'varchar', 'text', 'int', 'integer', 'bigint', 'smallint', 'serial', 'bigserial',
  'decimal', 'numeric', 'real', 'double precision', 'money', 'boolean', 'bit',
  'date', 'time', 'timestamp', 'timestamptz', 'interval', 'uuid', 'json', 'jsonb',
  'bytea', 'inet', 'cidr', 'macaddr', 'xml'
];

export const TableNode = memo(({ data }: TableNodeProps) => {
  const { table, onUpdateTable, onDeleteTable, highlightedFields } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [tableName, setTableName] = useState(table.name);

  const handleTableNameChange = () => {
    if (tableName.trim() && tableName !== table.name) {
      onUpdateTable({
        ...table,
        name: tableName.trim()
      });
      toast.success('Table renamed successfully');
    }
    setIsEditing(false);
  };

  const handleAddField = () => {
    const newField = createNewField(`field_${table.fields.length}`, 'varchar');
    onUpdateTable({
      ...table,
      fields: [...table.fields, newField]
    });
    toast.success('Field added successfully');
  };

  const handleUpdateField = (fieldId: string, updates: Partial<TableField>) => {
    const updatedFields = table.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onUpdateTable({
      ...table,
      fields: updatedFields
    });
  };

  const handleDeleteField = (fieldId: string) => {
    if (table.fields.length > 1) {
      const updatedFields = table.fields.filter(field => field.id !== fieldId);
      onUpdateTable({
        ...table,
        fields: updatedFields
      });
      toast.success('Field deleted successfully');
    } else {
      toast.error('Cannot delete the last field');
    }
  };

  return (
    <div className="min-w-[280px] relative">      
      <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white relative z-10 border border-gray-200">
        <CardHeader className="pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <Input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                onBlur={handleTableNameChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTableNameChange();
                  if (e.key === 'Escape') {
                    setTableName(table.name);
                    setIsEditing(false);
                  }
                }}
                className="text-lg font-semibold"
                autoFocus
              />
            ) : (
              <h3 
                className="text-lg font-semibold cursor-pointer hover:bg-gray-50 px-2 py-1 rounded flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <TableIcon className="mr-2" />
                {table.name}
              </h3>
            )}
            <Button
              onClick={() => onDeleteTable(table.id)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-1">
            {table.fields.map((field, index) => (
              <div
                key={field.id}
                className={`relative flex items-center space-x-2 p-2 rounded transition-colors group ${index === table.fields.length - 1 ? 'border-b-0' : 'border-b border-gray-200'} ${
                  highlightedFields.includes(field.id) 
                    ? 'bg-blue-100 border border-blue-300 ' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Left connection handle for this field */}
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${table.id}-${field.id}-target`}
                  isConnectable={true}
                  className="!w-2 !h-2 !bg-transparent !border-2 !border-white !rounded-full opacity-70 group-hover:opacity-100 hover:!opacity-100 transition-all duration-200 cursor-crosshair !absolute !left-[-16px] !top-1/2 !-translate-y-1/2 shadow-lg hover:!bg-blue-600 hover:!border-blue-200 hover:!scale-125 hover:shadow-xl"
                />
                
                {/* Right connection handle for this field */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${table.id}-${field.id}-source`}
                  isConnectable={true}
                  className="!w-2 !h-2 !bg-transparent !border-2 !border-white !rounded-full opacity-70 group-hover:opacity-100 hover:!opacity-100 transition-all duration-200 cursor-crosshair !absolute !right-[-16px] !top-1/2 !-translate-y-1/2 shadow-lg hover:!bg-blue-600 hover:!border-blue-200 hover:!scale-125 hover:shadow-xl"
                />
                
                <div className="flex items-center space-x-1 flex-1 min-w-0">
                  <Input
                    value={field.name}
                    onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                    className="h-7 text-sm flex-1 border-none shadow-none"
                    placeholder="Field name"
                  />
                  {field.primaryKey && <Key className="h-3 w-3 text-yellow-600 flex-shrink-0" />}
                  {field.foreignKey && <Link className="h-3 w-3 text-blue-600 flex-shrink-0" />}
                  {field.unique && !field.primaryKey && <Badge variant="outline" className="text-xs px-1 py-0">UQ</Badge>}
                  {!field.nullable && <Badge variant="destructive" className="text-xs px-1 py-0">NN</Badge>}
                  {field.autoIncrement && <Badge variant="default" className="text-xs px-1 py-0">AI</Badge>}
                  {field.defaultValue && <Badge variant="secondary" className="text-xs px-1 py-0">DEF</Badge>}
                </div>
                
                <Select
                  value={field.type}
                  onValueChange={(value: PostgreSQLDataType) => 
                    handleUpdateField(field.id, { type: value })
                  }
                >
                  <SelectTrigger className="h-7 text-xs w-24 border-none shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {postgresTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-xs">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-1">
                  <FieldConstraintsDialog
                    field={field}
                    onUpdateField={(updates) => handleUpdateField(field.id, updates)}
                    onDeleteField={() => handleDeleteField(field.id)}
                  />
                </div>
              </div>
            ))}
            
            <Button
              onClick={handleAddField}
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs border-dashed border-2 border-gray-300 hover:border-gray-400"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Field
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

TableNode.displayName = 'TableNode';
