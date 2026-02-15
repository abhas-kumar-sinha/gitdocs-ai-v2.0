"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import MegaMenu from "./MegaMenu";
import { useAuth } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { TextAlignJustify } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import SupportMenu from "./SupportMenu";

const navLinks = [
  {
    href: "/",
    title: "features",
    type: "dropdown"
  },
  {
    href: "/view-templates",
    title: "templates",
    type: "self-link"
  },
  {
    href: "/blogs",
    title: "blogs",
    type: "self-link"
  },
  {
    href: "/changelog",
    title: "changelog",
    type: "self-link"
  },
  {
    href: "https://github.com/sponsors/abhas-kumar-sinha",
    title: "support",
    type: "dropdown"
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5",
        scrolled ? "backdrop-blur-md" : "",
      )}
    >
      <div className="container mx-auto ps-6 pe-10 md:px-6 lg:px-20">
        <div className="flex items-center justify-between">
          <Link
            prefetch={true}
            href="/"
            className="md:flex items-center space-x-2 hidden"
          >
            <Image src={"/logo.png"} width={33} height={33} alt="logo" />
            <span className="text-lg font-semibold font-geist">GitDocs AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav role="navigation" className="text-foreground md:flex hidden">
            <NavigationMenu>
              <NavigationMenuList className="lg:ms-10 items-center lg:space-x-6 space-x-2">
                {navLinks.map((navItem, idx) => {
                  return (
                    <NavigationMenuItem key={idx}>
                      {navItem.type === "dropdown" 
                      ? navItem.href === "/"
                      ? <> 
                          <NavigationMenuTrigger className="-me-4">
                            <Link
                              prefetch={true}
                              href={navItem.href}
                              className="text-sm capitalize relative font-medium hover:text-accent-foreground transition-colors flex items-center gap-1"
                            >
                              {navItem.title}
                            </Link>
                          </NavigationMenuTrigger> 
                          <NavigationMenuContent>
                            <MegaMenu />
                          </NavigationMenuContent> 
                        </>
                      : <> 
                          <NavigationMenuTrigger className="-ms-4">
                            <Link
                              prefetch={true}
                              href={navItem.href}
                              className="text-sm capitalize relative font-medium hover:text-accent-foreground transition-colors flex items-center gap-1"
                            >
                              {navItem.title}
                            </Link>
                          </NavigationMenuTrigger> 
                          <NavigationMenuContent>
                            <SupportMenu />
                          </NavigationMenuContent> 
                        </>
                      : <NavigationMenuLink asChild>
                        <Link
                          prefetch={true}
                          href={navItem.href}
                          target={navItem.type === "out-link" ? "_blank" : "_self"}
                          className="text-sm capitalize relative font-medium hover:text-accent-foreground transition-colors flex items-center gap-1"
                        >
                          {navItem.title}
                        </Link>
                      </NavigationMenuLink>}
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Mobile Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost">
                <TextAlignJustify />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuGroup>
                {navLinks.map((navItem, idx) => {
                  return (
                    <DropdownMenuItem key={idx}>
                      <Link
                        prefetch={true}
                        className="capitalize text-sm my-1"
                        href={navItem.href}
                      >
                        {navItem.title}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className={!isLoaded ? "flex items-center space-x-2" : "hidden"}>
            <div className="h-3 w-18 rounded bg-background animate-pulse" />
            <div className="h-9 w-9 shrink-0 rounded-full bg-background animate-pulse" />
          </div>

          {/* CTA Buttons */}
          <SignedOut>
            <div className="items-center space-x-4">
              <div className="hidden lg:inline-flex">
                <SignInButton mode="modal">
                  <p
                    className={`cursor-pointer ${buttonVariants({ variant: "ghost" })}`}
                  >
                    Log In
                  </p>
                </SignInButton>
              </div>
              <SignUpButton mode="modal">
                <p
                  className={`cursor-pointer ${buttonVariants({ variant: "outline" })}`}
                >
                  Get Started
                </p>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="scale-110 dark:invert">
              <UserButton showName={true}></UserButton>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
