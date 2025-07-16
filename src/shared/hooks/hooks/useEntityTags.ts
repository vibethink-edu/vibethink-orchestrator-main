// Hook especializado para gestionar etiquetas de entidades específicas
// Simplifica el uso del sistema de etiquetas en componentes

import { useState, useEffect } from 'react';
import { useTags } from '@/shared/hooks/useTags';
import { Tag, EntityType, UseEntityTagsReturn } from '@/shared/types/tags';

export const useEntityTags = (
  entityType: EntityType,
  entityId: string
): UseEntityTagsReturn => {
  const { getEntityTags, tagEntity, untagEntity } = useTags();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Cargar etiquetas de la entidad
  const loadTags = async () => {
    if (!entityId) return;
    
    try {
      setLoading(true);
      setError(undefined);
      const entityTags = await getEntityTags(entityType, entityId);
      setTags(entityTags);
    } catch (err) {
      console.error(`Error loading tags for ${entityType}:`, err);
      setError(err instanceof Error ? err.message : 'Error loading tags');
    } finally {
      setLoading(false);
    }
  };

  // Cargar etiquetas cuando cambie la entidad
  useEffect(() => {
    loadTags();
  }, [entityType, entityId]);

  // Añadir etiquetas a la entidad
  const addTags = async (tagIds: string[]) => {
    if (!entityId || tagIds.length === 0) return;
    
    try {
      setLoading(true);
      setError(undefined);
      
      await tagEntity({
        entity_type: entityType,
        entity_id: entityId,
        tag_ids: tagIds
      });
      
      // Recargar etiquetas para obtener las actualizadas
      await loadTags();
    } catch (err) {
      console.error(`Error adding tags to ${entityType}:`, err);
      setError(err instanceof Error ? err.message : 'Error adding tags');
    } finally {
      setLoading(false);
    }
  };

  // Remover etiqueta de la entidad
  const removeTag = async (tagId: string) => {
    if (!entityId) return;
    
    try {
      setLoading(true);
      setError(undefined);
      
      await untagEntity(entityType, entityId, tagId);
      
      // Actualizar estado local
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (err) {
      console.error(`Error removing tag from ${entityType}:`, err);
      setError(err instanceof Error ? err.message : 'Error removing tag');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar todas las etiquetas de la entidad
  const updateTags = async (newTags: Tag[]) => {
    if (!entityId) return;
    
    try {
      setLoading(true);
      setError(undefined);
      
      const currentTagIds = tags.map(tag => tag.id);
      const newTagIds = newTags.map(tag => tag.id);
      
      // Etiquetas a añadir
      const tagsToAdd = newTagIds.filter(id => !currentTagIds.includes(id));
      if (tagsToAdd.length > 0) {
        await tagEntity({
          entity_type: entityType,
          entity_id: entityId,
          tag_ids: tagsToAdd
        });
      }
      
      // Etiquetas a remover
      const tagsToRemove = currentTagIds.filter(id => !newTagIds.includes(id));
      for (const tagId of tagsToRemove) {
        await untagEntity(entityType, entityId, tagId);
      }
      
      setTags(newTags);
    } catch (err) {
      console.error(`Error updating tags for ${entityType}:`, err);
      setError(err instanceof Error ? err.message : 'Error updating tags');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si la entidad tiene una etiqueta específica
  const hasTag = (tagName: string): boolean => {
    return tags.some(tag => tag.name.toLowerCase() === tagName.toLowerCase());
  };

  // Verificar si la entidad tiene alguna de las etiquetas especificadas
  const hasAnyTag = (tagNames: string[]): boolean => {
    return tagNames.some(tagName => hasTag(tagName));
  };

  // Verificar si la entidad tiene todas las etiquetas especificadas
  const hasAllTags = (tagNames: string[]): boolean => {
    return tagNames.every(tagName => hasTag(tagName));
  };

  // Obtener etiquetas por categoría
  const getTagsByCategory = (categoryName: string): Tag[] => {
    return tags.filter(tag => tag.category?.name === categoryName);
  };

  // Obtener etiquetas por color
  const getTagsByColor = (color: string): Tag[] => {
    return tags.filter(tag => tag.color === color);
  };

  return {
    tags,
    loading,
    error,
    addTags,
    removeTag,
    updateTags,
    refreshTags: loadTags,
    hasTag,
    hasAnyTag,
    hasAllTags,
    getTagsByCategory,
    getTagsByColor
  };
}; 