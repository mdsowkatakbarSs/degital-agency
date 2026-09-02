"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <span className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary/60 to-primary">
            404
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full px-6">
            <Link href="/">
              <Home className="mr-2 w-4 h-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="#services">
              <ArrowLeft className="mr-2 w-4 h-4" />
              View services
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
