"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"

function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = React.useState(true)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div className="relative">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight">Fique por dentro</h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
              Assine nossa newsletter para receber novidades e conteúdos exclusivos da MadeAI.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                className="pr-12 backdrop-blur-sm text-sm"
                aria-label="Seu e-mail"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Inscrever-se</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Links rápidos</h3>
            <nav className="space-y-2 text-xs sm:text-sm">
              <a href="/" className="block transition-colors hover:text-primary">Início</a>
              <a href="/sobre" className="block transition-colors hover:text-primary">Sobre</a>
              <a href="/servicos" className="block transition-colors hover:text-primary">Serviços</a>
              <a href="/produtos" className="block transition-colors hover:text-primary">Produtos</a>
              <a href="/contato" className="block transition-colors hover:text-primary">Contato</a>
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Contato</h3>
            <address className="space-y-2 text-xs sm:text-sm not-italic">
              <p>Rua 2480, 100 – Sala 06</p>
              <p>Balneário Camboriú – SC</p>
              <p>Telefone: +55 (11) 99999-9999</p>
              <p>E-mail: contato@madeai.com</p>
            </address>
          </div>

          {/* Redes + toggle */}
          <div className="relative">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Siga a MadeAI</h3>
            <div className="mb-4 sm:mb-6 flex space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 p-3" asChild>
                      <a href="#" aria-label="Facebook da MadeAI">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Siga no Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" asChild>
                      <a href="#" aria-label="Twitter/X da MadeAI">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Siga no X (Twitter)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" asChild>
                      <a href="https://instagram.com/madeai.br" aria-label="Instagram da MadeAI" target="_blank">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Siga no Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" asChild>
                      <a href="#" aria-label="LinkedIn da MadeAI">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Conecte-se no LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" aria-hidden />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4" aria-hidden />
              <Label htmlFor="dark-mode" className="sr-only">
                Alternar modo escuro
              </Label>
            </div>
          </div>
        </div>

        {/* Base do footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} MadeAI. Todos os direitos reservados.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="/politica-de-privacidade" className="transition-colors hover:text-primary">
              Política de Privacidade
            </a>
            <a href="/termos-de-servico" className="transition-colors hover:text-primary">
              Termos de Serviço
            </a>
            <a href="/cookies" className="transition-colors hover:text-primary">
              Configurações de Cookies
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }