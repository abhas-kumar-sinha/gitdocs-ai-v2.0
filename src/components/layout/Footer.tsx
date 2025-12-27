import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Linkedin, Twitter } from "lucide-react";

const navLinks = [
  {
    href: "/",
    title: "create",
  },
  {
    href: "/templates",
    title: "templates",
  },
  {
    href: "/blog",
    title: "blogs",
  },
  {
    href: "/changelog",
    title: "changelog",
  },
];

const Footer = () => {
  return (
    <div className="bg-sidebar/95 w-19/20 max-w-[1220px] mx-auto rounded-xl px-6 md:px-14 py-16 mb-8 border border-neutral-200/50 dark:border-neutral-700/50">
      <div className="flex items-start flex-wrap gap-y-10">
        <div className="flex flex-col gap-y-2 items-start md:w-1/2 lg:w-3/5">
          <button className="p-2 hover:bg-background/80 transition-all rounded-xl cursor-pointer mx-auto md:mx-0">
            <Image
              src="/logo.png"
              height={50}
              width={50}
              alt="logo"
              className="h-10 w-10"
            />
          </button>
          <p className="text-foreground/60 md:max-w-76 lg:max-w-96 text-center md:text-start">
            Transform your documentation process with the power of AI. Save time
            and keep your docs in sync with your code.
          </p>
        </div>
        <div className="md:w-1/2 lg:w-2/5 flex flex-wrap gap-y-8 gap-x-4 flex-1 justify-between lg:pe-6">
          <div className="flex flex-col">
            <span className="uppercase text-[10px] text-foreground/50 mb-1.5">
              product
            </span>
            {navLinks.map((navItem, idx) => {
              return (
                <Link
                  href={navItem.href}
                  key={idx}
                  className="mt-1.5 capitalize text-foreground/70"
                >
                  {navItem.title}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col">
            <span className="uppercase text-[10px] text-foreground/50 mb-1.5">
              resources
            </span>
            {navLinks.map((navItem, idx) => {
              return (
                <Link
                  href={navItem.href}
                  key={idx}
                  className="mt-1.5 capitalize text-foreground/70"
                >
                  {navItem.title}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col">
            <span className="uppercase text-[10px] text-foreground/50 mb-1.5">
              connect
            </span>
            {navLinks.map((navItem, idx) => {
              return (
                <Link
                  href={navItem.href}
                  key={idx}
                  className="mt-1.5 capitalize text-foreground/70"
                >
                  {navItem.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="mt-8 md:mt-18 mb-8 border border-neutral-200/50 dark:border-neutral-800/50" />

      <div className="flex flex-wrap gap-y-4 justify-center items-center md:justify-between">
        <span className="text-sm text-foreground/50 text-center md:text-start">
          © 2025 Gitdocs AI. All rights reserved. Made with 💖 by&nbsp;
          <a
            href="https://github.com/abhas-kumar-sinha"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-primary transition-all"
          >
            Abhas Kumar Sinha
          </a>
        </span>
        <div className="flex gap-x-4">
          <Button variant="outline" className="cursor-pointer">
            <Twitter />
          </Button>
          <Button variant="outline" className="cursor-pointer">
            <Linkedin />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Footer;
