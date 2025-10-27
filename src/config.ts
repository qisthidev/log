import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://log.qisthi.dev/",
  author: "Qisthi Ramadhani",
  desc: "Eksplorasi tech-savvy tentang penggunaan framework Laravel, Remix dan pemrograman web full stack.",
  title: "QLog",
  ogImage: "blog-banner.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const ADSENSE = {
  enabled: import.meta.env.ADSENSE_IS_ENABLED || true,
  publisherId:
    import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-6637656443518493",
};

export const LOCALE = {
  lang: "id", // html lang code. Set this empty and default will be "en"
  langTag: ["id-ID"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/ramaID/log",
    linkTitle: ` ${SITE.title} di Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ramageek",
    linkTitle: `${SITE.title} di Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/qisthidev",
    linkTitle: `${SITE.title} di Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ramageek",
    linkTitle: `${SITE.title} di LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:rama@qisthi.dev",
    linkTitle: `Kirim email ke ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://x.com/ramageek",
    linkTitle: `${SITE.title} di Twitter`,
    active: true,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@qisthidev",
    linkTitle: `${SITE.title} di YouTube`,
    active: true,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} di WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@qisthidev",
    linkTitle: `${SITE.title} di TikTok`,
    active: true,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];
