"use client";

import { LogOut } from "lucide-react";
import { signOut } from "aws-amplify/auth";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function Logout() {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });

      // Mostra o toast de sucesso
      toast({
        variant: "default",
        duration: 3000,
        title: "Sucesso",
        description: "Saida efetuada com sucesso.",
      });

      // Redireciona após logout
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Erro",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
      });
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-basetext outline-none transition-colors focus:bg-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair</span>
    </DropdownMenuItem>
  );
}
