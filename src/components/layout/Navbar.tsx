"use client"

import {useState, useEffect} from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { TextAlignJustify } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';

const navLinks = [
  {
    href: "/",
    title: "create"
  },
  {
    href: "/templates",
    title: "templates"
  },
  {
    href: "/blog",
    title: "blogs"
  },
  {
    href: "/changelog",
    title: "changelog"
  },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
      className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5', scrolled ? "backdrop-blur-md" : "")}
    >
      <div className="container mx-auto ps-6 pe-10 md:px-10 lg:px-20">
        <div className="flex items-center justify-between">
          <Link prefetch={true} href="/" className="md:flex items-center space-x-2 hidden">
            <Image src={"/logo.png"} width={33} height={33} alt="logo" />
            <span className="text-lg font-semibold font-geist">GitDocs AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:ms-10 ms-6 md:flex items-center lg:space-x-8 space-x-5 text-white/50">
            {navLinks.map((navItem, idx) => {
              return (<Link
              key={idx}
              prefetch={true}
              href={navItem.href}
              className="text-xs uppercase relative font-medium hover:text-white transition-colors"
            >
              {navItem.title}
            </Link>)
            })}
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
                      <Link prefetch={true} className="uppercase text-xs my-1" href={navItem.href}>
                        {navItem.title}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CTA Buttons */}
          <SignedOut>
            <div className="items-center space-x-4">
              <SignInButton mode="modal">
                <p
                  className={`cursor-pointer ${buttonVariants({ variant: "ghost" })}`}
                >
                  Log In
                </p>
              </SignInButton>
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
              <UserButton showName={true}>
              </UserButton>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
