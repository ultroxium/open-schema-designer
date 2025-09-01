# Schema Visualizer

A professional, open-source database schema designer and visualizer built with Next.js, TypeScript, and React Flow. Create, visualize, and share database schemas with an intuitive drag-and-drop interface.

## Features

### 🎨 Visual Schema Designer
- **Drag & Drop Interface**: Create tables and fields with an intuitive visual editor
- **Real-time Visualization**: See your schema come to life as you build it
- **Professional Design**: Clean, minimal interface inspired by modern design principles

### 🔗 Relationship Management
- **Visual Relationships**: Draw connections between tables with animated lines
- **Relationship Types**: Support for one-to-one, one-to-many, many-to-one, and many-to-many relationships
- **Interactive Highlighting**: Click relationship lines to highlight connected fields
- **Field-level Relationships**: Connect specific fields between tables

### 🗃️ Database Support
- **PostgreSQL Data Types**: Full support for all PostgreSQL data types including:
  - Numeric: `int`, `bigint`, `decimal`, `real`, `double precision`
  - Text: `varchar`, `text`, `char`
  - Date/Time: `date`, `time`, `timestamp`, `timestamptz`
  - JSON: `json`, `jsonb`
  - UUID, Boolean, Arrays, and more
- **Field Properties**: Configure nullable, primary key, foreign key, unique constraints
- **Length and Precision**: Set field lengths and decimal precision

### 🌐 Sharing & Collaboration
- **URL-based Sharing**: Share schemas instantly via URL links
- **No Account Required**: Start designing immediately without any signup
- **Local Storage**: Schemas saved in your browser's local storage
- **Easy Sharing**: Copy and share URLs to show others your schema designs

### ⌨️ Developer Experience
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + T`: Add new table
  - `Ctrl/Cmd + S`: Save schema
- **Auto-save**: Changes are automatically saved to local storage
- **Export Ready**: Extensible architecture for future export features

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Components**: shadcn/ui for consistent UI components
- **Visualization**: React Flow for the schema diagram
- **Icons**: Lucide React icons
- **State Management**: React Context API
- **Storage**: Local Storage (easily extensible to databases)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd schema-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Getting Started
1. **Open the App**: Navigate to the application URL
2. **Choose Schema**: Start with sample schemas or create a new one
3. **Start Designing**: Begin adding tables and relationships

### Creating Schemas
1. **Add Tables**: Click "Add Table" or press `Ctrl/Cmd + T`
2. **Edit Fields**: Click on field names and types to edit them inline
3. **Add Relationships**: Drag from field handle to field handle to create connections
4. **Save**: Click "Save" or press `Ctrl/Cmd + S`

### Field Connections
1. **Drag Relationships**: Each field has connection handles (blue dots)
2. **Connect Fields**: Drag from any field's right handle to another field's left handle
3. **Visual Feedback**: Relationships appear as animated lines between connected fields
4. **Click to Highlight**: Click relationship lines to highlight connected fields

### Sharing
1. **Share Button**: Click "Share" in the header to copy the URL
2. **URL Sharing**: Send the copied URL to others to share your schema
3. **Real-time Updates**: Changes are automatically reflected in shared URLs

## Sample Data

First-time visitors automatically get two sample schemas:
- **E-Commerce Platform**: Complete online store database with users, products, orders
- **Blog Platform**: Full blogging system with posts, comments, categories

These schemas demonstrate the full capabilities of the tool and provide a starting point for learning.

## Architecture

The application is built with a modular, extensible architecture:

```
src/
├── components/         # React components
│   ├── schema/        # Schema designer components
│   ├── create/        # Schema sidebar and management
│   └── layout/        # Layout components
├── contexts/          # React contexts
├── lib/              # Utilities and helpers
├── types/            # TypeScript type definitions
└── app/              # Next.js app router pages
```

## Contributing

This is an open-source project! Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Future Enhancements

- **Real-time Collaboration**: WebSocket-based live editing
- **Schema Export**: Generate SQL DDL, migrations, and documentation
- **Database Integration**: Direct connection to live databases
- **Version Control**: Schema versioning and history
- **Team Management**: Organization and permission systems
- **Advanced Relationships**: Composite keys and complex constraints

## License

This project is open source and available under the MIT License.

## Support

For questions, suggestions, or issues:
- Create an issue in the repository
- Join the community discussions
- Contribute to the documentation

---

Built with ❤️ for the developer community