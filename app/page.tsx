import Image from "next/image";
import { ExampleComponent } from "./ExampleComponent";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-8">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">
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
