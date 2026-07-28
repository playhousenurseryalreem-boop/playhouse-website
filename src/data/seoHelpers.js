import { branches, facilities } from "./playhouse.js";

export const siteUrl = "https://playhousenursery.ae";

const branchBySlug = Object.fromEntries(branches.map((branch) => [branch.slug, branch]));

const normalize = (value) => value.toLowerCase();

export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const keywordRouteSlug = (page, localAreas = [], keywordPages = []) => {
  const localRouteSlugs = new Set(localAreas.map((area) => `nursery-in-${area.slug}`));
  const baseSlug = localRouteSlugs.has(page.slug) ? `${page.slug}-guide` : page.slug;
  const duplicateIndex = keywordPages.filter(
    (candidate) => candidate.slug === page.slug && Number(candidate.number) < Number(page.number)
  ).length;

  return duplicateIndex > 0 ? `${baseSlug}-${duplicateIndex + 1}` : baseSlug;
};

export const nearestBranchFor = ({ city = "", area = "", keyword = "" }) => {
  const haystack = normalize(`${city} ${area} ${keyword}`);

  if (haystack.includes("dubai") || haystack.includes("mirdif") || haystack.includes("khda")) {
    return branchBySlug.mirdif;
  }

  if (
    haystack.includes("reem") ||
    haystack.includes("marina square") ||
    haystack.includes("gate tower") ||
    haystack.includes("sun tower") ||
    haystack.includes("sky tower") ||
    haystack.includes("najmat") ||
    haystack.includes("maryah") ||
    haystack.includes("saadiyat") ||
    haystack.includes("yas") ||
    haystack.includes("raha")
  ) {
    return branchBySlug["al-reem"];
  }

  return branchBySlug.khalidiya;
};

export const branchAgeRange = (branch) =>
  branch.slug === "mirdif" ? "45 days to 5 years" : "45 days to 4 years";

const pick = (items, seed) => items[Math.abs(seed) % items.length];

const hashText = (value) =>
  [...value].reduce((total, character, index) => total + character.charCodeAt(0) * (index + 17), 0);

const cityAuthority = (city) =>
  city === "Dubai"
    ? "KHDA-approved Dubai branch"
    : "ADEK-approved Abu Dhabi branches";

const introOpeners = [
  "Choosing an early years setting is easier when the page speaks to your daily route, your child's age and the kind of care your family needs.",
  "Parents usually search locally because convenience, trust and child comfort all matter before they book a nursery visit.",
  "A good nursery page should answer practical parent questions, not only repeat a location name.",
  "Families comparing nurseries need clear details about curriculum, care, timings, age groups and the nearest branch."
];

const learningAngles = [
  "British EYFS learning, play-based discovery, communication development and confidence-building routines",
  "safe settling, social development, creative play, early literacy, numeracy and school-readiness experiences",
  "sensory exploration, outdoor play, role play, Arabic learning, storytelling and teacher-guided discovery",
  "warm care, structured routines, qualified educators and developmentally appropriate activities"
];

export const localPageModel = (areaPage) => {
  const branch = nearestBranchFor(areaPage);
  const seed = hashText(`${areaPage.area}-${areaPage.city}`);
  const keyword = `Nursery in ${areaPage.area} ${areaPage.city}`;
  const nearbyLabel = areaPage.city === "Dubai" ? "Dubai families" : "Abu Dhabi families";
  const title = `${keyword} | Playhouse Nursery`;
  const description = `${keyword} with British EYFS learning, caring teachers and WhatsApp booking at Playhouse ${branch.label.replace(" Branch", "")}.`;

  return {
    kind: "local",
    slug: areaPage.slug,
    keyword,
    title,
    description,
    h1: `${keyword}`,
    eyebrow: `${areaPage.city} local nursery guide`,
    branch,
    heroImage: branch.image,
    selectedBranch: branch.label,
    intro: `${pick(introOpeners, seed)} Playhouse Nursery supports ${nearbyLabel} through its ${cityAuthority(areaPage.city)}, welcoming children from ${branchAgeRange(branch)} with ${pick(learningAngles, seed + 1)}.`,
    sections: [
      {
        heading: `Why parents in ${areaPage.area} look for a nearby nursery`,
        body: `For families in ${areaPage.area}, the right nursery has to fit morning drop-off, work schedules and a child's emotional readiness. Playhouse Nursery keeps the search practical by connecting the local area with the nearest branch, clear WhatsApp booking and an early years programme built around confidence, communication and independence.`
      },
      {
        heading: `Nearest Playhouse branch for ${areaPage.area}`,
        body: `${branch.name} is the recommended branch for this page. The branch serves parents looking for ${keyword.toLowerCase()}, with caring staff, child-friendly spaces, secure routines and branch-specific guidance before admission. Families can book a visit, ask about availability and choose the best age group for their child.`
      },
      {
        heading: "Learning approach",
        body: `Children learn through purposeful play, teacher-led moments and daily routines that support the seven areas of early development. The page focus is local, but the promise stays consistent: safe care, British EYFS foundations, communication growth, social confidence and a gentle path toward school readiness.`
      }
    ],
    highlights: [
      `${cityAuthority(areaPage.city)} serving ${areaPage.area}`,
      `Care for children from ${branchAgeRange(branch)}`,
      "British EYFS and play-based early learning",
      "WhatsApp booking for quick parent enquiries",
      "Secure, caring and development-focused environment",
      ...facilities.slice(seed % 3, seed % 3 + 3)
    ],
    faqs: localFaqs(areaPage, branch, keyword)
  };
};

export const keywordPageModel = (page) => {
  const branch = nearestBranchFor({ keyword: page.keyword });
  const seed = hashText(page.keyword);
  const city = normalize(page.keyword).includes("dubai") ? "Dubai" : normalize(page.keyword).includes("abu dhabi") ? "Abu Dhabi" : "UAE";
  const title = `${page.keyword} | Playhouse Nursery`;
  const description = `Parent guide for ${page.keyword} with British EYFS, safe care, admissions support and WhatsApp booking at Playhouse Nursery.`;

  return {
    kind: "keyword",
    slug: page.slug,
    keyword: page.keyword,
    title,
    description,
    h1: `${page.keyword}`,
    eyebrow: "Parent SEO guide",
    branch,
    heroImage: branch.image,
    selectedBranch: branch.label,
    intro: `${pick(introOpeners, seed)} This guide explains ${page.keyword} from a parent-first point of view, including care quality, curriculum, branch choice and what to ask before admission.`,
    sections: [
      {
        heading: `What ${page.keyword} should mean for parents`,
        body: `The phrase "${page.keyword}" usually means a parent is close to making a decision. Playhouse Nursery answers that intent with practical information about early years care, British EYFS learning, age groups, staff support, safety routines and how to book a visit at the most relevant branch.`
      },
      {
        heading: "How Playhouse supports this need",
        body: `${branch.name} is highlighted for this topic because it best matches the location or intent behind the keyword. Families can ask about fees, admissions, available timings, settling support and the right class environment for babies, toddlers and preschool children.`
      },
      {
        heading: "What to check before choosing",
        body: `Parents should compare licensing, teacher warmth, hygiene, communication, child comfort and whether the curriculum prepares children socially and emotionally. A nursery should feel safe, responsive and transparent before a family commits.`
      }
    ],
    highlights: [
      `Focused guide for ${page.keyword}`,
      `Recommended branch: ${branch.label}`,
      `Age range: ${branchAgeRange(branch)}`,
      "British EYFS learning pathway",
      "Visit booking through WhatsApp",
      "Parent-friendly admissions conversation"
    ],
    faqs: keywordFaqs(page.keyword, branch, city)
  };
};

export const blogPageModel = (topic) => {
  const branch = nearestBranchFor({ keyword: topic.title });
  const seed = hashText(topic.title);
  const title = `${topic.title} | Playhouse Nursery Blog`;
  const description = `${topic.title} - practical early years guidance from Playhouse Nursery for UAE parents.`;

  return {
    kind: "blog",
    slug: topic.slug,
    keyword: topic.title,
    title,
    description,
    h1: topic.title,
    eyebrow: "Playhouse parent guide",
    branch,
    heroImage: pick([
      "/gallery/phn-classroom-wide.jpg",
      "/gallery/phn-craft-teacher.jpg",
      "/gallery/phn-reading-group.png",
      "/gallery/phn-teacher-play.jpg",
      "/gallery/phn-outdoor-play.png"
    ], seed),
    selectedBranch: branch.label,
    intro: `${pick(introOpeners, seed)} This article gives parents a useful, nursery-informed answer to "${topic.title}" while connecting the advice to everyday early years decisions in the UAE.`,
    sections: [
      {
        heading: "Parent takeaway",
        body: `The most useful answer is usually practical: understand your child's stage, visit the nursery, ask how teachers communicate with families and look for routines that help children feel safe. Playhouse Nursery uses warm care and play-based learning to make early education feel calm and purposeful.`
      },
      {
        heading: "How this connects to nursery life",
        body: `In a nursery setting, this topic connects to daily routines, teacher observation, language growth, social confidence and child independence. Parents can use it as a checklist before a tour or as a guide while supporting learning at home.`
      },
      {
        heading: "When to speak to the nursery team",
        body: `If a parent is comparing branches, worried about settling, checking fees or planning admission, it is better to ask directly. The Playhouse team can explain age groups, branch availability, documents, timings and the best next step for the child.`
      }
    ],
    highlights: [
      "Practical UAE parent guidance",
      "Connected to real nursery routines",
      "Supports babies, toddlers and preschoolers",
      `Relevant branch: ${branch.label}`,
      "WhatsApp booking included",
      pick(learningAngles, seed)
    ],
    faqs: blogFaqs(topic.title, branch)
  };
};

const localFaqs = (areaPage, branch, keyword) => [
  {
    question: `Is there a Playhouse nursery near ${areaPage.area} ${areaPage.city}?`,
    answer: `${branch.name} is the recommended Playhouse branch for families searching for ${keyword.toLowerCase()}. Parents can book a visit on WhatsApp and confirm the most convenient route.`
  },
  {
    question: `Which branch should ${areaPage.area} parents contact?`,
    answer: `${areaPage.area} families should contact ${branch.label}. The team can explain availability, age groups, timings and admission steps.`
  },
  {
    question: `What curriculum does Playhouse offer near ${areaPage.area}?`,
    answer: "Playhouse follows a British EYFS approach with play-based learning, communication development, social confidence, creative activities and school-readiness support."
  },
  {
    question: `What ages are accepted for families from ${areaPage.area}?`,
    answer: `${branch.name} welcomes children from ${branchAgeRange(branch)}, depending on the branch, availability and the child's developmental stage.`
  },
  {
    question: `Can I book a nursery visit from this ${areaPage.area} page?`,
    answer: "Yes. Use the WhatsApp booking form on this page to send your parent details, child age and nearest branch directly to the Playhouse team."
  },
  {
    question: `Is Playhouse suitable for working parents in ${areaPage.area}?`,
    answer: "Yes. Playhouse supports working families with clear communication, structured routines, caring staff and branch guidance for practical nursery planning."
  },
  {
    question: `How do I compare nurseries near ${areaPage.area}?`,
    answer: "Compare licensing, safety, teacher warmth, hygiene, parent updates, curriculum quality, branch distance and how comfortable your child feels during a visit."
  },
  {
    question: `What should I ask during a nursery tour near ${areaPage.area}?`,
    answer: "Ask about settling, staff training, daily routines, outdoor play, meals or snacks, parent updates, fees, admissions documents and school-readiness support."
  }
];

const keywordFaqs = (keyword, branch, city) => [
  {
    question: `What should parents know about ${keyword}?`,
    answer: `${keyword} should be evaluated through safety, curriculum, teacher care, licensing, child comfort and the practical fit of the nearest branch.`
  },
  {
    question: `Which Playhouse branch is most relevant for ${keyword}?`,
    answer: `${branch.name} is the recommended branch for this topic based on the keyword intent and location signals.`
  },
  {
    question: `Does Playhouse offer British EYFS learning?`,
    answer: "Yes. Playhouse Nursery uses British EYFS foundations with play-based learning, communication, confidence, creativity and school-readiness experiences."
  },
  {
    question: `Can parents ask about fees for ${keyword}?`,
    answer: "Yes. Parents can use the WhatsApp form to request current fees, admission availability and branch-specific guidance."
  },
  {
    question: `Is ${keyword} relevant for babies and toddlers?`,
    answer: `Playhouse supports babies, toddlers and preschool children, with age availability depending on the branch. ${branch.name} accepts children from ${branchAgeRange(branch)}.`
  },
  {
    question: `How does Playhouse help children settle?`,
    answer: "Teachers use warm routines, gentle communication, parent updates and age-appropriate play to help children feel secure."
  },
  {
    question: `What makes a nursery trustworthy in ${city}?`,
    answer: "Parents should look for licensing, safe spaces, trained staff, transparent communication, reviews, child-friendly routines and a clear curriculum."
  },
  {
    question: `How can I book a visit for ${keyword}?`,
    answer: "Complete the WhatsApp form on this page. It sends your details to the nearest Playhouse branch so the team can respond quickly."
  }
];

const blogFaqs = (topic, branch) => [
  {
    question: `Why is ${topic.toLowerCase()} important for parents?`,
    answer: "It helps parents make a clearer decision about nursery readiness, child development, branch fit and the kind of care their child needs."
  },
  {
    question: "How can Playhouse Nursery help with this topic?",
    answer: `${branch.name} can guide parents through age groups, settling, EYFS learning, admission steps and the daily routines that support children.`
  },
  {
    question: "Should parents book a tour before deciding?",
    answer: "Yes. A tour lets parents see classrooms, meet the team, ask practical questions and understand how their child may settle."
  },
  {
    question: "What age groups does Playhouse support?",
    answer: `${branch.name} supports children from ${branchAgeRange(branch)}, with branch-specific availability and age grouping.`
  },
  {
    question: "Does Playhouse support school readiness?",
    answer: "Yes. Children build independence, listening skills, confidence, language, early literacy, numeracy and social habits through everyday routines."
  },
  {
    question: "How do parents contact Playhouse quickly?",
    answer: "Use the WhatsApp booking form on this article to share parent details, child age and preferred branch."
  },
  {
    question: "What should parents ask after reading this guide?",
    answer: "Ask about availability, timings, fees, documents, settling support, teacher communication and the best branch for your family."
  },
  {
    question: "Is the advice relevant for UAE families?",
    answer: "Yes. The guidance is written for families comparing nursery, daycare and early years options in Dubai and Abu Dhabi."
  }
];

export const pageSchema = (model, url) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#playhouse-nursery`,
      name: "Playhouse Nursery",
      url: siteUrl,
      image: `${siteUrl}/logo.png`,
      telephone: model.branch.phone,
      address: model.branch.address,
      areaServed: model.keyword
    },
    {
      "@type": model.kind === "blog" ? "Article" : "WebPage",
      headline: model.h1,
      description: model.description,
      url
    },
    {
      "@type": "FAQPage",
      mainEntity: model.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    }
  ]
});
