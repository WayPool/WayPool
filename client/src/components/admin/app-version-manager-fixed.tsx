import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleLoader } from '@/components/layout/loaders';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useTranslation } from '@/hooks/use-translation';
import { useWallet } from '@/hooks/use-wallet';
import axios from 'axios';

export default function AppVersionManager() {
  console.log('[AppVersionManager] Componente iniciado');
  
  const { t } = useTranslation();
  const [version, setVersion] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address } = useWallet();
  const [isForceAdmin, setIsForceAdmin] = useState(false);
  
  // Crear una versión simplificada de la información de autenticación basada en la dirección del wallet
  // y también permitir un modo de forzar admin para situaciones donde la sesión no funciona correctamente
  const isAuthenticated = !!address || isForceAdmin;
  const user = address ? { walletAddress: address, isAdmin: true } : null;
  
  // Verificar si hay un estado de admin guardado en localStorage
  useEffect(() => {
    const adminStatus = localStorage.getItem('adminUsers');
    if (adminStatus) {
      try {
        const adminUsers = JSON.parse(adminStatus);
        if (Array.isArray(adminUsers) && address && adminUsers.includes(address.toLowerCase())) {
          console.log('[AppVersionManager] Usuario admin verificado desde localStorage');
          setIsForceAdmin(true);
        }
      } catch (e) {
        console.warn('Error al leer adminUsers de localStorage', e);
      }
    }
  }, [address]);
  
  console.log('[AppVersionManager] Estado de autenticación:', { 
    isAuthenticated, 
    address, 
    isForceAdmin 
  });

  // Definimos un tipo para la respuesta de la versión
  type VersionResponse = {
    version: string;
  }
  
  // Consulta para obtener la versión actual
  const { data: versionData, isLoading, error } = useQuery<VersionResponse>({
    queryKey: ['/api/app-config/version'],
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutación para actualizar la versión usando directamente axios
  const updateVersion = useMutation({
    mutationFn: async (newVersion: string) => {
      // Log para depuración extendida (no en producción)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Version] Estado completo de autenticación:', { isAuthenticated, user });
        console.log('[Version] Intentando actualizar versión a:', newVersion, 'Usuario autenticado:', isAuthenticated);
      }
      
      // Verificar solo si está autenticado - asumimos que si llegó a la página de admin, ya tiene permisos
      if (!isAuthenticated) {
        return Promise.reject(new Error('Usuario no autorizado. Debe iniciar sesión para actualizar la versión.'));
      }
      
      try {
        // Usar axios directamente para poder incluir encabezados personalizados
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Is-Admin': 'true',
        };
        
        // Si tenemos una dirección de wallet, incluirla en los encabezados
        if (address) {
          headers['X-Wallet-Address'] = address;
        }
        
        // Hacer la solicitud directamente con axios
        const response = await axios.put(
          '/api/admin/app-config/app_version', 
          { value: newVersion },
          { headers, withCredentials: true }
        );
        
        return response.data;
      } catch (error) {
        console.log('Error en la actualización de versión:', error);
        // Manejar errores específicos
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new Error('No tiene permisos para actualizar la versión.');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/app-config/version'] });
      queryClient.invalidateQueries({ queryKey: ['/api/app-config'] });
      toast({
        title: t('¡Versión actualizada!'),
        description: t('La versión de la aplicación ha sido actualizada correctamente.'),
      });
      setIsEditing(false);
    },
    onError: (error) => {
      // Evitar mostrar errores de autenticación en consola
      if (!(error instanceof Error && error.message.includes('401'))) {
        console.log('Detalles del error:', error);
      }
      
      toast({
        title: t('Error'),
        description: error instanceof Error && error.message.includes('401')
          ? t('No tiene permisos para actualizar la versión.')
          : t('No se pudo actualizar la versión. Por favor intente nuevamente.'),
        variant: 'destructive',
      });
    },
  });

  // Mutación para crear la versión si no existe usando directamente axios
  const createVersion = useMutation({
    mutationFn: async (initialVersion: string) => {
      // Log para depuración extendida (no en producción)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Version] Estado completo de autenticación (create):', { isAuthenticated, user });
        console.log('[Version] Intentando crear versión inicial:', initialVersion, 'Usuario autenticado:', isAuthenticated);
      }
      
      // Verificar solo si está autenticado - asumimos que si llegó a la página de admin, ya tiene permisos
      if (!isAuthenticated) {
        return Promise.reject(new Error('Usuario no autorizado. Debe iniciar sesión para inicializar la versión.'));
      }
      
      try {
        // Usar axios directamente para poder incluir encabezados personalizados
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Is-Admin': 'true',
        };
        
        // Si tenemos una dirección de wallet, incluirla en los encabezados
        if (address) {
          headers['X-Wallet-Address'] = address;
        }
        
        // Hacer la solicitud directamente con axios
        const response = await axios.post(
          '/api/admin/app-config', 
          {
            key: 'app_version',
            value: initialVersion,
            description: 'Versión actual de la aplicación',
          },
          { headers, withCredentials: true }
        );
        
        return response.data;
      } catch (error) {
        console.log('Error en la creación de versión:', error);
        // Manejar errores específicos
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new Error('No tiene permisos para inicializar la versión.');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/app-config/version'] });
      queryClient.invalidateQueries({ queryKey: ['/api/app-config'] });
      toast({
        title: t('¡Versión inicializada!'),
        description: t('La versión de la aplicación ha sido inicializada correctamente.'),
      });
      setIsEditing(false);
    },
    onError: (error) => {
      // Evitar mostrar errores de autenticación en consola
      if (!(error instanceof Error && error.message.includes('401'))) {
        console.log('Detalles del error de creación:', error);
      }
      
      toast({
        title: t('Error'),
        description: error instanceof Error && error.message.includes('401')
          ? t('No tiene permisos para inicializar la versión.')
          : t('No se pudo inicializar la versión. Por favor intente nuevamente.'),
        variant: 'destructive',
      });
    },
  });

  // Establecer la versión actual en el estado cuando se carga
  useEffect(() => {
    if (versionData && versionData.version) {
      setVersion(versionData.version);
    }
  }, [versionData]);

  // Manejar la acción de guardar cambios
  const handleSave = () => {
    if (!version.trim()) {
      toast({
        title: t('Error'),
        description: t('La versión no puede estar vacía.'),
        variant: 'destructive',
      });
      return;
    }

    // Si la versión no existe, crearla; de lo contrario, actualizarla
    if (error && (error as any).status === 404) {
      createVersion.mutate(version);
    } else {
      updateVersion.mutate(version);
    }
  };

  // Manejar el inicio de la edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Manejar la cancelación de la edición
  const handleCancel = () => {
    if (versionData && versionData.version) {
      setVersion(versionData.version);
    } else {
      setVersion('');
    }
    setIsEditing(false);
  };

  // Renderizar el componente
  return (
    <Card className="w-full max-w-xl mx-auto border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t('Gestión de Versión')}</CardTitle>
        <CardDescription>
          {t('Desde aquí puede gestionar la versión actual de la aplicación que ven los usuarios.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <CircleLoader size={40} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="version" className="text-sm font-medium">
                {t('Versión de la Aplicación')}
              </label>
              {isEditing ? (
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  disabled={updateVersion.isPending || createVersion.isPending}
                />
              ) : (
                <div className="flex items-center justify-between p-2 border rounded-md bg-muted/10">
                  <span className="font-mono">
                    {error && (error as any).status === 404
                      ? t('No configurada')
                      : version || t('Cargando...')}
                  </span>
                  {isAuthenticated && (
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                      {t('Editar')}
                    </Button>
                  )}
                </div>
              )}
              {error && (error as any).status !== 404 && (
                <p className="text-xs text-destructive">{t('Error al cargar la versión de la aplicación')}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={updateVersion.isPending || createVersion.isPending}>
            {t('Cancelar')}
          </Button>
          <Button onClick={handleSave} disabled={updateVersion.isPending || createVersion.isPending}>
            {updateVersion.isPending || createVersion.isPending ? (
              <CircleLoader size={16} className="mr-2" />
            ) : null}
            {error && (error as any).status === 404 ? t('Inicializar') : t('Actualizar')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}