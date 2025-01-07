'use client';

import { Moon, Sun, Settings, Code, Laptop, Terminal } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConfigModal } from './configModal';

export function ThemeConfig() {
  const { setTheme, theme } = useTheme();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [devMode, setDevMode] = useState<'off' | 'basic' | 'advanced'>('off');

  const devModeOptions = [
    { value: 'off', label: 'DevMode Off', icon: Laptop },
    { value: 'basic', label: 'Basic DevMode', icon: Code },
    { value: 'advanced', label: 'Advanced DevMode', icon: Terminal },
  ] as const;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setIsConfigOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          {devModeOptions.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setDevMode(value)}
              className={devMode === value ? 'bg-accent' : ''}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfigModal 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={(config) => {
          setIsConfigOpen(false);
        }}
      />
    </>
  );
}