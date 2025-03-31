"use client";
import { Suspense } from "react";
import Spinner from "../components/atoms/Spinner/Spinner";
import HomePage from "./HomePage";

export default function HomePageWrapper() {
  return (
    <Suspense
      fallback={
        <Spinner className="border-8 h-32 w-32 border-gray-600 text-gray-600" />
      }
    >
      <HomePage />
    </Suspense>
  );
}
