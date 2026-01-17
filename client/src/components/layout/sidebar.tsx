import React from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useWallet } from "@/hooks/use-wallet";
import { useAdmin } from "@/hooks/use-admin";
import { useTranslation } from "@/hooks/use-translation";
import { useMenuTranslations } from "@/translations/menu";
import { useUnreadTickets } from "@/hooks/use-unread-tickets";
import { useDefaultNetwork } from "@/hooks/use-default-network";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { NotificationDot } from "@/components/ui/notification-dot";
import Web3ConnectButton from "@/components/wallet/web3-connect-button";
import { 
  LayoutDashboard, 
  PanelLeft, 
  Plus, 
  BarChart, 
  Settings,
  Wallet,
  ShieldCheck,
  HelpCircle,
  Receipt,
  Users,
  Database
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { theme, setTheme, toggleTheme } = useTheme();
  const { address } = useWallet();
  const { isAdmin } = useAdmin();
  const { t } = useTranslation();
  const menuT = useMenuTranslations();
  const { unreadCount } = useUnreadTickets();
  const { defaultNetworkName } = useDefaultNetwork();

  const isDark = theme === "dark" || (theme === "system" && 
    window.matchMedia("(prefers-color-scheme: dark)").matches);

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className="bg-white dark:bg-slate-800 w-full md:w-64 md:h-screen shadow-lg md:flex md:flex-col flex-shrink-0 hidden md:block">
      {/* Logo and Brand */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <Link href="/" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">WayBank</h1>
            </div>
          </Link>
          
          {/* Botón de ayuda */}
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            title="Centro de Ayuda"
            className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full"
          >
            <a 
              href="https://waybank.info" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => {
                // Enviar evento a Google Analytics
                try {
                  const isDark = theme === "dark" || (theme === "system" && 
                    window.matchMedia("(prefers-color-scheme: dark)").matches);
                    
                  if (typeof window !== 'undefined') {
                    // Evento personalizado para Google Analytics
                    window.gtag?.('event', 'help_button_click', {
                      from: 'dashboard_sidebar',
                      theme: isDark ? 'dark' : 'light'
                    });
                  }
                  
                  console.log('[Google Analytics] Help button clicked from dashboard sidebar');
                } catch (error) {
                  console.error('Error tracking help button click:', error);
                }
              }}
            >
              <HelpCircle className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 flex-grow">
        <ul className="space-y-1">
          <li>
            <div 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/dashboard")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/dashboard">
                <div className="flex items-center space-x-3 w-full">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>{menuT.dashboard}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/positions")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/positions">
                <div className="flex items-center space-x-3 w-full">
                  <PanelLeft className="h-5 w-5" />
                  <span>{menuT.myPositions}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/nfts")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/nfts">
                <div className="flex items-center space-x-3 w-full">
                  <Wallet className="h-5 w-5" />
                  <span>{menuT.myNFTs}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/transfers")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/transfers">
                <div className="flex items-center space-x-3 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    <path d="M7 12h10" />
                    <path d="M15 8l4 4-4 4" />
                    <path d="M5 8l4 4" />
                    <path d="M5 16l4-4" />
                  </svg>
                  <span>{menuT.transfers}</span>
                </div>
              </Link>
            </div>
          </li>
          <li className="my-4">
            <div
              className={`flex items-center space-x-3 px-3 py-3.5 rounded-lg shadow-md
              ${isActive("/add-liquidity")
                ? "bg-gradient-to-br from-emerald-500 to-blue-600 text-white"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white"
              } transform hover:scale-[1.03] transition-all duration-300 border border-white/20`}
            >
              <Link href="/add-liquidity">
                <div className="flex items-center justify-center space-x-3 w-full">
                  <div className="bg-white/30 p-1.5 rounded-full shadow-inner animate-pulse">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-white drop-shadow-sm">{menuT.addLiquidity}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/analytics")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/analytics">
                <div className="flex items-center space-x-3 w-full">
                  <BarChart className="h-5 w-5" />
                  <span>{menuT.analytics}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/pools")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/pools">
                <div className="flex items-center space-x-3 w-full">
                  <Database className="h-5 w-5" />
                  <span>{menuT.pools}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/invoices")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/invoices">
                <div className="flex items-center space-x-3 w-full">
                  <Receipt className="h-5 w-5" />
                  <span>{menuT.invoices}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/referrals")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/referrals">
                <div className="flex items-center space-x-3 w-full">
                  <Users className="h-5 w-5" />
                  <span>{menuT.referrals}</span>
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/settings")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/settings">
                <div className="flex items-center space-x-3 w-full">
                  <Settings className="h-5 w-5" />
                  <span>{menuT.settings}</span>
                </div>
              </Link>
            </div>
          </li>
          {isAdmin && (
            <>
              <li>
                <div
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                    isActive("/admin")
                      ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  }`}
                >
                  <Link href="/admin">
                    <div className="flex items-center space-x-3 w-full">
                      <ShieldCheck className="h-5 w-5" />
                      <span>{menuT.superAdmin}</span>
                    </div>
                  </Link>
                </div>
              </li>
            </>
          )}
          <li>
            <div
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/support")
                  ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              }`}
            >
              <Link href="/support">
                <div className="flex items-center space-x-3 w-full">
                  <div className="relative">
                    <HelpCircle className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <NotificationDot 
                        count={unreadCount} 
                        size="sm"
                        className="absolute -top-1 -right-1"
                      />
                    )}
                  </div>
                  <span>{menuT.support}</span>
                  {unreadCount > 0 && (
                    <div className="ml-auto">
                      <NotificationDot 
                        count={unreadCount} 
                        showCount={true}
                        size="md"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </li>
        </ul>
      </nav>

      {/* Theme and Wallet Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">{t('Dark Mode')}</span>
          <Switch
            checked={isDark}
            onCheckedChange={toggleTheme}
          />
        </div>
        
        {/* Web3 Connect Button */}
        <div className="pt-2">
          <Web3ConnectButton fullWidth variant="outline" />
        </div>
        
        {/* Network Display - Shows user's default network */}
        {address && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">{t('Red')}: {defaultNetworkName}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
