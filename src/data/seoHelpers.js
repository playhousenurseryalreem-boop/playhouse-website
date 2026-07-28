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
  const localRouteSlugs = new Set(localAreas.map((area) => `nursery-in-${localRouteSlug(area)}`));
  const baseSlug = localRouteSlugs.has(page.slug) ? `${page.slug}-guide` : page.slug;
  const duplicateIndex = keywordPages.filter(
    (candidate) => candidate.slug === page.slug && Number(candidate.number) < Number(page.number)
  ).length;

  return duplicateIndex > 0 ? `${baseSlug}-${duplicateIndex + 1}` : baseSlug;
};

export const areaLabel = (areaPage) => {
  const area = areaPage.area.trim();
  const city = areaPage.city.trim();
  return normalize(area).includes(normalize(city)) ? area : `${area} ${city}`;
};

export const localRouteSlug = (areaPage) => slugify(areaLabel(areaPage));

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
    : "ADEK-approved Abu Dhabi branch";

const learningAngles = [
  "British EYFS learning, play-based discovery, communication development and confidence-building routines",
  "safe settling, social development, creative play, early literacy, numeracy and school-readiness experiences",
  "sensory exploration, outdoor play, role play, Arabic learning, storytelling and teacher-guided discovery",
  "warm care, structured routines, qualified educators and developmentally appropriate activities"
];

const sentenceCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const branchShortName = (branch) => branch.label.replace(" Branch", "");

const branchLocationLine = (branch) => {
  if (branch.slug === "mirdif") {
    return "The Mirdif branch is a practical choice for Dubai families who want a nursery close to residential communities, malls, schools and everyday commuting routes.";
  }

  if (branch.slug === "al-reem") {
    return "The Al Reem branch works well for families living around the island, nearby towers and Abu Dhabi city routes where a short, predictable nursery commute matters.";
  }

  return "The Khalidiya branch is suited to Abu Dhabi families who want a central nursery option near established residential areas, offices and daily school runs.";
};

const parentNeedFor = (keyword) => {
  const value = normalize(keyword);

  if (value.includes("fee") || value.includes("affordable")) {
    return {
      label: "fees and value",
      detail:
        "Parents comparing fees usually want clarity, not pressure. A useful nursery conversation should explain age groups, timings, registration steps, what is included, and how the programme supports the child's development each day."
    };
  }

  if (value.includes("admission") || value.includes("registration")) {
    return {
      label: "admissions and registration",
      detail:
        "For admission searches, families need a simple next step: check availability, understand documents, choose the right branch, and arrange a visit so the child can see the environment before starting."
    };
  }

  if (value.includes("baby") || value.includes("infant") || value.includes("45 days")) {
    return {
      label: "baby care",
      detail:
        "For babies and infants, parents should look closely at calm routines, hygiene, safe sleep practices, gentle handling, small-group attention and how teachers share updates through the day."
    };
  }

  if (value.includes("toddler") || value.includes("1 year") || value.includes("2 year")) {
    return {
      label: "toddler learning",
      detail:
        "Toddlers need patient educators, movement, language-rich play, sensory activities and predictable routines that help them become more independent without feeling rushed."
    };
  }

  if (value.includes("eyfs") || value.includes("british") || value.includes("curriculum")) {
    return {
      label: "British EYFS curriculum",
      detail:
        "Curriculum searches should lead parents to more than a label. British EYFS learning should be visible through play, observation, communication, personal development, early literacy, early maths and creative exploration."
    };
  }

  if (value.includes("safe") || value.includes("trusted") || value.includes("qualified") || value.includes("trained")) {
    return {
      label: "trust and safety",
      detail:
        "Trust comes from trained staff, clean spaces, secure routines, attentive supervision, transparent communication and a team that notices how each child settles, plays and grows."
    };
  }

  return {
    label: "nursery choice",
    detail:
      "Most nursery searches are really about fit: the right branch, warm teachers, a clear curriculum, safe routines and a place where the child can settle happily before parents commit."
  };
};

export const localPageModel = (areaPage) => {
  const branch = nearestBranchFor(areaPage);
  const seed = hashText(`${areaPage.area}-${areaPage.city}`);
  const keyword = `Nursery in ${areaLabel(areaPage)}`;
  const nearbyLabel = areaPage.city === "Dubai" ? "Dubai families" : "Abu Dhabi families";
  const title = `${keyword} | Playhouse Nursery`;
  const description = `${keyword} with British EYFS learning, caring teachers and WhatsApp booking at Playhouse ${branch.label.replace(" Branch", "")}.`;
  const branchName = branchShortName(branch);
  const branchAuthority = cityAuthority(areaPage.city);

  return {
    kind: "local",
    slug: areaPage.slug,
    areaPage,
    keyword,
    title,
    description,
    h1: `${keyword}`,
    eyebrow: `${areaPage.city} nursery near ${areaPage.area}`,
    branch,
    heroImage: branch.image,
    selectedBranch: branch.label,
    intro: `Looking for a caring ${keyword.toLowerCase()}? Playhouse ${branchName} gives families a warm early years setting with safe routines, friendly teachers and British EYFS-inspired learning for children from ${branchAgeRange(branch)}.`,
    lead: `A nursery decision is personal. Parents in ${areaPage.area} are usually balancing commute time, a child's confidence, daily communication and the feeling they get when they walk into a classroom. Playhouse ${branchName} is the closest Playhouse option for this search, offering a calm, welcoming place where children can settle, play, talk, explore and begin building the habits they need for school and life.`,
    sections: [
      {
        heading: `A nearby nursery choice for ${areaPage.area} families`,
        body: [
          `For families living or working around ${areaPage.area}, a nursery has to fit real life. Morning drop-off should feel manageable, the route should be predictable, and parents should know that their child is being cared for by adults who understand early childhood.`,
          `${branchLocationLine(branch)} The team can help parents compare age groups, available timings, tour slots and settling plans before making a decision.`
        ]
      },
      {
        heading: `What children experience at Playhouse ${branchName}`,
        body: [
          `Children at Playhouse learn through play, conversation, movement, stories, sensory discovery, creative work and teacher-guided activities. The approach is gentle and structured, so children feel secure while still having space to explore.`,
          `The ${branchAuthority} supports ${nearbyLabel} with ${pick(learningAngles, seed + 1)}. Parents can ask about baby care, toddler routines, preschool learning and school-readiness support during a branch visit.`
        ]
      },
      {
        heading: `Why ${areaPage.area} parents book a visit first`,
        body: [
          `A visit helps parents see the classroom mood, teacher interaction, hygiene standards and how children move through the day. It also gives the nursery team a chance to understand the child's age, routine, language, confidence and any settling worries.`,
          `If you are comparing ${keyword.toLowerCase()}, WhatsApp is the fastest way to ask about current availability, fees, documents and the best next step for your family.`
        ]
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
  const displayKeyword = sentenceCase(page.keyword);
  const searchNeed = parentNeedFor(page.keyword);
  const branchName = branchShortName(branch);
  const title = `${displayKeyword} | Playhouse Nursery`;
  const description = `${displayKeyword} with British EYFS learning, caring teachers, safe routines and WhatsApp booking at Playhouse Nursery.`;

  return {
    kind: "keyword",
    slug: page.slug,
    keyword: page.keyword,
    title,
    description,
    h1: displayKeyword,
    eyebrow: `${searchNeed.label} for parents`,
    branch,
    heroImage: branch.image,
    selectedBranch: branch.label,
    intro: `Searching for ${page.keyword} usually means you are ready to compare real nursery options, not just browse names. Playhouse ${branchName} helps parents understand care, curriculum, safety, admissions and the right branch for their child's age and routine.`,
    lead: `Parents searching for ${page.keyword} are often trying to answer one simple question: which nursery will feel right for my child and still work for our family schedule? Playhouse Nursery focuses on warm care, British EYFS-inspired learning and clear parent communication across its Khalidiya, Al Reem and Mirdif branches, so the decision can be made with confidence instead of guesswork.`,
    sections: [
      {
        heading: `What to look for when comparing ${page.keyword}`,
        body: [
          `${searchNeed.detail}`,
          `The strongest sign is usually how the nursery feels in person. Look for calm classrooms, responsive teachers, clean learning areas, safe entry routines and children who are busy, comfortable and engaged.`
        ]
      },
      {
        heading: `How Playhouse ${branchName} supports this search`,
        body: [
          `${branch.name} is the most relevant Playhouse branch for this search. Families can ask about available seats, age groups, fees, documents, settling support and the daily routine before arranging a tour.`,
          `${branchLocationLine(branch)} The branch welcomes children from ${branchAgeRange(branch)} and gives parents a direct WhatsApp route for quick questions.`
        ]
      },
      {
        heading: "The learning style parents can expect",
        body: [
          `Playhouse uses play-based early learning with British EYFS foundations. Children build language, independence, social confidence, early literacy, numeracy, creativity and movement through daily experiences that feel natural for their age.`,
          `The right nursery should never feel like a rushed decision. A branch visit helps parents see how teachers speak to children, how routines are managed and whether the environment matches the family's expectations.`
        ]
      }
    ],
    highlights: [
      `Practical information for ${page.keyword}`,
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
  const searchNeed = parentNeedFor(topic.title);
  const branchName = branchShortName(branch);
  const title = `${topic.title} | Playhouse Nursery Blog`;
  const description = `${topic.title} - practical early years guidance from Playhouse Nursery for UAE parents.`;

  return {
    kind: "blog",
    slug: topic.slug,
    keyword: topic.title,
    title,
    description,
    h1: topic.title,
    eyebrow: `${searchNeed.label} advice`,
    branch,
    heroImage: pick([
      "/gallery/phn-classroom-wide.jpg",
      "/gallery/phn-craft-teacher.jpg",
      "/gallery/phn-reading-group.png",
      "/gallery/phn-teacher-play.jpg",
      "/gallery/phn-outdoor-play.png"
    ], seed),
    selectedBranch: branch.label,
    intro: `${topic.title} is a real question for many UAE families. This article gives clear, practical guidance from an early years point of view, with simple steps parents can use before choosing a nursery or booking a visit.`,
    lead: `Every family reaches nursery decisions at a different pace. Some parents are ready to register, some are comparing branches, and others are still asking whether their child is ready. The best answer is usually found by looking at the child's routine, confidence, age, language, independence and the kind of support parents need during the week.`,
    sections: [
      {
        heading: "What parents should think about first",
        body: [
          `${searchNeed.detail}`,
          `A good nursery conversation should leave parents clearer than before. Ask what the day looks like, how settling is handled, how teachers update families and what support is available if the child needs time to adjust.`
        ]
      },
      {
        heading: "How this looks inside nursery life",
        body: [
          `At Playhouse, early learning happens through stories, songs, role play, movement, outdoor time, sensory activities, creative projects and guided small-group moments. Teachers observe how children communicate, share, solve problems and become more independent.`,
          `This matters because nursery is not only preparation for school. It is also where many children learn to separate gently, make friends, follow routines, express feelings and enjoy learning with trusted adults.`
        ]
      },
      {
        heading: `When to speak with Playhouse ${branchName}`,
        body: [
          `If this topic connects to your child's next step, speak with ${branch.name}. The team can explain age groups from ${branchAgeRange(branch)}, current availability, documents, tour timing and how the branch supports settling.`,
          `${branchLocationLine(branch)} WhatsApp is usually the quickest way to share your child's age and preferred branch, then arrange a visit that fits your schedule.`
        ]
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

const localFaqs = (areaPage, branch, keyword) => {
  const displayArea = areaLabel(areaPage);

  return [
    {
      question: `Is there a Playhouse nursery near ${displayArea}?`,
      answer: `${branch.name} is the recommended Playhouse branch for families searching for ${keyword.toLowerCase()}. Parents can book a visit on WhatsApp and confirm the most convenient route.`
    },
    {
      question: `Which branch should ${displayArea} parents contact?`,
      answer: `${displayArea} families should contact ${branch.label}. The team can explain availability, age groups, timings and admission steps.`
    },
    {
      question: `What curriculum does Playhouse offer near ${displayArea}?`,
      answer: "Playhouse follows a British EYFS approach with play-based learning, communication development, social confidence, creative activities and school-readiness support."
    },
    {
      question: `What ages are accepted for families from ${displayArea}?`,
      answer: `${branch.name} welcomes children from ${branchAgeRange(branch)}, depending on the branch, availability and the child's developmental stage.`
    },
    {
      question: `Can I book a nursery visit from this ${displayArea} page?`,
      answer: "Yes. Use the WhatsApp booking form on this page to send your parent details, child age and nearest branch directly to the Playhouse team."
    },
    {
      question: `Is Playhouse suitable for working parents in ${displayArea}?`,
      answer: "Yes. Playhouse supports working families with clear communication, structured routines, caring staff and branch guidance for practical nursery planning."
    },
    {
      question: `How do I compare nurseries near ${displayArea}?`,
      answer: "Compare licensing, safety, teacher warmth, hygiene, parent updates, curriculum quality, branch distance and how comfortable your child feels during a visit."
    },
    {
      question: `What should I ask during a nursery tour near ${displayArea}?`,
      answer: "Ask about settling, staff training, daily routines, outdoor play, meals or snacks, parent updates, fees, admissions documents and school-readiness support."
    }
  ];
};

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
