import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useSimpleWallet } from '@/hooks/use-simple-wallet';
import { getIsAdmin } from '@/lib/user-service';
import { SimpleConnectButton } from '@/components/wallet/simple-connect-button';
import { Menu, X } from 'lucide-react';
import { Button } from './button';
import { Avatar, AvatarFallback } from './avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './dropdown-menu';

export default function Header() {
  const { account } = useSimpleWallet();
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Verificar si el usuario es admin cuando se conecta una wallet
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (account) {
        const adminStatus = await getIsAdmin(account);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [account]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const getNavLinkClass = (path: string) => {
    return `text-sm font-medium transition-colors hover:text-primary ${
      location === path ? 'text-primary' : 'text-muted-foreground'
    }`;
  };
  
  const getAvatarFallback = () => {
    if (!account) return "?";
    return account.substring(0, 2);
  };
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center">
          <Link href="/">
            <a className="font-bold text-xl mr-6 cursor-pointer">Waybank</a>
          </Link>
        </div>
        
        {/* Navegación en escritorio */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard">
            <a className={getNavLinkClass('/dashboard')}>Dashboard</a>
          </Link>
          <Link href="/positions">
            <a className={getNavLinkClass('/positions')}>Posiciones</a>
          </Link>
          <Link href="/invoices">
            <a className={getNavLinkClass('/invoices')}>Facturas</a>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <a className={getNavLinkClass('/admin')}>Admin</a>
            </Link>
          )}
          {account && (
            <Link href="/billing-profile">
              <a className={getNavLinkClass('/billing-profile')}>Perfil de Facturación</a>
            </Link>
          )}
        </nav>
        
        {/* Botones de acción */}
        <div className="flex items-center space-x-4">
          {/* Wallet y perfil */}
          <div className="hidden md:block">
            {account ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1">
                    <Avatar>
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="truncate max-w-[200px]">{account}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/billing-profile')}
                  >
                    Perfil de Facturación
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SimpleConnectButton />
            )}
          </div>
          
          {/* Botón de menú en móvil */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4 bg-background border-b">
            <Link href="/dashboard">
              <a 
                className={getNavLinkClass('/dashboard')} 
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </a>
            </Link>
            <Link href="/positions">
              <a 
                className={getNavLinkClass('/positions')} 
                onClick={() => setIsMenuOpen(false)}
              >
                Posiciones
              </a>
            </Link>
            <Link href="/invoices">
              <a 
                className={getNavLinkClass('/invoices')} 
                onClick={() => setIsMenuOpen(false)}
              >
                Facturas
              </a>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <a 
                  className={getNavLinkClass('/admin')} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </a>
              </Link>
            )}
            {account && (
              <Link href="/billing-profile">
                <a 
                  className={getNavLinkClass('/billing-profile')} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Perfil de Facturación
                </a>
              </Link>
            )}
            <div className="pt-2">
              {!account && <SimpleConnectButton />}
              {account && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-[200px]">{account}</span>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}