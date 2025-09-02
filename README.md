# 🗄️ Open Schema Designer

A powerful, browser-based database schema designer and visualizer built with Next.js, React Flow, and TypeScript. Design, visualize, and export database schemas with an intuitive drag-and-drop interface.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎨 **Visual Design**
- **Drag & Drop Interface**: Intuitive table positioning with React Flow
- **Real-time Visualization**: See your schema design as you build it
- **Relationship Mapping**: Visual connections between related tables
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

### 🔧 **Advanced Field Management**
- **Comprehensive Data Types**: Full PostgreSQL type support + extensible for other databases
- **Rich Constraints**: Primary keys, foreign keys, unique constraints, check constraints
- **Smart Defaults**: Auto-increment, default values, and function-based defaults
- **Field Documentation**: Comments and descriptions for better collaboration

### 🔗 **Relationship Management**
- **Visual Relationship Builder**: Point-and-click relationship creation
- **Multiple Relationship Types**: One-to-one, one-to-many, many-to-many
- **Cascade Controls**: ON DELETE and ON UPDATE behavior configuration
- **Relationship Editing**: Full CRUD operations with visual feedback

### � **Multi-Database Export**
- **PostgreSQL DDL**: Complete SQL schema generation
- **MySQL DDL**: MySQL-compatible schema export
- **Prisma Schema**: Generate Prisma ORM schemas
- **JSON Export**: Platform-agnostic schema definitions

### 📥 **Import Capabilities**
- **JSON Import**: Import previously exported schemas
- **SQL DDL Parsing**: Import from existing SQL files
- **Prisma Import**: Convert Prisma schemas to visual diagrams
- **File Upload**: Drag-and-drop or file picker support

### 🔒 **Privacy & Security**
- **100% Client-Side**: All data processing happens in your browser
- **No Server Required**: Zero data transmission to external servers
- **Local Storage**: Your schemas are saved locally in your browser
- **URL Sharing**: Share schemas via encoded URLs (optional)
- **No Account Required**: Start designing immediately

### 🌟 **User Experience**
- **Modern UI**: Clean, professional interface with shadcn/ui components
- **Toast Notifications**: Real-time feedback for all actions
- **Keyboard Shortcuts**: Efficient workflow navigation
- **Auto-Save**: Never lose your work with automatic saving
- **Dark Mode Ready**: Easy theme customization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/schema-visualizer.git
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
   ```
   http://localhost:3000
   ```

### Production Build
```bash
npm run build
npm start
```

## 📖 Usage Guide

### Creating Your First Schema

1. **Start Designing**: Visit the homepage and click "Get Started"
2. **Add Tables**: Use the "Table" button to create new tables
3. **Design Fields**: Click the three-dot menu on any field for advanced options
4. **Create Relationships**: Click "Relationship" to connect tables
5. **Export**: Choose from 6+ export formats

### Field Configuration

Access the field constraints dialog through the three-dot menu:

- **Data Types**: Choose from 25+ PostgreSQL data types
- **Constraints**: Primary keys, unique constraints, check constraints
- **Defaults**: Static values, functions, or expressions
- **Documentation**: Add comments and descriptions

### Relationship Types

- **One-to-One**: User ↔ Profile
- **One-to-Many**: User → Posts
- **Many-to-One**: Posts → User  
- **Many-to-Many**: Users ↔ Roles (via junction table)

### Export Formats

| Format | Use Case | Output |
|--------|----------|---------|
| PostgreSQL DDL | Database creation | `.sql` file |
| MySQL DDL | MySQL databases | `.sql` file |
| Prisma Schema | Prisma ORM | `.prisma` file |
| JSON | Platform agnostic | `.json` schema |

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15.5.2 with App Router
- **Visualization**: React Flow 12.8.4
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State**: React Context API
- **Storage**: Browser LocalStorage
- **Types**: Full TypeScript implementation

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page (/)
│   └── my-designs/        # Design management (/my-designs)
├── components/
│   ├── home/              # Homepage components
│   ├── schema/            # Schema designer components
│   ├── layout/            # Layout and navigation
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
├── lib/
│   ├── exporters.ts       # Multi-database export functions
│   ├── importers.ts       # Schema import functionality
│   ├── schemaGenerator.ts # Core generation logic
│   └── storage.ts         # LocalStorage utilities
└── types/
    └── schema.ts          # TypeScript definitions
```

## 🛠️ Development

### Adding New Data Types

1. Update the type definition in `src/types/schema.ts`:
```typescript
export type PostgreSQLDataType = 
  | 'varchar'
  | 'text'
  | 'your-new-type'; // Add here
```

2. Update the type arrays in components and generators

### Adding Export Formats

Create a new exporter in `src/lib/exporters.ts`:
```typescript
export function generateCustomFormat(schema: Schema): string {
  // Your export logic here
  return formattedOutput;
}
```

### Customizing UI

- **Colors**: Edit `tailwind.config.js`
- **Components**: Modify `src/components/ui/`
- **Theme**: Adjust CSS variables in `globals.css`

## 🌐 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/schema-visualizer)

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Hosting
```bash
npm run build
npm run export
# Deploy the 'out' folder to any static host
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📊 Roadmap

### Upcoming Features
- [ ] **Database Reverse Engineering**: Import from live databases
- [ ] **Real-time Collaboration**: Multi-user schema editing
- [ ] **Version Control**: Schema history and branching
- [ ] **API Generation**: Auto-generate REST/GraphQL APIs
- [ ] **Advanced Validation**: Custom constraint validation
- [ ] **Plugin System**: Extensible architecture
- [ ] **NoSQL Support**: MongoDB, DynamoDB schemas
- [ ] **Migration Scripts**: Generate database migrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) - Excellent diagramming library
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives  
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component patterns
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Sonner](https://sonner.emilkowal.ski/) - Elegant toast notifications

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ for the developer community**