// Componente de Etiquetas Universal
// Permite mostrar, crear y gestionar etiquetas en cualquier módulo

import React, { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command';
import { Tag, TagComponentProps, TagSelectorProps } from '@/shared/types/tags';

// Componente para mostrar etiquetas
export const TagDisplay: React.FC<TagComponentProps> = ({
  tags,
  onTagClick,
  onTagRemove,
  maxTags = 5,
  showRemoveButton = false,
  className = ''
}) => {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const hasMore = tags.length > maxTags;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 cursor-pointer hover:bg-opacity-80 transition-colors"
          style={{ 
            backgroundColor: tag.color + '20', 
            color: tag.color,
            borderColor: tag.color + '40'
          }}
          onClick={() => onTagClick?.(tag)}
        >
          {tag.category?.icon && (
            <TagIcon className="w-3 h-3" />
          )}
          <span className="text-xs font-medium">{tag.name}</span>
          {showRemoveButton && onTagRemove && (
            <X
              className="w-3 h-3 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onTagRemove(tag);
              }}
            />
          )}
        </Badge>
      ))}
      {hasMore && (
        <Badge variant="outline" className="text-xs">
          +{tags.length - maxTags} más
        </Badge>
      )}
    </div>
  );
};

// Componente selector de etiquetas
export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  availableTags,
  onTagsChange,
  placeholder = "Seleccionar etiquetas...",
  maxTags = 10,
  allowCreate = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = availableTags.filter(tag =>
    !selectedTags.find(selected => selected.id === tag.id) &&
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.length >= maxTags) return;
    
    const newSelectedTags = [...selectedTags, tag];
    onTagsChange(newSelectedTags);
    setSearchQuery('');
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    const newSelectedTags = selectedTags.filter(tag => tag.id !== tagToRemove.id);
    onTagsChange(newSelectedTags);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim() || !allowCreate) return;

    // Crear una etiqueta temporal (en una implementación real, esto se haría a través del hook)
    const newTag: Tag = {
      id: `temp-${Date.now()}`,
      name: newTagName.trim(),
      color: '#6B7280',
      company_id: '',
      created_by: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_system: false,
      is_active: true,
      usage_count: 0
    };

    handleTagSelect(newTag);
    setNewTagName('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Etiquetas seleccionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1"
              style={{ 
                backgroundColor: tag.color + '20', 
                color: tag.color,
                borderColor: tag.color + '40'
              }}
            >
              <span className="text-xs font-medium">{tag.name}</span>
              <X
                className="w-3 h-3 hover:text-red-500 transition-colors cursor-pointer"
                onClick={() => handleTagRemove(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Selector de etiquetas */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={selectedTags.length >= maxTags}
          >
            <TagIcon className="w-4 h-4 mr-2" />
            {selectedTags.length === 0 ? placeholder : `${selectedTags.length} etiqueta(s) seleccionada(s)`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar etiquetas..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {allowCreate && newTagName.trim() ? (
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleCreateTag}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear "{newTagName.trim()}"
                    </Button>
                  </div>
                ) : (
                  <p className="p-2 text-sm text-muted-foreground">
                    No se encontraron etiquetas.
                  </p>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleTagSelect(tag)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                    {tag.category && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {tag.category.name}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Input para crear nueva etiqueta */}
      {allowCreate && (
        <div className="flex gap-2">
          <Input
            placeholder="Crear nueva etiqueta..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleCreateTag}
            disabled={!newTagName.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente para mostrar etiquetas con categorías
export const TagWithCategory: React.FC<{ tag: Tag }> = ({ tag }) => {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="flex items-center gap-1"
        style={{ 
          backgroundColor: tag.color + '20', 
          color: tag.color,
          borderColor: tag.color + '40'
        }}
      >
        <span className="text-xs font-medium">{tag.name}</span>
      </Badge>
      {tag.category && (
        <Badge variant="outline" className="text-xs">
          {tag.category.name}
        </Badge>
      )}
    </div>
  );
};

// Componente para mostrar estadísticas de etiquetas
export const TagStats: React.FC<{ tags: Tag[] }> = ({ tags }) => {
  const categoryCounts = tags.reduce((acc, tag) => {
    const categoryName = tag.category?.name || 'Sin categoría';
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Estadísticas de etiquetas</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-xs text-muted-foreground">
          Total: {tags.length}
        </div>
        <div className="text-xs text-muted-foreground">
          Categorías: {Object.keys(categoryCounts).length}
        </div>
      </div>
      {Object.entries(categoryCounts).map(([category, count]) => (
        <div key={category} className="flex justify-between text-xs">
          <span>{category}</span>
          <span className="font-medium">{count}</span>
        </div>
      ))}
    </div>
  );
}; 
