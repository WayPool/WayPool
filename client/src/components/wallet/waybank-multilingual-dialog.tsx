import React, { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Shield, Key, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { walletLoginTranslations } from "@/translations/wallet-login-translations";

interface WayBankMultilingualDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onCreateWallet: (email: string, password: string, confirmPassword: string) => void;
  onForgotPassword: () => void;
  onRecoverWithSeedPhrase: () => void;
}

/**
 * Componente de diálogo multilingüe de WayBank Wallet
 * Implementa las traducciones para todos los idiomas soportados
 */
export const WayBankMultilingualDialog = ({
  isOpen,
  onClose,
  onLogin,
  onCreateWallet,
  onForgotPassword,
  onRecoverWithSeedPhrase
}: WayBankMultilingualDialogProps) => {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Obtener traducciones para el idioma actual
  const t = walletLoginTranslations[language] || walletLoginTranslations.en;

  const handleLogin = () => {
    onLogin(email, password);
  };

  const handleCreateWallet = () => {
    onCreateWallet(email, password, confirmPassword);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md bg-[#0f1729] border-slate-800 p-4 md:p-6 rounded-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pb-0 space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Shield className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="text-slate-100">{t.title}</span>
          </DialogTitle>
          <p className="text-slate-400 text-sm">
            {t.subtitle}
          </p>
        </DialogHeader>
        
        <div className="mt-2">
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-3 bg-[#1c2438] rounded-md h-auto">
              <TabsTrigger value="login" className="flex items-center justify-center data-[state=active]:bg-blue-600 px-2 py-1.5 text-xs sm:text-sm">
                {t.login}
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center justify-center data-[state=active]:bg-blue-600 px-2 py-1.5 text-xs sm:text-sm">
                {t.createWallet}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="mt-2">
              <div className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 mb-1 block">
                    {t.email}
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 sm:h-10 bg-[#1c2438] border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 mb-1 block">
                    {t.password}
                  </label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-8 sm:h-10 bg-[#1c2438] border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 mb-1 block">
                    {t.confirmPassword}
                  </label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-8 sm:h-10 bg-[#1c2438] border-slate-700 text-white"
                  />
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                  onClick={handleCreateWallet}
                >
                  {t.continue}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="login" className="mt-2">
              <div className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 mb-1 block">
                    {t.email}
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 sm:h-10 bg-[#1c2438] border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 mb-1 block">
                    {t.password}
                  </label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-8 sm:h-10 bg-[#1c2438] border-slate-700 text-white"
                  />
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                  onClick={handleLogin}
                >
                  {t.login}
                </Button>
                
                <div className="border-t border-slate-700 pt-3 mt-4">
                  <p className="text-sm text-slate-400 mb-2 text-center">
                    {t.accessProblems}
                  </p>
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full text-xs sm:text-sm h-auto py-2 bg-[#1c2438] text-slate-200 border-slate-700 hover:bg-slate-800 flex items-center justify-start gap-2"
                      onClick={onForgotPassword}
                    >
                      <Key className="h-4 w-4 text-yellow-500" />
                      <span>{t.forgotPassword}</span>
                    </Button>
                    

                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 hover:bg-slate-800"
          >
            <X className="h-4 w-4 mr-1" />
            {t.back}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WayBankMultilingualDialog;