import { Schema, Table, TableField, Relationship, PostgreSQLDataType } from '@/types/schema';
import { v4 as uuidv4 } from 'uuid';

// Import from JSON Schema
export function importFromJSON(jsonString: string): Schema {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate and convert the JSON to our schema format
    if (!data.name || !Array.isArray(data.tables)) {
      throw new Error('Invalid schema format');
    }
    
    return {
      id: data.id || uuidv4(),
      name: data.name,
      description: data.description || '',
      tables: data.tables.map((table: any) => ({
        id: table.id || uuidv4(),
        name: table.name,
        fields: table.fields.map((field: any) => ({
          id: field.id || uuidv4(),
          name: field.name,
          type: field.type || 'varchar',
          nullable: field.nullable !== false,
          primaryKey: field.primaryKey || false,
          foreignKey: field.foreignKey || false,
          unique: field.unique || false,
          defaultValue: field.defaultValue,
          length: field.length,
          precision: field.precision,
          scale: field.scale,
          comment: field.comment,
          autoIncrement: field.autoIncrement || false,
          checkConstraint: field.checkConstraint
        })),
        position: table.position || { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        color: table.color || '#f3f4f6'
      })),
      relationships: (data.relationships || []).map((rel: any) => ({
        id: rel.id || uuidv4(),
        sourceTableId: rel.sourceTableId,
        sourceFieldId: rel.sourceFieldId,
        targetTableId: rel.targetTableId,
        targetFieldId: rel.targetFieldId,
        type: rel.type || 'one-to-many',
        name: rel.name,
        onDelete: rel.onDelete || 'CASCADE',
        onUpdate: rel.onUpdate || 'CASCADE'
      })),
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    throw new Error('Failed to parse JSON schema: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Import from SQL DDL (basic implementation)
export function importFromSQL(sqlString: string): Schema {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];
  
  // Basic SQL parsing - this is a simplified implementation
  const createTableRegex = /CREATE TABLE\s+`?(\w+)`?\s*\(([\s\S]*?)\);/gi;
  const fieldRegex = /`?(\w+)`?\s+(\w+(?:\(\d+(?:,\d+)?\))?)\s*(.*?)(?:,|\n|$)/g;
  
  let match;
  while ((match = createTableRegex.exec(sqlString)) !== null) {
    const tableName = match[1];
    const fieldsSection = match[2];
    
    const fields: TableField[] = [];
    let fieldMatch;
    
    while ((fieldMatch = fieldRegex.exec(fieldsSection)) !== null) {
      const fieldName = fieldMatch[1];
      const fieldType = fieldMatch[2].toLowerCase();
      const constraints = fieldMatch[3].toLowerCase();
      
      const field: TableField = {
        id: uuidv4(),
        name: fieldName,
        type: convertSQLTypeToPostgreSQL(fieldType),
        nullable: !constraints.includes('not null'),
        primaryKey: constraints.includes('primary key'),
        foreignKey: constraints.includes('foreign key'),
        unique: constraints.includes('unique'),
        autoIncrement: constraints.includes('auto_increment'),
        defaultValue: extractDefaultValue(constraints)
      };
      
      fields.push(field);
    }
    
    const table: Table = {
      id: uuidv4(),
      name: tableName,
      fields,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      color: '#f3f4f6'
    };
    
    tables.push(table);
  }
  
  // Extract foreign key relationships (simplified)
  const fkRegex = /FOREIGN KEY\s*\(`?(\w+)`?\)\s*REFERENCES\s*`?(\w+)`?\s*\(`?(\w+)`?\)/gi;
  let fkMatch;
  
  while ((fkMatch = fkRegex.exec(sqlString)) !== null) {
    const sourceField = fkMatch[1];
    const targetTable = fkMatch[2];
    const targetField = fkMatch[3];
    
    // Find the tables and fields
    const sourceTable = tables.find(t => 
      t.fields.some(f => f.name === sourceField)
    );
    const targetTableObj = tables.find(t => t.name === targetTable);
    
    if (sourceTable && targetTableObj) {
      const sourceFieldObj = sourceTable.fields.find(f => f.name === sourceField);
      const targetFieldObj = targetTableObj.fields.find(f => f.name === targetField);
      
      if (sourceFieldObj && targetFieldObj) {
        const relationship: Relationship = {
          id: uuidv4(),
          sourceTableId: sourceTable.id,
          sourceFieldId: sourceFieldObj.id,
          targetTableId: targetTableObj.id,
          targetFieldId: targetFieldObj.id,
          type: 'many-to-one',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        };
        
        relationships.push(relationship);
        sourceFieldObj.foreignKey = true;
      }
    }
  }
  
  return {
    id: uuidv4(),
    name: 'Imported Schema',
    description: 'Imported from SQL DDL',
    tables,
    relationships,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Database connection and introspection
export async function importFromDatabase(connectionConfig: {
  type: 'postgresql' | 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}): Promise<Schema> {
  // This would require server-side implementation
  // For now, we'll throw an error indicating this needs backend support
  throw new Error('Database import requires server-side implementation');
}

// Import from Prisma schema
export function importFromPrisma(prismaString: string): Schema {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];
  
  // Parse Prisma models
  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let match;
  
  while ((match = modelRegex.exec(prismaString)) !== null) {
    const modelName = match[1];
    const fieldsSection = match[2];
    
    const fields: TableField[] = [];
    const fieldLines = fieldsSection.split('\n').filter(line => line.trim() && !line.trim().startsWith('@@'));
    
    fieldLines.forEach(line => {
      const fieldMatch = line.trim().match(/(\w+)\s+(\w+)(\?)?(.*)$/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const fieldType = fieldMatch[2];
        const isOptional = !!fieldMatch[3];
        const attributes = fieldMatch[4] || '';
        
        const field: TableField = {
          id: uuidv4(),
          name: fieldName,
          type: convertPrismaTypeToPostgreSQL(fieldType),
          nullable: isOptional,
          primaryKey: attributes.includes('@id'),
          foreignKey: false, // Will be set when processing relationships
          unique: attributes.includes('@unique'),
          autoIncrement: attributes.includes('@default(autoincrement())'),
          defaultValue: extractPrismaDefaultValue(attributes)
        };
        
        fields.push(field);
      }
    });
    
    const table: Table = {
      id: uuidv4(),
      name: toSnakeCase(modelName),
      fields,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      color: '#f3f4f6'
    };
    
    tables.push(table);
  }
  
  return {
    id: uuidv4(),
    name: 'Imported from Prisma',
    description: 'Schema imported from Prisma file',
    tables,
    relationships,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Helper functions
function convertSQLTypeToPostgreSQL(sqlType: string): PostgreSQLDataType {
  const typeMap: Record<string, PostgreSQLDataType> = {
    'varchar': 'varchar',
    'char': 'character',
    'text': 'text',
    'int': 'integer',
    'integer': 'integer',
    'bigint': 'bigint',
    'smallint': 'smallint',
    'decimal': 'decimal',
    'numeric': 'numeric',
    'real': 'real',
    'double': 'double precision',
    'float': 'real',
    'boolean': 'boolean',
    'bool': 'boolean',
    'date': 'date',
    'datetime': 'timestamp',
    'timestamp': 'timestamp',
    'time': 'time',
    'json': 'json',
    'uuid': 'uuid'
  };
  
  const baseType = sqlType.split('(')[0].toLowerCase();
  return typeMap[baseType] || 'varchar';
}

function convertPrismaTypeToPostgreSQL(prismaType: string): PostgreSQLDataType {
  const typeMap: Record<string, PostgreSQLDataType> = {
    'String': 'varchar',
    'Int': 'integer',
    'BigInt': 'bigint',
    'Float': 'real',
    'Decimal': 'decimal',
    'Boolean': 'boolean',
    'DateTime': 'timestamp',
    'Json': 'json',
    'Bytes': 'bytea'
  };
  
  return typeMap[prismaType] || 'varchar';
}

function extractDefaultValue(constraints: string): string | undefined {
  const defaultMatch = constraints.match(/default\s+['"]?([^'",\s]+)['"]?/i);
  return defaultMatch ? defaultMatch[1] : undefined;
}

function extractPrismaDefaultValue(attributes: string): string | undefined {
  const defaultMatch = attributes.match(/@default\(([^)]+)\)/);
  if (defaultMatch) {
    const value = defaultMatch[1];
    if (value === 'now()') return 'CURRENT_TIMESTAMP';
    if (value === 'uuid()') return 'uuid_generate_v4()';
    if (value === 'autoincrement()') return undefined; // Handled by autoIncrement flag
    return value.replace(/['"]/g, '');
  }
  return undefined;
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
}
