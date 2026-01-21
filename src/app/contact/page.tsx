import { Metadata } from "next"
import { getContactInfo, getSiteSettings } from "@/lib/data"
import { ContactContent } from "./contact-content"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for project inquiries or collaborations.",
}

export const revalidate = 0

export default async function ContactPage() {
  const [contactInfo, siteSettings] = await Promise.all([
    getContactInfo(),
    getSiteSettings(),
  ])
  
  return <ContactContent contactInfo={contactInfo} siteSettings={siteSettings} />
}
