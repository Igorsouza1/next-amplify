import { Button } from "@/components/ui/button";
import { DropdownMenuUser } from "@/components/dropdown/dropdown";
import Link from 'next/link'; // Importa o Link do Next.js

interface IconProps {
  className?: string;
}

export function Sidebar() {
  return (
    <div className="flex flex-col items-center w-16 h-screen border-r bg-basebackground z-10">
      <div className="mt-4 border-b w-full pb-2 flex flex-col justify-center items-center">
        <TriangleIcon className="w-6 h-6 " />
      </div>
      <div className="flex flex-col items-center py-4 space-y-4">
        <Link href="/map" passHref>
          <Button variant="ghost" size="icon">
            <EarthIcon className="w-6 h-6" />
          </Button>
        </Link>
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="icon">
            <DataIcon className="w-6 h-6" />
          </Button>
        </Link>
        <Link href="/config" passHref>
          <Button variant="ghost" size="icon">
            <SlidersVerticalIcon className="w-6 h-6" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center mt-auto py-4 space-y-4">
        <Link href="/help" passHref>
          <Button variant="ghost" size="icon">
            <HelpIcon className="w-6 h-6" />
          </Button>
        </Link>
        <DropdownMenuUser />
      </div>
    </div>
  );
}

function DataIcon(props: IconProps) {
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
    >
      <path d="M3 3v18h18" />
      <rect width="4" height="7" x="7" y="10" rx="1" />
      <rect width="4" height="12" x="15" y="5" rx="1" />
    </svg>
  );
}

function EarthIcon(props: IconProps) {
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
    >
      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
      <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
      <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function SlidersVerticalIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}

function TriangleIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    </svg>
  );
}



function HelpIcon(props: IconProps) {
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
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 4.24 4.24" />
      <path d="m14.83 9.17 4.24-4.24" />
      <path d="m14.83 14.83 4.24 4.24" />
      <path d="m9.17 14.83-4.24 4.24" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

