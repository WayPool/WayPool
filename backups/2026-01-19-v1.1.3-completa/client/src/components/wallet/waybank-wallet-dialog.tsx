import React, { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Shield } from "lucide-react";
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

interface WayBankWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onCreateWallet: (email: string, password: string, confirmPassword: string) => void;
  onForgotPassword: () => void;
}

// Traducciones para WayBank Wallet
const walletTranslations = {
  en: {
    title: "WayBank Wallet",
    subtitle: "Create a custodial wallet quickly and securely",
    createWallet: "Create Wallet",
    login: "Login",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    continue: "Continue",
    accessProblems: "Access problems?",
    forgotPassword: "Forgot password?",

    back: "Back"
  },
  es: {
    title: "WayBank Wallet",
    subtitle: "Crea una billetera custodiada de manera rápida y segura",
    createWallet: "Crear Wallet",
    login: "Iniciar Sesión",
    email: "Correo",
    password: "Contraseña",
    confirmPassword: "Confirmar Password",
    continue: "Continuar",
    accessProblems: "¿Problemas para acceder?",
    forgotPassword: "¿Olvidaste tu contraseña?",

    back: "Volver"
  },
  fr: {
    title: "WayBank Wallet",
    subtitle: "Créez un portefeuille sécurisé rapidement et en toute sécurité",
    createWallet: "Créer Portefeuille",
    login: "Connexion",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    continue: "Continuer",
    accessProblems: "Problèmes d'accès ?",
    forgotPassword: "Mot de passe oublié ?",

    back: "Retour"
  },
  de: {
    title: "WayBank Wallet",
    subtitle: "Erstellen Sie schnell und sicher ein Verwahrungs-Wallet",
    createWallet: "Wallet erstellen",
    login: "Anmelden",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    continue: "Fortfahren",
    accessProblems: "Zugangsprobleme?",
    forgotPassword: "Passwort vergessen?",

    back: "Zurück"
  },
  pt: {
    title: "WayBank Wallet",
    subtitle: "Crie uma carteira custodiada de forma rápida e segura",
    createWallet: "Criar Carteira",
    login: "Iniciar Sessão",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    continue: "Continuar",
    accessProblems: "Problemas de acesso?",
    forgotPassword: "Esqueceu sua senha?",

    back: "Voltar"
  },
  ar: {
    title: "محفظة وايبول",
    subtitle: "قم بإنشاء محفظة آمنة بسرعة وأمان",
    createWallet: "إنشاء محفظة",
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    continue: "متابعة",
    accessProblems: "مشاكل في الوصول؟",
    forgotPassword: "نسيت كلمة المرور؟",
    recoverWithSeedPhrase: "استعادة باستخدام العبارة الأساسية",
    back: "رجوع"
  },
  zh: {
    title: "WayBank 钱包",
    subtitle: "快速安全地创建托管钱包",
    createWallet: "创建钱包",
    login: "登录",
    email: "电子邮件",
    password: "密码",
    confirmPassword: "确认密码",
    continue: "继续",
    accessProblems: "访问问题？",
    forgotPassword: "忘记密码？",
    recoverWithSeedPhrase: "使用助记词恢复",
    back: "返回"
  },
  it: {
    title: "WayBank Wallet",
    subtitle: "Crea un wallet custodial in modo rapido e sicuro",
    createWallet: "Crea Wallet",
    login: "Accedi",
    email: "Email",
    password: "Password",
    confirmPassword: "Conferma Password",
    continue: "Continua",
    accessProblems: "Problemi di accesso?",
    forgotPassword: "Password dimenticata?",
    recoverWithSeedPhrase: "Recupera con frase seed",
    back: "Indietro"
  },
  hi: {
    title: "वेपूल वॉलेट",
    subtitle: "जल्दी और सुरक्षित रूप से एक कस्टोडियल वॉलेट बनाएं",
    createWallet: "वॉलेट बनाएं",
    login: "लॉगिन",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    continue: "जारी रखें",
    accessProblems: "एक्सेस की समस्या?",
    forgotPassword: "पासवर्ड भूल गए?",
    recoverWithSeedPhrase: "सीड फ्रेज से पुनर्प्राप्त करें",
    back: "वापस"
  }
};

/**
 * Componente de diálogo de WayBank Wallet
 * Implementa las traducciones para todos los idiomas soportados
 */
export const WayBankWalletDialog = ({
  isOpen,
  onClose,
  onLogin,
  onCreateWallet,
  onForgotPassword,
  onRecoverWithSeedPhrase
}: WayBankWalletDialogProps) => {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Obtener traducciones para el idioma actual
  const t = walletTranslations[language] || walletTranslations.en;

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-blue-500" />
            <DialogTitle>{t.title}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {t.subtitle}
          </p>
        </DialogHeader>

        <Tabs defaultValue="login" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" className="text-sm">
              {t.login}
            </TabsTrigger>
            <TabsTrigger value="create" className="text-sm">
              {t.createWallet}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t.email}
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t.password}
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t.confirmPassword}
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleCreateWallet}
            >
              {t.continue}
            </Button>
          </TabsContent>

          <TabsContent value="login" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t.email}
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t.password}
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleLogin}
            >
              {t.login}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground mb-2">
                {t.accessProblems}
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full text-sm" 
                  onClick={onForgotPassword}
                >
                  <span className="mr-2">🔑</span> {t.forgotPassword}
                </Button>

              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="mt-2 mx-auto"
          >
            <span className="mr-1">✕</span> {t.back}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WayBankWalletDialog;