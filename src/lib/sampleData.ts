import { Schema, Table, TableField, Relationship } from '@/types/schema';
import { v4 as uuidv4 } from 'uuid';

// Fixed IDs for sample schemas to prevent duplicates
const SAMPLE_ECOMMERCE_ID = 'sample-ecommerce-schema';
const SAMPLE_BLOG_ID = 'sample-blog-schema';

export function createSampleECommerceSchema(): Schema {
  // Create tables with fixed IDs for sample data
  const usersTable: Table = {
    id: 'users-table-id',
    name: 'users',
    position: { x: -210, y: 435 },
    fields: [
      { id: 'users-id-field', name: 'id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: 'users-name-field', name: 'full_name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: 'users-email-field', name: 'email', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 255 },
      { id: 'users-gender-field', name: 'gender', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 10 },
      { id: 'users-dob-field', name: 'date_of_birth', type: 'date', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: 'users-country-field', name: 'country_code', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 2 },
      { id: 'users-created-field', name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const countriesTable: Table = {
    id: 'countries-table-id',
    name: 'countries',
    position: { x: -30, y: 1170 },
    fields: [
      { id: 'countries-code-field', name: 'code', type: 'varchar', nullable: false, primaryKey: true, foreignKey: false, unique: true, length: 2 },
      { id: 'countries-name-field', name: 'name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 100 },
      { id: 'countries-continent-field', name: 'continent_name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 50 },
      { id: 'countries-currency-field', name: 'currency', type: 'varchar', nullable: true, primaryKey: false, foreignKey: false, unique: false, length: 10 }
    ]
  };

  const ordersTable: Table = {
    id: 'orders-table-id',
    name: 'orders',
    position: { x: 375, y: 105 },
    fields: [
      { id: 'orders-id-field', name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: 'orders-user-field', name: 'user_id', type: 'uuid', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: 'orders-status-field', name: 'status', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 20 },
      { id: 'orders-amount-field', name: 'total_amount', type: 'decimal', nullable: false, primaryKey: false, foreignKey: false, unique: false, precision: 10, scale: 2 },
      { id: 'orders-created-field', name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const orderItemsTable: Table = {
    id: 'order-items-table-id',
    name: 'order_items',
    position: { x: 1230, y: 300 },
    fields: [
      { id: 'order-items-id-field', name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: 'order-items-order-field', name: 'order_id', type: 'int', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: 'order-items-product-field', name: 'product_id', type: 'int', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: 'order-items-quantity-field', name: 'quantity', type: 'int', nullable: false, primaryKey: false, foreignKey: false, unique: false },
      { id: 'order-items-price-field', name: 'unit_price', type: 'decimal', nullable: false, primaryKey: false, foreignKey: false, unique: false, precision: 8, scale: 2 }
    ]
  };

  const productsTable: Table = {
    id: 'products-table-id',
    name: 'products',
    position: { x: 525, y: 795 },
    fields: [
      { id: 'products-id-field', name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: 'products-merchant-field', name: 'merchant_id', type: 'int', nullable: false, primaryKey: false, foreignKey: true, unique: false },
      { id: 'products-name-field', name: 'name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: 'products-desc-field', name: 'description', type: 'text', nullable: true, primaryKey: false, foreignKey: false, unique: false },
      { id: 'products-price-field', name: 'price', type: 'decimal', nullable: false, primaryKey: false, foreignKey: false, unique: false, precision: 8, scale: 2 },
      { id: 'products-status-field', name: 'status', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 20 },
      { id: 'products-created-field', name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const merchantsTable: Table = {
    id: 'merchants-table-id',
    name: 'merchants',
    position: { x: 1350, y: 870 },
    fields: [
      { id: 'merchants-id-field', name: 'id', type: 'int', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: 'merchants-name-field', name: 'name', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: false, length: 255 },
      { id: 'merchants-email-field', name: 'email', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 255 },
      { id: 'merchants-country-field', name: 'country_code', type: 'varchar', nullable: false, primaryKey: false, foreignKey: true, unique: false, length: 2 },
      { id: 'merchants-created-field', name: 'created_at', type: 'timestamp', nullable: false, primaryKey: false, foreignKey: false, unique: false }
    ]
  };

  const tables = [usersTable, countriesTable, ordersTable, orderItemsTable, productsTable, merchantsTable];

  // Create relationships with fixed IDs
  const relationships: Relationship[] = [
    {
      id: 'rel-orders-users',
      sourceTableId: ordersTable.id,
      sourceFieldId: ordersTable.fields.find(f => f.name === 'user_id')!.id,
      targetTableId: usersTable.id,
      targetFieldId: usersTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: 'rel-users-countries',
      sourceTableId: usersTable.id,
      sourceFieldId: usersTable.fields.find(f => f.name === 'country_code')!.id,
      targetTableId: countriesTable.id,
      targetFieldId: countriesTable.fields.find(f => f.name === 'code')!.id,
      type: 'many-to-one'
    },
    {
      id: 'rel-order-items-orders',
      sourceTableId: orderItemsTable.id,
      sourceFieldId: orderItemsTable.fields.find(f => f.name === 'order_id')!.id,
      targetTableId: ordersTable.id,
      targetFieldId: ordersTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: 'rel-order-items-products',
      sourceTableId: orderItemsTable.id,
      sourceFieldId: orderItemsTable.fields.find(f => f.name === 'product_id')!.id,
      targetTableId: productsTable.id,
      targetFieldId: productsTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: 'rel-products-merchants',
      sourceTableId: productsTable.id,
      sourceFieldId: productsTable.fields.find(f => f.name === 'merchant_id')!.id,
      targetTableId: merchantsTable.id,
      targetFieldId: merchantsTable.fields.find(f => f.name === 'id')!.id,
      type: 'many-to-one'
    },
    {
      id: 'rel-merchants-countries',
      sourceTableId: merchantsTable.id,
      sourceFieldId: merchantsTable.fields.find(f => f.name === 'country_code')!.id,
      targetTableId: countriesTable.id,
      targetFieldId: countriesTable.fields.find(f => f.name === 'code')!.id,
      type: 'many-to-one'
    }
  ];

  return {
    id: SAMPLE_ECOMMERCE_ID,
    name: 'E-Commerce Platform',
    description: 'A comprehensive e-commerce database schema with users, products, orders, and merchant management',
    tables,
    relationships,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function createSampleBlogSchema(): Schema {
  // Create tables for a blog system with fixed IDs
  const usersTable: Table = {
    id: 'blog-users-table-id',
    name: 'users',
    position: { x: -390, y: 360 },
    fields: [
      { id: 'blog-users-id-field', name: 'id', type: 'uuid', nullable: false, primaryKey: true, foreignKey: false, unique: true },
      { id: 'blog-users-username-field', name: 'username', type: 'varchar', nullable: false, primaryKey: false, foreignKey: false, unique: true, length: 50 },
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
    position: { x: 585, y: -210 },
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
    position: { x: -735, y: -810 },
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
    position: { x: 150, y: 750 },
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
    position: { x: 705, y: 855 },
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
