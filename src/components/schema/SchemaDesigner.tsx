'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  ReactFlowProvider,
  MarkerType,
  NodeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TableNode } from './TableNode';
import { useApp } from '@/contexts/AppContext';
import { Table, Schema, Relationship } from '@/types/schema';
import { createNewRelationship } from '@/lib/storage';
import { Button } from '@/components/ui/button';

const nodeTypes = {
  tableNode: TableNode,
};

function SchemaDesignerContent() {
  const { state, setCurrentSchema } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const [isAnimated, setIsAnimated] = useState(true);

  const currentSchema = state.currentSchema;
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced function to update schema positions
  const updateSchemaPositions = useCallback(() => {
    if (!currentSchema) return;

    setNodes((currentNodes) => {
      const updatedTables = currentSchema.tables.map(table => {
        const node = currentNodes.find(n => n.id === table.id);
        return node ? { ...table, position: node.position } : table;
      });

      const updatedSchema = {
        ...currentSchema,
        tables: updatedTables,
        updatedAt: new Date()
      };

      // Schedule the context update for after this render cycle
      setTimeout(() => {
        setCurrentSchema(updatedSchema);
      }, 0);
      
      return currentNodes;
    });
  }, [currentSchema, setCurrentSchema, setNodes]);

  // Custom nodes change handler that debounces schema updates
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);

    // Check if this is a position change when dragging stops
    const positionChanges = changes.filter((change) => 
      change.type === 'position' && !change.dragging
    );

    if (positionChanges.length > 0 && currentSchema) {
      // Clear any existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce the schema update to avoid React warnings
      updateTimeoutRef.current = setTimeout(() => {
        updateSchemaPositions();
      }, 100);
    }
  }, [onNodesChange, currentSchema, updateSchemaPositions]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Initialize schema from state
  useEffect(() => {
    if (currentSchema) {

      // Convert tables to nodes
      const flowNodes: Node[] = currentSchema.tables.map((table) => ({
        id: table.id,
        type: 'tableNode',
        position: table.position,
        data: {
          table,
          onUpdateTable: handleUpdateTable,
          onDeleteTable: handleDeleteTable,
          highlightedFields,
        },
      }));

      // Convert relationships to edges with field-level connections
      const flowEdges: Edge[] = currentSchema.relationships.map((rel) => {
        const sourceHandle = `${rel.sourceTableId}-${rel.sourceFieldId}-source`;
        const targetHandle = `${rel.targetTableId}-${rel.targetFieldId}-target`;

        // Determine relationship symbol based on type
        const getRelationshipSymbol = (relType: string) => {
          switch (relType) {
            case 'one-to-one': return '1:1';
            case 'one-to-many': return '1:M';
            case 'many-to-one': return 'M:1';
            case 'many-to-many': return 'M:M';
            default: return '1:M';
          }
        };

        return {
          id: rel.id,
          source: rel.sourceTableId,
          target: rel.targetTableId,
          sourceHandle,
          targetHandle,
          type: 'smoothstep',
          animated: isAnimated,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: '#374151',
          },
          style: {
            strokeWidth: 2,
            stroke: '#374151',
            strokeDasharray: isAnimated ? '8,4' : '0',
          },
          pathOptions: {
            offset: 35,
            borderRadius: 12
          },
          label: getRelationshipSymbol(rel.type),
          labelStyle: { 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#374151',
            background: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #d1d5db'
          },
          labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
          data: { relationship: rel },
        };
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [currentSchema, highlightedFields, isAnimated]);

  const handleUpdateTable = useCallback((updatedTable: Table) => {
    if (!currentSchema) return;

    const updatedSchema: Schema = {
      ...currentSchema,
      tables: currentSchema.tables.map(table =>
        table.id === updatedTable.id ? updatedTable : table
      ),
      updatedAt: new Date()
    };

    setCurrentSchema(updatedSchema);
  }, [currentSchema, setCurrentSchema]);

  const handleDeleteTable = useCallback((tableId: string) => {
    if (!currentSchema) return;

    const updatedSchema: Schema = {
      ...currentSchema,
      tables: currentSchema.tables.filter(table => table.id !== tableId),
      relationships: currentSchema.relationships.filter(
        rel => rel.sourceTableId !== tableId && rel.targetTableId !== tableId
      ),
      updatedAt: new Date()
    };

    setCurrentSchema(updatedSchema);
  }, [currentSchema, setCurrentSchema]);

  const onConnect = useCallback((params: Connection) => {
    if (!currentSchema || !params.source || !params.target || !params.sourceHandle || !params.targetHandle) {
      return;
    }

    // Parse the handle IDs to get table and field information
    // Handle format: "tableId-fieldId-source/target"
    const parseHandle = (handle: string) => {
      const parts = handle.split('-');
      if (parts.length >= 3) {
        return {
          tableId: parts[0],
          fieldId: parts[1]
        };
      }
      return null;
    };

    const sourceInfo = parseHandle(params.sourceHandle);
    const targetInfo = parseHandle(params.targetHandle);

    if (!sourceInfo || !targetInfo) {
      return;
    }

    // Create relationship between specific fields
    const newRelationship = createNewRelationship(
      sourceInfo.tableId,
      sourceInfo.fieldId,
      targetInfo.tableId,
      targetInfo.fieldId
    );

    const updatedSchema: Schema = {
      ...currentSchema,
      relationships: [...currentSchema.relationships, newRelationship],
      updatedAt: new Date()
    };

    setCurrentSchema(updatedSchema);
  }, [currentSchema, setCurrentSchema]);



  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    const relationship = edge.data?.relationship as Relationship;
    if (relationship) {
      setHighlightedFields([relationship.sourceFieldId, relationship.targetFieldId]);
      setTimeout(() => setHighlightedFields([]), 3000);
    }
  }, []);



  if (!currentSchema) {
    return null; // Home component handles this now
  }

  return (
    <div className="flex-1 relative schema-flow-container">
      <ReactFlow
          key={currentSchema?.id || 'no-schema'}
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={handleEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          snapToGrid={true}
          snapGrid={[15, 15]}
          attributionPosition="bottom-left"
          connectionLineStyle={{ 
            strokeWidth: 2, 
            stroke: '#3b82f6', 
            strokeDasharray: isAnimated ? '8,4' : '5,5' 
          }}
          elementsSelectable={true}
          nodesConnectable={true}
          nodesDraggable={true}
          zoomOnDoubleClick={false}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: isAnimated,
            style: { 
              strokeWidth: 2, 
              stroke: '#374151',
              strokeDasharray: isAnimated ? '8,4' : '0'
            },
            markerEnd: { 
              type: MarkerType.ArrowClosed, 
              color: '#374151',
              width: 16,
              height: 16
            }
          }}
        >
        <Controls />
        <Background color="#888888" gap={16} />
        
        {/* Animation Toggle Banner */}
        <div className="absolute bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsAnimated(true)}
                variant={isAnimated ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center space-x-1 h-8"
              >
                <div className="w-4 border-t-2 border-dashed border-gray-600"></div>
              </Button>
              <Button
                onClick={() => setIsAnimated(false)}
                variant={!isAnimated ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center space-x-1 h-8"
              >
                <div className="w-4 border-t-2 border-solid border-gray-600"></div>
              </Button>
            </div>
          </div>
        </div>
        
      </ReactFlow>
    </div>
  );
}

export function SchemaDesigner() {
  return (
    <ReactFlowProvider>
      <SchemaDesignerContent />
    </ReactFlowProvider>
  );
}
