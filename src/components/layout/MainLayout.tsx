'use client';

import React from 'react';
import { SchemaDesigner } from '@/components/schema/SchemaDesigner';
import { SchemaHome } from '@/components/home/SchemaHome';
import { ToolbarRibbon } from './ToolbarRibbon';
import { useApp } from '@/contexts/AppContext';

export function MainLayout() {
  const { state } = useApp();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {state.currentSchema && <ToolbarRibbon />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {state.currentSchema ? (
          <SchemaDesigner />
        ) : (
          <SchemaHome />
        )}
      </div>
    </div>
  );
}
