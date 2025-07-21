
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useTranslation } from 'react-i18next';

interface ConfigurationFormProps {
  onSubmit: (data: {
    category: string;
    config_key: string;
    config_value: any;
    description: string;
    reason?: string;
  }) => void;
  isLoading?: boolean;
  initialData?: any;
  title: string;
  description: string;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
  title,
  description
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    category: '',
    config_key: '',
    config_value: '',
    description: '',
    reason: ''
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || '',
        config_key: initialData.config_key || '',
        config_value: typeof initialData.config_value === 'object' 
          ? JSON.stringify(initialData.config_value, null, 2)
          : String(initialData.config_value || ''),
        description: initialData.description || '',
        reason: ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let parsedValue;
    try {
      parsedValue = JSON.parse(formData.config_value);
    } catch {
      parsedValue = formData.config_value;
    }

    onSubmit({
      ...formData,
      config_value: parsedValue
    });

    // Reset form if not editing
    if (!initialData) {
      setFormData({
        category: '',
        config_key: '',
        config_value: '',
        description: '',
        reason: ''
      });
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-foreground">{t('superAdmin.form.category')}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={t('superAdmin.form.selectCategory')} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="ai_models">{t('superAdmin.categories.ai_models')}</SelectItem>
                  <SelectItem value="integrations">{t('superAdmin.categories.integrations')}</SelectItem>
                  <SelectItem value="limits">{t('superAdmin.categories.limits')}</SelectItem>
                  <SelectItem value="features">{t('superAdmin.categories.features')}</SelectItem>
                  <SelectItem value="security">{t('superAdmin.categories.security')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="config_key" className="text-foreground">{t('superAdmin.form.configKey')}</Label>
              <Input
                id="config_key"
                value={formData.config_key}
                onChange={(e) => setFormData(prev => ({ ...prev, config_key: e.target.value }))}
                placeholder={t('superAdmin.form.configKeyPlaceholder')}
                className="bg-background border-border text-foreground"
                required
                disabled={!!initialData}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="config_value" className="text-foreground">{t('superAdmin.form.value')}</Label>
            <Textarea
              id="config_value"
              value={formData.config_value}
              onChange={(e) => setFormData(prev => ({ ...prev, config_value: e.target.value }))}
              placeholder={t('superAdmin.form.valuePlaceholder')}
              className="bg-background border-border text-foreground"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-foreground">{t('superAdmin.form.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('superAdmin.form.descriptionPlaceholder')}
              className="bg-background border-border text-foreground"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="reason" className="text-foreground">{t('superAdmin.form.reason')}</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder={t('superAdmin.form.reasonPlaceholder')}
              className="bg-background border-border text-foreground"
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? t('superAdmin.form.saving') : t('superAdmin.form.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
