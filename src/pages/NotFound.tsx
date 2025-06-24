
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:via-[#1a1a1a] dark:to-[#232323] flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full text-center">
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-[#1a1a1a]/95 dark:border-[#333] backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 p-4 rounded-full w-fit mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-6xl sm:text-7xl font-bold text-foreground dark:text-[#f2f2f2] mb-2">404</CardTitle>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground dark:text-[#f2f2f2] mb-2">
                Página não encontrada
              </h2>
              <p className="text-muted-foreground dark:text-[#bbbbbb] text-sm sm:text-base">
                A página que você está procurando não existe ou foi movida.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-muted dark:bg-[#232323] p-3 rounded-lg">
                <p className="text-xs text-muted-foreground dark:text-[#bbbbbb] break-all">
                  <strong>URL:</strong> {location.pathname}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline" 
                  className="flex-1 border-border dark:border-[#333] text-foreground dark:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323] transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Link to="/" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-green-700 dark:hover:to-green-600 transition-all duration-200">
                    <Home className="h-4 w-4 mr-2" />
                    Página Inicial
                  </Button>
                </Link>
              </div>
              
              <div className="text-xs text-muted-foreground dark:text-[#bbbbbb] pt-2">
                <p>Se você acredita que isso é um erro, entre em contato conosco.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
