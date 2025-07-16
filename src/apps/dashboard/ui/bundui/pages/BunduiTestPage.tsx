import React, { useState } from 'react';
import { BunduiButton } from '../components/common/BunduiButton';
import { BunduiCard, BunduiCardHeader, BunduiCardTitle, BunduiCardDescription, BunduiCardContent, BunduiCardFooter } from '../components/common/BunduiCard';
import { BunduiInput } from '../components/forms/BunduiInput';
import { BunduiBadge } from '../components/data-display/BunduiBadge';
import { useBunduiTheme } from '../hooks/useBunduiTheme';

export const BunduiTestPage: React.FC = () => {
  const { currentTheme, availableThemes, changeTheme } = useBunduiTheme();
  const [inputValue, setInputValue] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(currentTheme.name);

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
    changeTheme(themeName);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🎨 Bundui UI Test Page
          </h1>
          <p className="text-lg text-muted-foreground">
            Página de prueba para componentes Bundui - VibeThink Orchestrator
          </p>
          <BunduiBadge variant="success" size="lg">
            Tema actual: {currentTheme.name}
          </BunduiBadge>
        </div>

        {/* Theme Selector */}
        <BunduiCard variant="outlined">
          <BunduiCardHeader>
            <BunduiCardTitle>Selector de Temas</BunduiCardTitle>
            <BunduiCardDescription>
              Prueba los diferentes temas disponibles en Bundui
            </BunduiCardDescription>
          </BunduiCardHeader>
          <BunduiCardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableThemes.map((theme) => (
                <BunduiButton
                  key={theme.name}
                  variant={selectedTheme === theme.name ? 'primary' : 'outline'}
                  onClick={() => handleThemeChange(theme.name)}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <div className="text-sm font-medium">{theme.name}</div>
                  <div 
                    className="w-4 h-4 rounded-full mt-2"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </BunduiButton>
              ))}
            </div>
          </BunduiCardContent>
        </BunduiCard>

        {/* Buttons Test */}
        <BunduiCard>
          <BunduiCardHeader>
            <BunduiCardTitle>Botones Bundui</BunduiCardTitle>
            <BunduiCardDescription>
              Prueba las diferentes variantes y tamaños de botones
            </BunduiCardDescription>
          </BunduiCardHeader>
          <BunduiCardContent className="space-y-6">
            
            {/* Variants */}
            <div className="space-y-4">
              <h4 className="font-medium">Variantes</h4>
              <div className="flex flex-wrap gap-4">
                <BunduiButton variant="primary">Primary</BunduiButton>
                <BunduiButton variant="secondary">Secondary</BunduiButton>
                <BunduiButton variant="outline">Outline</BunduiButton>
                <BunduiButton variant="ghost">Ghost</BunduiButton>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h4 className="font-medium">Tamaños</h4>
              <div className="flex flex-wrap items-center gap-4">
                <BunduiButton size="sm">Small</BunduiButton>
                <BunduiButton size="md">Medium</BunduiButton>
                <BunduiButton size="lg">Large</BunduiButton>
              </div>
            </div>

            {/* States */}
            <div className="space-y-4">
              <h4 className="font-medium">Estados</h4>
              <div className="flex flex-wrap gap-4">
                <BunduiButton>Normal</BunduiButton>
                <BunduiButton disabled>Disabled</BunduiButton>
              </div>
            </div>
          </BunduiCardContent>
        </BunduiCard>

        {/* Cards Test */}
        <BunduiCard>
          <BunduiCardHeader>
            <BunduiCardTitle>Tarjetas Bundui</BunduiCardTitle>
            <BunduiCardDescription>
              Prueba las diferentes variantes de tarjetas
            </BunduiCardDescription>
          </BunduiCardHeader>
          <BunduiCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Default Card */}
              <BunduiCard>
                <BunduiCardHeader>
                  <BunduiCardTitle>Tarjeta Default</BunduiCardTitle>
                  <BunduiCardDescription>
                    Tarjeta con estilo por defecto
                  </BunduiCardDescription>
                </BunduiCardHeader>
                <BunduiCardContent>
                  <p className="text-sm text-muted-foreground">
                    Contenido de ejemplo para la tarjeta.
                  </p>
                </BunduiCardContent>
                <BunduiCardFooter>
                  <BunduiButton size="sm">Acción</BunduiButton>
                </BunduiCardFooter>
              </BunduiCard>

              {/* Outlined Card */}
              <BunduiCard variant="outlined">
                <BunduiCardHeader>
                  <BunduiCardTitle>Tarjeta Outlined</BunduiCardTitle>
                  <BunduiCardDescription>
                    Tarjeta con borde destacado
                  </BunduiCardDescription>
                </BunduiCardHeader>
                <BunduiCardContent>
                  <p className="text-sm text-muted-foreground">
                    Contenido de ejemplo para la tarjeta.
                  </p>
                </BunduiCardContent>
                <BunduiCardFooter>
                  <BunduiButton variant="outline" size="sm">Acción</BunduiButton>
                </BunduiCardFooter>
              </BunduiCard>

              {/* Elevated Card */}
              <BunduiCard variant="elevated">
                <BunduiCardHeader>
                  <BunduiCardTitle>Tarjeta Elevated</BunduiCardTitle>
                  <BunduiCardDescription>
                    Tarjeta con sombra elevada
                  </BunduiCardDescription>
                </BunduiCardHeader>
                <BunduiCardContent>
                  <p className="text-sm text-muted-foreground">
                    Contenido de ejemplo para la tarjeta.
                  </p>
                </BunduiCardContent>
                <BunduiCardFooter>
                  <BunduiButton variant="secondary" size="sm">Acción</BunduiButton>
                </BunduiCardFooter>
              </BunduiCard>
            </div>
          </BunduiCardContent>
        </BunduiCard>

        {/* Inputs Test */}
        <BunduiCard>
          <BunduiCardHeader>
            <BunduiCardTitle>Campos de Entrada</BunduiCardTitle>
            <BunduiCardDescription>
              Prueba los diferentes tipos de inputs
            </BunduiCardDescription>
          </BunduiCardHeader>
          <BunduiCardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Text Input */}
              <BunduiInput
                label="Campo de texto"
                placeholder="Escribe algo aquí..."
                value={inputValue}
                onChange={setInputValue}
              />

              {/* Email Input */}
              <BunduiInput
                type="email"
                label="Correo electrónico"
                placeholder="usuario@ejemplo.com"
              />

              {/* Password Input */}
              <BunduiInput
                type="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
              />

              {/* Number Input */}
              <BunduiInput
                type="number"
                label="Número"
                placeholder="123"
              />

              {/* Required Input */}
              <BunduiInput
                label="Campo requerido"
                placeholder="Este campo es obligatorio"
                required
              />

              {/* Error Input */}
              <BunduiInput
                label="Campo con error"
                placeholder="Este campo tiene un error"
                error
              />

              {/* Disabled Input */}
              <BunduiInput
                label="Campo deshabilitado"
                placeholder="No puedes escribir aquí"
                disabled
              />
            </div>
          </BunduiCardContent>
        </BunduiCard>

        {/* Badges Test */}
        <BunduiCard>
          <BunduiCardHeader>
            <BunduiCardTitle>Badges Bundui</BunduiCardTitle>
            <BunduiCardDescription>
              Prueba las diferentes variantes de badges
            </BunduiCardDescription>
          </BunduiCardHeader>
          <BunduiCardContent className="space-y-6">
            
            {/* Variants */}
            <div className="space-y-4">
              <h4 className="font-medium">Variantes</h4>
              <div className="flex flex-wrap gap-4">
                <BunduiBadge variant="default">Default</BunduiBadge>
                <BunduiBadge variant="secondary">Secondary</BunduiBadge>
                <BunduiBadge variant="destructive">Destructive</BunduiBadge>
                <BunduiBadge variant="outline">Outline</BunduiBadge>
                <BunduiBadge variant="success">Success</BunduiBadge>
                <BunduiBadge variant="warning">Warning</BunduiBadge>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h4 className="font-medium">Tamaños</h4>
              <div className="flex flex-wrap items-center gap-4">
                <BunduiBadge size="sm">Small</BunduiBadge>
                <BunduiBadge size="md">Medium</BunduiBadge>
                <BunduiBadge size="lg">Large</BunduiBadge>
              </div>
            </div>
          </BunduiCardContent>
        </BunduiCard>

        {/* Footer */}
        <div className="text-center space-y-4">
          <BunduiBadge variant="success" size="lg">
            ✅ Test completado exitosamente
          </BunduiBadge>
          <p className="text-sm text-muted-foreground">
            Todos los componentes de Bundui están funcionando correctamente
          </p>
        </div>
      </div>
    </div>
  );
}; 