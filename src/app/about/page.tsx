import { Metadata } from "next"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Seraph Kamos - where time meets the eternal.",
}

export default function AboutPage() {
  return <AboutContent />
}
