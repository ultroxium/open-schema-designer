import { Schema, Table, TableField, Relationship } from '@/types/schema';

export function generateSQLFromSchema(schema: Schema): string {
  let sql = `-- ==========================================\n`;
  sql += `-- Database Schema: ${schema.name}\n`;
  if (schema.description) {
    sql += `-- Description: ${schema.description}\n`;
  }
  sql += `-- Generated on: ${new Date().toISOString()}\n`;
  sql += `-- Total Tables: ${schema.tables.length}\n`;
  sql += `-- Total Relationships: ${schema.relationships.length}\n`;
  sql += `-- ==========================================\n\n`;

  // Add database setup commands
  sql += `-- Enable UUID extension for PostgreSQL\n`;
  sql += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;

  // Create tables
  schema.tables.forEach((table, index) => {
    sql += `-- ==========================================\n`;
    sql += `-- Table ${index + 1}: ${table.name}\n`;
    sql += `-- ==========================================\n`;
    sql += `CREATE TABLE ${table.name} (\n`;

    const fieldDefinitions = table.fields.map((field) => {
      let fieldDef = `  ${field.name} ${getPostgreSQLType(field)}`;
      
      if (!field.nullable) {
        fieldDef += ' NOT NULL';
      }
      
      if (field.unique && !field.primaryKey) {
        fieldDef += ' UNIQUE';
      }
      
      if (field.defaultValue) {
        // Handle special default values
        if (field.defaultValue.toLowerCase() === 'now()' || field.defaultValue.toLowerCase() === 'current_timestamp') {
          fieldDef += ` DEFAULT CURRENT_TIMESTAMP`;
        } else if (field.defaultValue.toLowerCase() === 'uuid_generate_v4()') {
          fieldDef += ` DEFAULT uuid_generate_v4()`;
        } else if (field.type === 'boolean') {
          fieldDef += ` DEFAULT ${field.defaultValue.toLowerCase()}`;
        } else if (['int', 'integer', 'bigint', 'smallint', 'decimal', 'numeric', 'real', 'double precision'].includes(field.type)) {
          fieldDef += ` DEFAULT ${field.defaultValue}`;
        } else {
          fieldDef += ` DEFAULT '${field.defaultValue}'`;
        }
      }
      
      return fieldDef;
    });

    sql += fieldDefinitions.join(',\n');

    // Add primary key constraint
    const primaryKeys = table.fields.filter(f => f.primaryKey);
    if (primaryKeys.length > 0) {
      sql += `,\n  CONSTRAINT pk_${table.name} PRIMARY KEY (${primaryKeys.map(f => f.name).join(', ')})`;
    }

    sql += `\n);\n\n`;

    // Add comments for table and fields
    sql += `-- Add table comment\n`;
    sql += `COMMENT ON TABLE ${table.name} IS 'Table for managing ${table.name} data';\n\n`;
    
    table.fields.forEach((field) => {
      if (field.primaryKey) {
        sql += `COMMENT ON COLUMN ${table.name}.${field.name} IS 'Primary key for ${table.name}';\n`;
      } else if (field.foreignKey) {
        sql += `COMMENT ON COLUMN ${table.name}.${field.name} IS 'Foreign key reference';\n`;
      }
    });
    sql += '\n';
  });

  // Add foreign key constraints
  if (schema.relationships.length > 0) {
    sql += `-- ==========================================\n`;
    sql += `-- Foreign Key Constraints\n`;
    sql += `-- ==========================================\n\n`;
    
    schema.relationships.forEach((rel, index) => {
      const sourceTable = schema.tables.find(t => t.id === rel.sourceTableId);
      const targetTable = schema.tables.find(t => t.id === rel.targetTableId);
      const sourceField = sourceTable?.fields.find(f => f.id === rel.sourceFieldId);
      const targetField = targetTable?.fields.find(f => f.id === rel.targetFieldId);

      if (sourceTable && targetTable && sourceField && targetField) {
        sql += `-- Relationship ${index + 1}: ${sourceTable.name}.${sourceField.name} -> ${targetTable.name}.${targetField.name} (${rel.type})\n`;
        sql += `ALTER TABLE ${sourceTable.name} `;
        sql += `ADD CONSTRAINT fk_${sourceTable.name}_${sourceField.name} `;
        sql += `FOREIGN KEY (${sourceField.name}) `;
        sql += `REFERENCES ${targetTable.name}(${targetField.name})`;
        
        // Add cascade options based on relationship type
        if (rel.type === 'one-to-many' || rel.type === 'many-to-one') {
          sql += ` ON DELETE CASCADE ON UPDATE CASCADE`;
        } else {
          sql += ` ON DELETE RESTRICT ON UPDATE CASCADE`;
        }
        sql += `;\n\n`;
      }
    });
  }

  // Add indexes for foreign keys and performance
  if (schema.relationships.length > 0) {
    sql += `-- ==========================================\n`;
    sql += `-- Indexes for Performance\n`;
    sql += `-- ==========================================\n\n`;
    
    schema.relationships.forEach((rel) => {
      const sourceTable = schema.tables.find(t => t.id === rel.sourceTableId);
      const sourceField = sourceTable?.fields.find(f => f.id === rel.sourceFieldId);
      
      if (sourceTable && sourceField) {
        sql += `-- Index for foreign key\n`;
        sql += `CREATE INDEX IF NOT EXISTS idx_${sourceTable.name}_${sourceField.name} `;
        sql += `ON ${sourceTable.name}(${sourceField.name});\n\n`;
      }
    });

    // Add indexes for commonly queried fields
    schema.tables.forEach((table) => {
      const timestampFields = table.fields.filter(f => 
        f.name.includes('created_at') || f.name.includes('updated_at') || f.name.includes('date')
      );
      timestampFields.forEach((field) => {
        sql += `-- Index for timestamp queries\n`;
        sql += `CREATE INDEX IF NOT EXISTS idx_${table.name}_${field.name} `;
        sql += `ON ${table.name}(${field.name});\n\n`;
      });
    });
  }

  // Add sample data insertion templates (commented out)
  sql += `-- ==========================================\n`;
  sql += `-- Sample Data Templates (Uncomment to use)\n`;
  sql += `-- ==========================================\n\n`;
  
  schema.tables.forEach((table) => {
    const nonPrimaryFields = table.fields.filter(f => !f.primaryKey);
    if (nonPrimaryFields.length > 0) {
      sql += `-- INSERT INTO ${table.name} (${nonPrimaryFields.map(f => f.name).join(', ')}) VALUES\n`;
      sql += `--   ('sample_value_1', 'sample_value_2'),\n`;
      sql += `--   ('sample_value_3', 'sample_value_4');\n\n`;
    }
  });

  // Add useful queries templates
  sql += `-- ==========================================\n`;
  sql += `-- Useful Query Templates\n`;
  sql += `-- ==========================================\n\n`;
  
  schema.tables.forEach((table) => {
    sql += `-- Select all from ${table.name}\n`;
    sql += `-- SELECT * FROM ${table.name} ORDER BY created_at DESC LIMIT 10;\n\n`;
  });

  // Add relationship queries
  schema.relationships.forEach((rel) => {
    const sourceTable = schema.tables.find(t => t.id === rel.sourceTableId);
    const targetTable = schema.tables.find(t => t.id === rel.targetTableId);
    const sourceField = sourceTable?.fields.find(f => f.id === rel.sourceFieldId);
    const targetField = targetTable?.fields.find(f => f.id === rel.targetFieldId);

    if (sourceTable && targetTable && sourceField && targetField) {
      sql += `-- Join ${sourceTable.name} with ${targetTable.name}\n`;
      sql += `-- SELECT s.*, t.* FROM ${sourceTable.name} s\n`;
      sql += `--   JOIN ${targetTable.name} t ON s.${sourceField.name} = t.${targetField.name};\n\n`;
    }
  });

  sql += `-- ==========================================\n`;
  sql += `-- End of Schema\n`;
  sql += `-- ==========================================\n`;

  return sql;
}

function getPostgreSQLType(field: TableField): string {
  let type = field.type;
  
  if (field.length && (type === 'varchar' || type === 'character varying')) {
    type += `(${field.length})`;
  } else if (field.precision && field.scale && type === 'numeric') {
    type += `(${field.precision}, ${field.scale})`;
  } else if (field.precision && type === 'decimal') {
    type += `(${field.precision}${field.scale ? `, ${field.scale}` : ''})`;
  }
  
  return type;
}

export function generatePrismaSchema(schema: Schema): string {
  let prisma = `// Schema: ${schema.name}\n`;
  if (schema.description) {
    prisma += `// ${schema.description}\n`;
  }
  prisma += `// Generated on: ${new Date().toISOString()}\n\n`;

  prisma += `generator client {\n`;
  prisma += `  provider = "prisma-client-js"\n`;
  prisma += `}\n\n`;

  prisma += `datasource db {\n`;
  prisma += `  provider = "postgresql"\n`;
  prisma += `  url      = env("DATABASE_URL")\n`;
  prisma += `}\n\n`;

  schema.tables.forEach((table) => {
    prisma += `model ${capitalizeFirst(table.name)} {\n`;
    
    table.fields.forEach((field) => {
      const prismaType = getPrismaType(field);
      const optional = field.nullable ? '?' : '';
      const attributes = getPrismaAttributes(field);
      
      prisma += `  ${field.name} ${prismaType}${optional}${attributes}\n`;
    });

    // Add relationships
    const relationships = schema.relationships.filter(
      rel => rel.sourceTableId === table.id || rel.targetTableId === table.id
    );
    
    relationships.forEach((rel) => {
      if (rel.sourceTableId === table.id) {
        const targetTable = schema.tables.find(t => t.id === rel.targetTableId);
        if (targetTable) {
          prisma += `  ${targetTable.name.toLowerCase()} ${capitalizeFirst(targetTable.name)}?\n`;
        }
      }
    });

    prisma += `}\n\n`;
  });

  return prisma;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getPrismaType(field: TableField): string {
  const typeMap: Record<string, string> = {
    'varchar': 'String',
    'text': 'String',
    'int': 'Int',
    'integer': 'Int',
    'bigint': 'BigInt',
    'smallint': 'Int',
    'decimal': 'Decimal',
    'numeric': 'Decimal',
    'real': 'Float',
    'double precision': 'Float',
    'boolean': 'Boolean',
    'date': 'DateTime',
    'timestamp': 'DateTime',
    'timestamptz': 'DateTime',
    'uuid': 'String',
    'json': 'Json',
    'jsonb': 'Json'
  };
  
  return typeMap[field.type] || 'String';
}

function getPrismaAttributes(field: TableField): string {
  let attributes = '';
  
  if (field.primaryKey) {
    attributes += ' @id';
    if (field.type === 'uuid') {
      attributes += ' @default(uuid())';
    } else if (field.type === 'serial' || field.type === 'bigserial') {
      attributes += ' @default(autoincrement())';
    }
  }
  
  if (field.unique && !field.primaryKey) {
    attributes += ' @unique';
  }
  
  if (field.defaultValue && !field.primaryKey) {
    if (field.defaultValue.toLowerCase() === 'now()') {
      attributes += ' @default(now())';
    } else if (field.type === 'boolean') {
      attributes += ` @default(${field.defaultValue.toLowerCase()})`;
    } else {
      attributes += ` @default("${field.defaultValue}")`;
    }
  }
  
  return attributes;
}
