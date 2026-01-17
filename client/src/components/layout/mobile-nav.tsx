import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { useAdmin } from "@/hooks/use-admin";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";
import { useMenuTranslations } from "@/translations/menu";
import { 
  LayoutDashboard, 
  PanelLeft, 
  Plus, 
  BarChart, 
  Settings,
  Menu,
  Wallet,
  HelpCircle,
  ShieldCheck,
  Database
} from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();
  const { theme, setTheme, toggleTheme } = useTheme();
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const menuT = useMenuTranslations();

  const isDark = theme === "dark" || (theme === "system" && 
    window.matchMedia("(prefers-color-scheme: dark)").matches);

  const getPageTitle = () => {
    switch (location) {
      case "/":
        return menuT.dashboard;
      case "/positions":
        return menuT.myPositions;
      case "/nfts":
        return menuT.myNFTs;
      case "/add-liquidity":
        return menuT.addLiquidity;
      case "/analytics":
        return menuT.analytics;
      case "/settings":
        return menuT.settings;
      case "/pools":
        return menuT.pools;
      case "/invoices":
        return menuT.invoices;
      case "/referrals":
        return menuT.referrals;
      case "/admin":
        return menuT.superAdmin;
      case "/support":
        return menuT.support;
      default:
        return "WayBank";
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      <div className="md:hidden bg-white dark:bg-slate-800 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            title="Centro de Ayuda"
            className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full h-9 w-9"
          >
            <a 
              href="https://waybank.info" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => {
                sendGAEvent('help_button_click', {
                  from: 'mobile_dashboard_header',
                  theme: isDark ? 'dark' : 'light'
                });
              }}
            >
              <HelpCircle className="h-5 w-5" />
            </a>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:max-w-xs">
              <SheetHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <SheetTitle className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span>WayBank</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    asChild
                    title="Centro de Ayuda"
                    className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full h-8 w-8"
                  >
                    <a 
                      href="https://waybank.info" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => {
                        sendGAEvent('help_button_click', {
                          from: 'mobile_dashboard_menu',
                          theme: isDark ? 'dark' : 'light'
                        });
                      }}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </a>
                  </Button>
                </SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <ul className="space-y-1">
                  <li>
                    <div 
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                        isActive("/")
                          ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      }`}
                    >
                      <Link href="/">
                        <div 
                          className="flex items-center space-x-3 w-full" 
                          onClick={() => setIsOpen(false)}
                        >
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
                        <div 
                          className="flex items-center space-x-3 w-full"
                          onClick={() => setIsOpen(false)}
                        >
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
                        <div 
                          className="flex items-center space-x-3 w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Wallet className="h-5 w-5" />
                          <span>{menuT.myNFTs}</span>
                        </div>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                        isActive("/add-liquidity")
                          ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      }`}
                    >
                      <Link href="/add-liquidity">
                        <div 
                          className="flex items-center space-x-3 w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Plus className="h-5 w-5" />
                          <span>{menuT.addLiquidity}</span>
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
                        <div 
                          className="flex items-center space-x-3 w-full"
                          onClick={() => setIsOpen(false)}
                        >
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
                        <div 
                          className="flex items-center space-x-3 w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Database className="h-5 w-5" />
                          <span>{menuT.pools}</span>
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
                        <div 
                          className="flex items-center space-x-3 w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          <span>{menuT.settings}</span>
                        </div>
                      </Link>
                    </div>
                  </li>
                  {isAdmin && (
                    <li>
                      <div
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                          isActive("/admin")
                            ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        }`}
                      >
                        <Link href="/admin">
                          <div 
                            className="flex items-center space-x-3 w-full"
                            onClick={() => setIsOpen(false)}
                          >
                            <ShieldCheck className="h-5 w-5" />
                            <span>{menuT.superAdmin}</span>
                          </div>
                        </Link>
                      </div>
                    </li>
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
                        <div 
                          className="flex items-center space-x-3 w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <HelpCircle className="h-5 w-5" />
                          <span>{menuT.support}</span>
                        </div>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">{menuT.darkMode}</span>
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around p-3 z-10">
        <div className={`px-2 py-1 ${isActive("/") ? "text-primary-500" : "text-slate-500 dark:text-slate-400"}`}>
          <Link href="/">
            <div className="flex flex-col items-center">
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs mt-1">{menuT.dashboard}</span>
            </div>
          </Link>
        </div>
        <div className={`px-2 py-1 ${isActive("/positions") ? "text-primary-500" : "text-slate-500 dark:text-slate-400"}`}>
          <Link href="/positions">
            <div className="flex flex-col items-center">
              <PanelLeft className="h-5 w-5" />
              <span className="text-xs mt-1">{menuT.myPositions}</span>
            </div>
          </Link>
        </div>
        <div className={`px-2 py-1 ${isActive("/pools") ? "text-primary-500" : "text-slate-500 dark:text-slate-400"}`}>
          <Link href="/pools">
            <div className="flex flex-col items-center">
              <Database className="h-5 w-5" />
              <span className="text-xs mt-1">{menuT.pools}</span>
            </div>
          </Link>
        </div>
        <div className={`px-2 py-1 ${isActive("/add-liquidity") ? "text-primary-500" : "text-slate-500 dark:text-slate-400"}`}>
          <Link href="/add-liquidity">
            <div className="flex flex-col items-center">
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1">{menuT.addLiquidity.split(' ')[0]}</span>
            </div>
          </Link>
        </div>
        <div className={`px-2 py-1 ${isActive("/analytics") ? "text-primary-500" : "text-slate-500 dark:text-slate-400"}`}>
          <Link href="/analytics">
            <div className="flex flex-col items-center">
              <BarChart className="h-5 w-5" />
              <span className="text-xs mt-1">{menuT.analytics}</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
