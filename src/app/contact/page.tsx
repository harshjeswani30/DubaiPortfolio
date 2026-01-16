import { Metadata } from "next"
import { ContactContent } from "./contact-content"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for project inquiries or collaborations.",
}

export default function ContactPage() {
  return <ContactContent />
}
