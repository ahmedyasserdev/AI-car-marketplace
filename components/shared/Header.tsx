import Image from "next/image";
import Link from "./Link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Heart, CarFront, Layout, ArrowLeft } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
import { UserRole } from "@prisma/client";

type HeaderProps = {
  isAdminPage?: boolean;
};

const navigationLinks = [
  {
    href: "/saved-cars",
    icon: Heart,
    text: "Saved Cars",
    variant: "default" as const,
    className: "flex items-center gap-2",
  },
  {
    href: "/reservations",
    icon: CarFront,
    text: "My Reservations",
    variant: "outline" as const,
    className: "text-gray-600 hover:text-blue-600 flex items-center gap-2",
  },
];

const Header = async ({ isAdminPage = false }: HeaderProps) => {
  const user = await checkUser()
  const isAdmin = user?.role === UserRole.ADMIN; 

  return (
    <header className="bg-white/80 backdrop-blur-md fixed w-full top-0 z-50 border-b">
      <nav className="mx-auto p-4 flex-between">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex">
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          {isAdminPage && <span className="text-xs font-extralight">admin</span>}
        </Link>

        <div className="flex items-center gap-x-4">
          {isAdminPage ? (
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                <span>Back to App</span>
              </Button>
            </Link>
          ) : (
            <SignedIn>
              {!isAdmin &&
                navigationLinks.map(({ href, icon: Icon, text, variant, className }) => (
                  <Link key={href} href={href} className={className}>
                    <Button variant={variant}>
                      <Icon size={18} />
                      <span className="hidden md:inline">{text}</span>
                    </Button>
                  </Link>
                ))}

              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}

          <SignedOut>
            {!isAdminPage && (
              <SignInButton forceRedirectUrl="/">
                <Button variant="outline">Login</Button>
              </SignInButton>
            )}
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;

