import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ExampleComponent } from "./ExampleComponent";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-8">
      <div className="z-10 flex w-full max-w-5xl flex-col items-center justify-between gap-4 font-mono text-sm">
        <h1 className="text-center text-2xl font-bold">
          Modal System with Zustand
        </h1>
        <p className="text-center">
          This system allows you to manage your modals with Zustand
        </p>
        <Link
          target="_blank"
          rel="noreferrer"
          href="https://github.com/vcaquant/modal_system_with_zustand"
          className={cn(buttonVariants({ variant: "outline" }), "flex gap-2")}
        >
          <Image src="/github.svg" alt="github" width={25} height={25} />
          GitHub
        </Link>
        <ExampleComponent />
      </div>
    </main>
  );
}
