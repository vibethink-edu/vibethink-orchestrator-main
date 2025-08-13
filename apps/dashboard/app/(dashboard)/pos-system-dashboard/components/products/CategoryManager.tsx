"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Grid3X3,
  Palette,
  Package
} from "lucide-react";
import { usePosData } from "../../hooks/usePosData";
import { ProductCategory } from "../../types";

export function CategoryManager() {
  const { categories, products, isLoading } = usePosData();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("hsl(var(--primary))");

  // Predefined color options
  const colorOptions = [
    { name: "Primary", value: "hsl(var(--primary))" },
    { name: "Red", value: "hsl(0 85% 60%)" },
    { name: "Orange", value: "hsl(25 85% 60%)" },
    { name: "Yellow", value: "hsl(45 85% 60%)" },
    { name: "Green", value: "hsl(120 85% 60%)" },
    { name: "Blue", value: "hsl(210 85% 60%)" },
    { name: "Purple", value: "hsl(270 85% 60%)" },
    { name: "Pink", value: "hsl(330 85% 60%)" }
  ];

  // Get product count for each category
  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId).length;
  };

  const handleSaveCategory = () => {
    if (!newCategoryName.trim()) return;

    const categoryData = {
      name: newCategoryName,
      description: newCategoryDescription,
      color: newCategoryColor,
      is_active: true
    };

    // TODO: Save category to database
    console.log("Save category:", categoryData);

    // Reset form
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryColor("hsl(var(--primary))");
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const productCount = getCategoryProductCount(categoryId);
    
    if (productCount > 0) {
      // TODO: Show confirmation dialog about products in category
      console.log(`Category has ${productCount} products. Move or delete them first.`);
      return;
    }

    // TODO: Delete category
    console.log("Delete category:", categoryId);
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading categories...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Product Categories</h2>
          <p className="text-muted-foreground">
            Organize your products with categories for better management
          </p>
        </div>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Add/Edit Category Form */}
      {(isAddingCategory || editingCategory) && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">
            {isAddingCategory ? "Add New Category" : "Edit Category"}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Category Name
              </label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (Optional)
              </label>
              <Input
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Enter category description..."
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Category Color
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      newCategoryColor === color.value
                        ? 'border-primary scale-110'
                        : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewCategoryColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                onClick={handleSaveCategory}
                disabled={!newCategoryName.trim()}
              >
                {isAddingCategory ? "Create Category" : "Update Category"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                  setNewCategoryName("");
                  setNewCategoryDescription("");
                  setNewCategoryColor("hsl(var(--primary))");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first product category to get started organizing your inventory.
            </p>
            <Button onClick={() => setIsAddingCategory(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Category
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const productCount = getCategoryProductCount(category.id);
            
            return (
              <Card key={category.id} className="p-4 group hover:shadow-md transition-all">
                <div className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Grid3X3 
                        className="h-6 w-6" 
                        style={{ color: category.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" title={category.name}>
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Product Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {productCount} product{productCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color
                      }}
                    >
                      Active
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingCategory(category.id);
                        setNewCategoryName(category.name);
                        setNewCategoryDescription(category.description || "");
                        setNewCategoryColor(category.color);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={productCount > 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Category Stats */}
      {categories.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Category Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Total Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {categories.filter(c => c.is_active).length}
              </p>
              <p className="text-sm text-muted-foreground">Active Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.round(products.length / categories.length) || 0}
              </p>
              <p className="text-sm text-muted-foreground">Avg Products/Category</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {categories.filter(c => getCategoryProductCount(c.id) === 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Empty Categories</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}