'use client';

import { useSearchParams } from 'next/navigation';
import { SchemaHome } from "@/components/home/SchemaHome";
import { SchemaDesigner } from "@/components/schema/SchemaDesigner";
import { ToolbarRibbon } from "@/components/layout/ToolbarRibbon";
import { useApp } from '@/contexts/AppContext';
import { useEffect } from 'react';

export default function MyDesigns() {
  const searchParams = useSearchParams();
  const schemaId = searchParams.get('schema');
  const { state, loadSchemaById } = useApp();

  useEffect(() => {
    if (schemaId && schemaId !== state.currentSchema?.id) {
      loadSchemaById(schemaId);
    }
  }, [schemaId, loadSchemaById, state.currentSchema?.id]);

  const showDesigner = schemaId && state.currentSchema;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {showDesigner && <ToolbarRibbon />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showDesigner ? (
          <SchemaDesigner />
        ) : (
          <SchemaHome />
        )}
      </div>
    </div>
  );
}
