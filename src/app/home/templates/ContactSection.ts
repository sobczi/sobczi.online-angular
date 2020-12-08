import { Links, BasicData, ContactElement } from '@home/models'

export const ContactSection: ContactElement[] = [
  {
    name: BasicData.email,
    href: `mailto:${BasicData.email}`,
    icon: 'email'
  },
  {
    name: BasicData.phone,
    href: `tel:${BasicData.phone}`,
    icon: 'phone'
  },
  {
    name: BasicData.fullName,
    image: 'linkedin.png',
    handler: () => window.open(Links.LINKEDIN)
  },
  {
    name: BasicData.githubName,
    image: 'github.png',
    handler: () => window.open(Links.GITHUB)
  }
]
