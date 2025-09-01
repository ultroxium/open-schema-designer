import { Schema, Table, TableField, Relationship } from '@/types/schema';
import { v4 as uuidv4 } from 'uuid';

export function createSampleECommerceSchema(): Schema {
  // Create tables
  const usersTable: Table = {
    id: uuidv4(),
    name: 'users',
    position: { x: 100, y: 100 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'full_name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: uuidv4(), name: 'email', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 255 },
      { id: uuidv4(), name: 'gender', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 10 },
      { id: uuidv4(), name: 'date_of_birth', type: 'date', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'country_code', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 2 },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const countriesTable: Table = {
    id: uuidv4(),
    name: 'countries',
    position: { x: 100, y: 600 },
    fields: [
      { id: uuidv4(), name: 'code', type: 'varchar', nullable: false, primaryKey: true, foreignKey: false, unique: true, length: 2 },
      { id: uuidv4(), name: 'name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 100 },
      { id: uuidv4(), name: 'continent_name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 50 },
      { id: uuidv4(), name: 'currency', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 10 }
    ]
  };

  const ordersTable: Table = {
    id: uuidv4(),
    name: 'orders',
    position: { x: 500, y: 100 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'user_id', type: 'uuid', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'status', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 20 },
      { id: uuidv4(), name: 'total_amount', type: 'decimal', nullable: false, primaryKey: false, foreignKey: false, unique: false, precision: 10, scale: 2 },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const orderItemsTable: Table = {
    id: uuidv4(),
    name: 'order_items',
    position: { x: 900, y: 100 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'order_id', type: 'int', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'product_id', type: 'int', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'quantity', type: 'int', nullable: false, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'unit_price', type: 'decimal', nullable: false, primaryKey: false, foreignKey: false, unique: false, precision: 8, scale: 2 }
    ]
  };

  const productsTable: Table = {
    id: uuidv4(),
    name: 'products',
    position: { x: 500, y: 400 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'merchant_id', type: 'int', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: uuidv4(), name: 'description', type: 'text', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'price', type: 'decimal', nullable: false, primaryKey: false, foreignKey: false, unique: false, precision: 8, scale: 2 },
      { id: uuidv4(), name: 'status', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 20 },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const merchantsTable: Table = {
    id: uuidv4(),
    name: 'merchants',
    position: { x: 900, y: 400 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: uuidv4(), name: 'email', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 255 },
      { id: uuidv4(), name: 'country_code', type: 'varchar', nullable: false, primaryKey: false, foreignKey: true, unique: false, length: 2 },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const tables = [usersTable, countriesTable, ordersTable, orderItemsTable, productsTable, merchantsTable];

  // Create relationships
  const relationships: Relationship[] = [
    {
      id: uuidv4(),
      sourceTableId: ordersTable.id,
      sourceFieldId: ordersTable.fields.find(f => f.name === 'user_id')!.id,
      targetTableId: usersTable.id,
      targetFieldId: usersTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: usersTable.id,
      sourceFieldId: usersTable.fields.find(f => f.name === 'country_code')!.id,
      targetTableId: countriesTable.id,
      targetFieldId: countriesTable.fields.find(f => f.name === 'code')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: orderItemsTable.id,
      sourceFieldId: orderItemsTable.fields.find(f => f.name === 'order_id')!.id,
      targetTableId: ordersTable.id,
      targetFieldId: ordersTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: orderItemsTable.id,
      sourceFieldId: orderItemsTable.fields.find(f => f.name === 'product_id')!.id,
      targetTableId: productsTable.id,
      targetFieldId: productsTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: productsTable.id,
      sourceFieldId: productsTable.fields.find(f => f.name === 'merchant_id')!.id,
      targetTableId: merchantsTable.id,
      targetFieldId: merchantsTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: merchantsTable.id,
      sourceFieldId: merchantsTable.fields.find(f => f.name === 'country_code')!.id,
      targetTableId: countriesTable.id,
      targetFieldId: countriesTable.fields.find(f => f.name === 'code')!.id,
      type: 'many-to-one'
    }
  ];

  return {
    id: uuidv4(),
    name: 'E-Commerce Platform',
    description: 'A comprehensive e-commerce database schema with users, products, orders, and merchant management',
    tables,
    relationships,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function createSampleBlogSchema(): Schema {
  // Create tables for a blog system
  const usersTable: Table = {
    id: uuidv4(),
    name: 'users',
    position: { x: 100, y: 100 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'username', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 50 },
      { id: uuidv4(), name: 'email', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 255 },
      { id: uuidv4(), name: 'password_hash', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: uuidv4(), name: 'full_name', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: uuidv4(), name: 'bio', type: 'text', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'avatar_url', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const postsTable: Table = {
    id: uuidv4(),
    name: 'posts',
    position: { x: 500, y: 100 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'author_id', type: 'uuid', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'title', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: uuidv4(), name: 'slug', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 255 },
      { id: uuidv4(), name: 'content', type: 'text', nullable: false, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'excerpt', type: 'text', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'status', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 20 },
      { id: uuidv4(), name: 'published_at', type: 'timestamp', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'updated_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const commentsTable: Table = {
    id: uuidv4(),
    name: 'comments',
    position: { x: 900, y: 100 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'post_id', type: 'uuid', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'author_id', type: 'uuid', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'parent_id', type: 'uuid', nullable: true, primaryKey: false, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'content', type: 'text', nullable: false, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'status', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 20 },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const categoriesTable: Table = {
    id: uuidv4(),
    name: 'categories',
    position: { x: 100, y: 400 },
    fields: [
      { id: uuidv4(), name: 'id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: uuidv4(), name: 'name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 100 },
      { id: uuidv4(), name: 'slug', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 100 },
      { id: uuidv4(), name: 'description', type: 'text', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const postCategoriesTable: Table = {
    id: uuidv4(),
    name: 'post_categories',
    position: { x: 500, y: 400 },
    fields: [
      { id: uuidv4(), name: 'post_id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'category_id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: true, unique: false },
      { id: uuidv4(), name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const tables = [usersTable, postsTable, commentsTable, categoriesTable, postCategoriesTable];

  // Create relationships
  const relationships: Relationship[] = [
    {
      id: uuidv4(),
      sourceTableId: postsTable.id,
      sourceFieldId: postsTable.fields.find(f => f.name === 'author_id')!.id,
      targetTableId: usersTable.id,
      targetFieldId: usersTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: commentsTable.id,
      sourceFieldId: commentsTable.fields.find(f => f.name === 'post_id')!.id,
      targetTableId: postsTable.id,
      targetFieldId: postsTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: commentsTable.id,
      sourceFieldId: commentsTable.fields.find(f => f.name === 'author_id')!.id,
      targetTableId: usersTable.id,
      targetFieldId: usersTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: commentsTable.id,
      sourceFieldId: commentsTable.fields.find(f => f.name === 'parent_id')!.id,
      targetTableId: commentsTable.id,
      targetFieldId: commentsTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: postCategoriesTable.id,
      sourceFieldId: postCategoriesTable.fields.find(f => f.name === 'post_id')!.id,
      targetTableId: postsTable.id,
      targetFieldId: postsTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: uuidv4(),
      sourceTableId: postCategoriesTable.id,
      sourceFieldId: postCategoriesTable.fields.find(f => f.name === 'category_id')!.id,
      targetTableId: categoriesTable.id,
      targetFieldId: categoriesTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    }
  ];

  return {
    id: uuidv4(),
    name: 'Blog Platform',
    description: 'A complete blog platform schema with users, posts, comments, and categorization',
    tables,
    relationships,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
