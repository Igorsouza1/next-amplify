'use client'

import useAdminCheck from "@/hooks/use-admincheck";
import { Button } from "@/components/ui/button";
import Link from 'next/link'; // Importa o Link do Next.js



interface IconProps {
    className?: string;
  }



export default function isAdminComponent() {
    
    const isAdmin = useAdminCheck();

    if(isAdmin) {
    return (
        <Link href="/admin" passHref>
            <Button variant="ghost" size="icon">
                <DatabaseIcon className="w-6 h-6" />
            </Button>
        </Link>
    )
}
}




export function DatabaseIcon(props: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
        <path d="M3 12a9 3 0 0 0 18 0" />
      </svg>
    );
  }