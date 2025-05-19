// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import Footer from "@/components/Footer";
import { NavBar } from "@/components/navbar";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
      <NavBar wishlistCount={0} />
      <div className="flex justify-center items-center min-h-screen">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
      <Footer />
    </>
  );
}
