import { Schema, Table, TableField, Relationship } from '@/types/schema';

// MySQL DDL Generator
export function generateMySQLFromSchema(schema: Schema): string {
  let sql = `-- ==========================================\n`;
  sql += `-- MySQL Schema: ${schema.name}\n`;
  if (schema.description) {
    sql += `-- Description: ${schema.description}\n`;
  }
  sql += `-- Generated on: ${new Date().toISOString()}\n`;
  sql += `-- ==========================================\n\n`;

  sql += `-- Create database\n`;
  sql += `CREATE DATABASE IF NOT EXISTS \`${schema.name.toLowerCase().replace(/\s+/g, '_')}\`;\n`;
  sql += `USE \`${schema.name.toLowerCase().replace(/\s+/g, '_')}\`;\n\n`;

  // Create tables
  schema.tables.forEach((table, index) => {
    sql += `-- Table ${index + 1}: ${table.name}\n`;
    sql += `CREATE TABLE \`${table.name}\` (\n`;

    const fieldDefinitions = table.fields.map((field) => {
      let fieldDef = `  \`${field.name}\` ${getMySQLType(field)}`;
      
      if (!field.nullable) {
        fieldDef += ' NOT NULL';
      }
      
      if (field.autoIncrement) {
        fieldDef += ' AUTO_INCREMENT';
      }
      
      if (field.defaultValue) {
        if (field.defaultValue.toLowerCase() === 'now()' || field.defaultValue.toLowerCase() === 'current_timestamp') {
          fieldDef += ` DEFAULT CURRENT_TIMESTAMP`;
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
      sql += `,\n  PRIMARY KEY (${primaryKeys.map(f => `\`${f.name}\``).join(', ')})`;
    }

    // Add unique constraints
    table.fields.filter(f => f.unique && !f.primaryKey).forEach(field => {
      sql += `,\n  UNIQUE KEY \`uk_${table.name}_${field.name}\` (\`${field.name}\`)`;
    });

    sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
  });

  // Add foreign key constraints
  if (schema.relationships.length > 0) {
    sql += `-- Foreign Key Constraints\n`;
    schema.relationships.forEach((rel) => {
      const sourceTable = schema.tables.find(t => t.id === rel.sourceTableId);
      const targetTable = schema.tables.find(t => t.id === rel.targetTableId);
      const sourceField = sourceTable?.fields.find(f => f.id === rel.sourceFieldId);
      const targetField = targetTable?.fields.find(f => f.id === rel.targetFieldId);

      if (sourceTable && targetTable && sourceField && targetField) {
        sql += `ALTER TABLE \`${sourceTable.name}\` `;
        sql += `ADD CONSTRAINT \`fk_${sourceTable.name}_${sourceField.name}\` `;
        sql += `FOREIGN KEY (\`${sourceField.name}\`) `;
        sql += `REFERENCES \`${targetTable.name}\`(\`${targetField.name}\`)`;
        
        if (rel.onDelete) {
          sql += ` ON DELETE ${rel.onDelete}`;
        }
        if (rel.onUpdate) {
          sql += ` ON UPDATE ${rel.onUpdate}`;
        }
        sql += `;\n`;
      }
    });
  }

  return sql;
}

function getMySQLType(field: TableField): string {
  const typeMap: Record<string, string> = {
    'varchar': field.length ? `VARCHAR(${field.length})` : 'VARCHAR(255)',
    'text': 'TEXT',
    'int': 'INT',
    'integer': 'INT',
    'bigint': 'BIGINT',
    'smallint': 'SMALLINT',
    'decimal': field.precision ? `DECIMAL(${field.precision}${field.scale ? `,${field.scale}` : ''})` : 'DECIMAL(10,2)',
    'numeric': field.precision ? `DECIMAL(${field.precision}${field.scale ? `,${field.scale}` : ''})` : 'DECIMAL(10,2)',
    'real': 'FLOAT',
    'double precision': 'DOUBLE',
    'boolean': 'BOOLEAN',
    'date': 'DATE',
    'timestamp': 'TIMESTAMP',
    'timestamptz': 'TIMESTAMP',
    'time': 'TIME',
    'uuid': 'CHAR(36)',
    'json': 'JSON',
    'jsonb': 'JSON'
  };
  
  return typeMap[field.type] || 'VARCHAR(255)';
}

// TypeORM Entity Generator
export function generateTypeORMEntities(schema: Schema): string {
  let code = `// TypeORM Entities for ${schema.name}\n`;
  code += `// Generated on: ${new Date().toISOString()}\n\n`;
  
  code += `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';\n\n`;

  schema.tables.forEach((table) => {
    const className = capitalizeFirst(toCamelCase(table.name));
    
    code += `@Entity('${table.name}')\n`;
    code += `export class ${className} {\n`;
    
    table.fields.forEach((field) => {
      if (field.primaryKey && field.autoIncrement) {
        code += `  @PrimaryGeneratedColumn()\n`;
      } else if (field.primaryKey) {
        code += `  @PrimaryGeneratedColumn('uuid')\n`;
      } else {
        const columnOptions = [];
        
        if (!field.nullable) columnOptions.push('nullable: false');
        if (field.unique) columnOptions.push('unique: true');
        if (field.defaultValue) columnOptions.push(`default: '${field.defaultValue}'`);
        if (field.length) columnOptions.push(`length: ${field.length}`);
        
        const optionsStr = columnOptions.length > 0 ? `({ ${columnOptions.join(', ')} })` : '()';
        code += `  @Column${optionsStr}\n`;
      }
      
      const tsType = getTypeScriptType(field);
      const optional = field.nullable ? '?' : '';
      code += `  ${toCamelCase(field.name)}${optional}: ${tsType};\n\n`;
    });
    
    // Add relationships
    const relationships = schema.relationships.filter(
      rel => rel.sourceTableId === table.id || rel.targetTableId === table.id
    );
    
    relationships.forEach((rel) => {
      if (rel.sourceTableId === table.id) {
        const targetTable = schema.tables.find(t => t.id === rel.targetTableId);
        if (targetTable) {
          const targetClass = capitalizeFirst(toCamelCase(targetTable.name));
          const relationName = toCamelCase(targetTable.name);
          
          if (rel.type === 'one-to-many') {
            code += `  @OneToMany(() => ${targetClass}, ${relationName} => ${relationName}.${toCamelCase(table.name)})\n`;
            code += `  ${toCamelCase(targetTable.name)}s?: ${targetClass}[];\n\n`;
          } else if (rel.type === 'many-to-one') {
            code += `  @ManyToOne(() => ${targetClass})\n`;
            code += `  @JoinColumn({ name: '${schema.tables.find(t => t.id === rel.sourceTableId)?.fields.find(f => f.id === rel.sourceFieldId)?.name}' })\n`;
            code += `  ${relationName}?: ${targetClass};\n\n`;
          }
        }
      }
    });
    
    code += `  @CreateDateColumn()\n`;
    code += `  createdAt?: Date;\n\n`;
    
    code += `  @UpdateDateColumn()\n`;
    code += `  updatedAt?: Date;\n`;
    
    code += `}\n\n`;
  });

  return code;
}

// Django Models Generator
export function generateDjangoModels(schema: Schema): string {
  let code = `# Django Models for ${schema.name}\n`;
  code += `# Generated on: ${new Date().toISOString()}\n\n`;
  
  code += `from django.db import models\n`;
  code += `import uuid\n\n`;

  schema.tables.forEach((table) => {
    const className = capitalizeFirst(toCamelCase(table.name));
    
    code += `class ${className}(models.Model):\n`;
    
    table.fields.forEach((field) => {
      const fieldType = getDjangoFieldType(field);
      const fieldOptions = [];
      
      if (field.primaryKey) {
        if (field.type === 'uuid') {
          fieldOptions.push('primary_key=True');
          fieldOptions.push('default=uuid.uuid4');
          fieldOptions.push('editable=False');
        } else {
          fieldOptions.push('primary_key=True');
        }
      }
      
      if (field.nullable) fieldOptions.push('null=True');
      if (field.nullable) fieldOptions.push('blank=True');
      if (field.unique && !field.primaryKey) fieldOptions.push('unique=True');
      if (field.defaultValue && !field.primaryKey) fieldOptions.push(`default='${field.defaultValue}'`);
      if (field.length && field.type === 'varchar') fieldOptions.push(`max_length=${field.length}`);
      
      const optionsStr = fieldOptions.length > 0 ? `, ${fieldOptions.join(', ')}` : '';
      code += `    ${toSnakeCase(field.name)} = models.${fieldType}(${optionsStr.slice(2)})\n`;
    });
    
    code += `\n    class Meta:\n`;
    code += `        db_table = '${table.name}'\n`;
    code += `        verbose_name = '${table.name}'\n`;
    code += `        verbose_name_plural = '${table.name}s'\n\n`;
    
    code += `    def __str__(self):\n`;
    const nameField = table.fields.find(f => f.name.includes('name')) || table.fields[0];
    code += `        return str(self.${toSnakeCase(nameField.name)})\n\n`;
  });

  return code;
}

// Laravel Migration Generator
export function generateLaravelMigrations(schema: Schema): string {
  let code = `<?php\n\n`;
  code += `// Laravel Migrations for ${schema.name}\n`;
  code += `// Generated on: ${new Date().toISOString()}\n\n`;
  
  code += `use Illuminate\\Database\\Migrations\\Migration;\n`;
  code += `use Illuminate\\Database\\Schema\\Blueprint;\n`;
  code += `use Illuminate\\Support\\Facades\\Schema;\n\n`;

  schema.tables.forEach((table, index) => {
    const migrationName = `Create${capitalizeFirst(toCamelCase(table.name))}Table`;
    const timestamp = new Date(Date.now() + index * 1000).toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    
    code += `class ${migrationName} extends Migration\n{\n`;
    code += `    public function up()\n    {\n`;
    code += `        Schema::create('${table.name}', function (Blueprint $table) {\n`;
    
    table.fields.forEach((field) => {
      const laravelType = getLaravelFieldType(field);
      let fieldDef = `            $table->${laravelType}('${field.name}')`;
      
      if (field.nullable) fieldDef += '->nullable()';
      if (field.unique && !field.primaryKey) fieldDef += '->unique()';
      if (field.defaultValue) fieldDef += `->default('${field.defaultValue}')`;
      
      fieldDef += ';';
      code += `${fieldDef}\n`;
    });
    
    code += `            $table->timestamps();\n`;
    code += `        });\n`;
    code += `    }\n\n`;
    
    code += `    public function down()\n    {\n`;
    code += `        Schema::dropIfExists('${table.name}');\n`;
    code += `    }\n`;
    code += `}\n\n`;
  });

  return code;
}

// Helper functions
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/_(.)/g, (_, letter) => letter.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
}

function getTypeScriptType(field: TableField): string {
  const typeMap: Record<string, string> = {
    'varchar': 'string',
    'text': 'string',
    'int': 'number',
    'integer': 'number',
    'bigint': 'number',
    'smallint': 'number',
    'decimal': 'number',
    'numeric': 'number',
    'real': 'number',
    'double precision': 'number',
    'boolean': 'boolean',
    'date': 'Date',
    'timestamp': 'Date',
    'timestamptz': 'Date',
    'time': 'string',
    'uuid': 'string',
    'json': 'object',
    'jsonb': 'object'
  };
  
  return typeMap[field.type] || 'string';
}

function getDjangoFieldType(field: TableField): string {
  const typeMap: Record<string, string> = {
    'varchar': 'CharField',
    'text': 'TextField',
    'int': 'IntegerField',
    'integer': 'IntegerField',
    'bigint': 'BigIntegerField',
    'smallint': 'SmallIntegerField',
    'decimal': 'DecimalField',
    'numeric': 'DecimalField',
    'real': 'FloatField',
    'double precision': 'FloatField',
    'boolean': 'BooleanField',
    'date': 'DateField',
    'timestamp': 'DateTimeField',
    'timestamptz': 'DateTimeField',
    'time': 'TimeField',
    'uuid': 'UUIDField',
    'json': 'JSONField',
    'jsonb': 'JSONField'
  };
  
  return typeMap[field.type] || 'CharField';
}

function getLaravelFieldType(field: TableField): string {
  if (field.primaryKey) {
    if (field.type === 'uuid') return 'uuid';
    if (field.autoIncrement) return 'id';
    return 'primary';
  }
  
  const typeMap: Record<string, string> = {
    'varchar': 'string',
    'text': 'text',
    'int': 'integer',
    'integer': 'integer',
    'bigint': 'bigInteger',
    'smallint': 'smallInteger',
    'decimal': 'decimal',
    'numeric': 'decimal',
    'real': 'float',
    'double precision': 'double',
    'boolean': 'boolean',
    'date': 'date',
    'timestamp': 'timestamp',
    'timestamptz': 'timestamp',
    'time': 'time',
    'uuid': 'uuid',
    'json': 'json',
    'jsonb': 'json'
  };
  
  return typeMap[field.type] || 'string';
}
