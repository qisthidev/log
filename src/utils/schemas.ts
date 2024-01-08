import type { Faqs } from "types";

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
