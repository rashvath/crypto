// src/app/sign-up/[[...sign-up]]/page.tsx
"use client";

import Footer from "@/components/Footer";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </div>
      <Footer />
    </>
  );
}
