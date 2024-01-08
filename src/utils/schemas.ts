import type { Faqs } from "types";
import { getCollection } from "astro:content";
import getSortedPosts from "./getSortedPosts";

export const faqSchema = (faqs?: Faqs) => {
  let faqSchema: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }> = [];

  faqs?.forEach(faq => {
    faqSchema.push({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    });
  });

  return faqSchema;
};

export const blogSchema = (
  isDetail: boolean | undefined,
  canonicalURL: string,
  author: string,
  title: string,
  socialImageURL: string,
  pubDatetime: Date | undefined,
  modDatetime: Date | null | undefined
) => {
  let blogPostSchema = {};

  if (isDetail) {
    blogPostSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalURL,
      },
      author: {
        "@type": "Person",
        name: author,
        url: "https://www.qisthi.dev/about",
      },
      headline: title,
      image: socialImageURL,
      datePublished: pubDatetime?.toISOString(),
    };

    if (modDatetime) {
      blogPostSchema = {
        ...blogPostSchema,
        dateModified: modDatetime.toISOString(),
      };
    }
  }

  return blogPostSchema;
};

export const aboutSchema = async () => {
  const posts = await getCollection("blog");
  const sortedPosts = await getSortedPosts(posts);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2023-12-15T12:34:00-05:00",
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@id": "#main-author",
      "@type": "Person",
      name: "Qisthi Ramadhani",
      alternateName: "Pengembang QLog",
      identifier: "ramageek",
      knowsAbout: [
        {
          "@type": "Thing",
          name: "Laravel",
        },
        {
          "@type": "Thing",
          name: "Remix",
        },
      ],
      description:
        "Pengembang web full-stack dengan fokus pada framework Laravel dan Remix. Penulis dan pencipta QLog, platform bagi para penggemar teknologi untuk belajar dan tumbuh.",
      image: "https://www.qisthi.dev/avatar.jpeg",
      url: "https://www.qisthi.dev/about",
    },
    hasPart: sortedPosts.map(post => {
      return {
        "@type": "Article",
        headline: post.data.title,
        url: `https://www.qisthi.dev/posts/${post.slug}`,
        datePublished: post.data.pubDatetime?.toISOString(),
        image: `https://www.qisthi.dev/posts/${post.slug}.png`,
        author: { "@id": "#main-author" },
      };
    }),
  };
};
