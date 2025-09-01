export type PostgreSQLDataType = 
  | 'bigint' | 'bigserial' | 'bit' | 'bit varying' | 'boolean' | 'box' | 'bytea'
  | 'character' | 'character varying' | 'cidr' | 'circle' | 'date' | 'double precision'
  | 'inet' | 'integer' | 'interval' | 'json' | 'jsonb' | 'line' | 'lseg' | 'macaddr'
  | 'macaddr8' | 'money' | 'numeric' | 'path' | 'pg_lsn' | 'pg_snapshot' | 'point'
  | 'polygon' | 'real' | 'smallint' | 'smallserial' | 'serial' | 'text' | 'time'
  | 'timestamp' | 'timestamptz' | 'timetz' | 'tsquery' | 'tsvector' | 'txid_snapshot'
  | 'uuid' | 'xml' | 'decimal' | 'varchar' | 'int' | 'float';

export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';

export interface TableField {
  id: string;
  name: string;
  type: PostgreSQLDataType;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey: boolean;
  unique: boolean;
  defaultValue?: string;
  length?: number;
  precision?: number;
  scale?: number;
}

export interface Table {
  id: string;
  name: string;
  fields: TableField[];
  position: { x: number; y: number };
  color?: string;
}

export interface Relationship {
  id: string;
  sourceTableId: string;
  sourceFieldId: string;
  targetTableId: string;
  targetFieldId: string;
  type: RelationshipType;
  name?: string;
}

export interface Schema {
  id: string;
  name: string;
  description?: string;
  tables: Table[];
  relationships: Relationship[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  currentSchema: Schema | null;
  schemas: Schema[];
}
