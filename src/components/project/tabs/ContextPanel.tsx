import { Button } from "@/components/ui/button"; 
import React, { useState, useMemo } from 'react';
import { PixelatedCanvas } from '@/components/ui/pixelated-canvas';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileJson, FileType, FileImage, FileText, CheckSquare, Square, MinusSquare, Layout, Coffee, RotateCcw, CheckCheck, X } from 'lucide-react';
import ShimmerText from "@/components/kokonutui/shimmer-text";

// --- Types ---
interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: TreeNode[];
}

// --- Helper: Icon Mapping ---
const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const iconProps = { size: 18, className: "shrink-0 mr-2" };

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    case 'css':
    case 'scss':
    case 'less':
      return <Layout {...iconProps} className={`${iconProps.className} text-blue-400`} />;
    case 'html':
      return <FileCode {...iconProps} className={`${iconProps.className} text-orange-500`} />;
    case 'json':
      return <FileJson {...iconProps} className={`${iconProps.className} text-yellow-300`} />;
    case 'md':
    case 'txt':
      return <FileText {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return <FileImage {...iconProps} className={`${iconProps.className} text-purple-400`} />;
    case 'java':
    case 'py':
      return <Coffee {...iconProps} className={`${iconProps.className} text-red-400`} />;
    default:
      return <FileType {...iconProps} className={`${iconProps.className} text-muted-foreground`} />;
  }
};

// --- Helper: Sort Nodes ---
const sortTreeNodes = (nodes: TreeNode[]): TreeNode[] => {
  return nodes
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    })
    .map((node) => ({
      ...node,
      children: sortTreeNodes(node.children),
    }));
};

// --- Helper: Build Tree ---
const buildFileTree = (paths: string[]): TreeNode[] => {
  const root: TreeNode[] = [];
  paths.forEach((path) => {
    const parts = path.split('/');
    let currentLevel = root;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);
      if (existingNode) {
        currentLevel = existingNode.children;
      } else {
        const newNode: TreeNode = {
          name: part,
          path: isFile ? path : parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'folder',
          children: [],
        };
        currentLevel.push(newNode);
        currentLevel = newNode.children;
      }
    });
  });
  return sortTreeNodes(root);
};

// --- Helper: Get Leafs ---
const getAllLeafPaths = (node: TreeNode): string[] => {
  if (node.type === 'file') return [node.path];
  return node.children.flatMap(getAllLeafPaths);
};

// --- Sub-Component: Recursive Tree Item ---
const FileTreeItem = ({
  node,
  selectedFiles,
  onToggle,
  depth = 0
}: {
  node: TreeNode;
  selectedFiles: Set<string>;
  onToggle: (node: TreeNode, isSelected: boolean) => void;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const nodeLeafPaths = useMemo(() => getAllLeafPaths(node), [node]);
  const selectedCount = nodeLeafPaths.filter((p) => selectedFiles.has(p)).length;
  const totalCount = nodeLeafPaths.length;

  const isChecked = totalCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !(isChecked || isIndeterminate);
    onToggle(node, newState);
  };

  const handleRowClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      handleCheckboxChange({ stopPropagation: () => {} } as React.MouseEvent);
    }
  };

  const paddingLeft = `${depth * 1.25}rem`;

  return (
    <div className="w-full select-none py-0.5">
      <div 
        className="flex items-center justify-between group hover:bg-muted/50 py-1 pr-3 cursor-pointer transition-colors duration-200 border-l-2 border-transparent hover:border-primary/50"
        style={{ paddingLeft: depth === 0 ? '0.5rem' : paddingLeft }}
        onClick={handleRowClick}
      >
        <div className="flex items-center min-w-0 flex-1 mr-3">
          <div className="shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground/70">
            {node.type === 'folder' && (
              isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            )}
          </div>
          <div className="shrink-0">
            {node.type === 'folder' ? (
              isOpen ? 
              <FolderOpen size={18} className="mr-2 text-blue-400 fill-blue-400/20" /> : 
              <Folder size={18} className="mr-2 text-blue-400 fill-blue-400/20" />
            ) : (
              getFileIcon(node.name)
            )}
          </div>
          <span className={`truncate ${node.type === 'folder' ? 'font-medium text-foreground/90' : 'text-foreground/70 group-hover:text-foreground'}`}>
            {node.name}
          </span>
        </div>
        <div 
          onClick={handleCheckboxChange}
          className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
        >
          {isChecked ? (
            <CheckSquare size={20} className="text-primary" />
          ) : isIndeterminate ? (
            <MinusSquare size={20} className="text-primary" />
          ) : (
            <Square size={20} className="text-muted-foreground/30 group-hover:text-muted-foreground/60" />
          )}
        </div>
      </div>
      {node.type === 'folder' && isOpen && (
        <div className="relative">
          <div 
            className="absolute left-0 top-0 bottom-0 border-l border-border/40" 
            style={{ left: `calc(${paddingLeft} + 1.25rem)` }}
          />
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path + child.name}
              node={child}
              selectedFiles={selectedFiles}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
const ContextPanel = ({
  initialContextFiles,
  contextFiles,
  setContextFiles,
  allFiles,
}: {
  initialContextFiles: string[];
  contextFiles: string[];
  setContextFiles: React.Dispatch<React.SetStateAction<string[]>>;
  allFiles: string[];
}) => {

  const fileTree = useMemo(() => buildFileTree(allFiles), [allFiles]);
  const selectedSet = useMemo(() => new Set(contextFiles), [contextFiles]);

  const handleToggle = (node: TreeNode, shouldSelect: boolean) => {
    const pathsToToggle = getAllLeafPaths(node);
    setContextFiles((prev) => {
      const newSet = new Set(prev);
      pathsToToggle.forEach((path) => {
        if (shouldSelect) newSet.add(path);
        else newSet.delete(path);
      });
      return Array.from(newSet);
    });
  };

  const selectAll = () => setContextFiles(allFiles);
  const clearAll = () => setContextFiles([]);
  const resetToDefault = () => setContextFiles([...initialContextFiles]);

  if (allFiles.length === 0) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center bg-foreground/5">
        <PixelatedCanvas
          src="/logo.png"
          width={200}
          height={150}
          cellSize={4}
          dotScale={0.9}
          shape="square"
          backgroundColor=""
          dropoutStrength={0}
          interactive
          distortionStrength={0.1}
          distortionRadius={100}
          distortionMode="repel"
          followSpeed={0.2}
          jitterStrength={4}
          jitterSpeed={1}
          sampleAverage
        />
        <div className="flex items-center gap-x-2 text-foreground/70 -my-8">
          <ShimmerText text="Loading Project Preview..." className="text-xl -px-5 mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full border-r border-border/50 bg-background/50 p-2 -mt-1">
      {/* Header Section */}
      <div className="p-4 border-b border-border/60 space-y-4">
        
        {/* Title & Badge */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-primary/80" />
            <h3 className="font-semibold text-sm tracking-tight text-foreground">Project Files</h3>
          </div>

          {/* Action Buttons Grid */}
          <div className="flex items-center gap-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="h-8 text-xs px-2"
            >
              <CheckCheck className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              Select All
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="h-8 text-xs px-2 hover:text-destructive hover:border-destructive/50!"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>

            <Button 
              variant="secondary" 
              size="sm" 
              onClick={resetToDefault}
              className="h-8 text-xs bg-muted/80 hover:bg-muted"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
        

      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {allFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm space-y-2">
            <FolderOpen size={32} className="opacity-20" />
            <p>No files found</p>
          </div>
        ) : (
          fileTree.map((node) => (
            <FileTreeItem
              key={node.path + node.name}
              node={node}
              selectedFiles={selectedSet}
              onToggle={handleToggle}
              depth={0}
            />
          ))
        )}
      </div>

      <div className='w-full flex'>
        <span className="text-[10px] ms-auto font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md mt-2 border border-primary/20">
          {contextFiles.length} Selected
        </span>
      </div>
    </div>
  );
};

export default ContextPanel;