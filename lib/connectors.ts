export const CONNECTOR_GROUPS = [
  {
    title: "Openers",
    color: "blue",
    items: [
      "In my opinion,",
      "From my point of view,",
      "To begin with,",
      "First of all,",
      "As far as I am concerned,",
      "At the moment,",
      "In case of",
    ],
  },
  {
    title: "Idea 1",
    color: "orange",
    items: ["First of all,", "First,", "To get started,", "From the get-go,"],
  },
  {
    title: "Idea 2",
    color: "orange",
    items: ["Additionally,", "Moreover,", "Furthermore,", "On top of that,"],
  },
  {
    title: "Idea 3",
    color: "orange",
    items: ["Finally,", "Lastly,", "In the end,", "Ultimately,"],
  },
  {
    title: "Example",
    color: "purple",
    items: [
      "For example,",
      "For instance,",
      "To illustrate,",
      "A good example is when",
    ],
  },
  {
    title: "Conclusion",
    color: "green",
    items: [
      "Overall,",
      "In conclusion,",
      "To sum up,",
      "All in all,",
      "Therefore,",
    ],
  },
] as const;

export type ConnectorSetId = "classic" | "formal" | "dynamic" | "direct" | "random";

export type ConnectorSet = {
  id: Exclude<ConnectorSetId, "random">;
  label: string;
  opener: string;
  idea1: string;
  idea2: string;
  idea3: string;
  example: string;
  conclusion: string;
};

export const CONNECTOR_SETS: ConnectorSet[] = [
  {
    id: "classic",
    label: "Classic",
    opener: "In my opinion,",
    idea1: "First of all,",
    idea2: "Additionally,",
    idea3: "Finally,",
    example: "For example,",
    conclusion: "Overall,",
  },
  {
    id: "formal",
    label: "Formal",
    opener: "From my point of view,",
    idea1: "To begin with,",
    idea2: "Moreover,",
    idea3: "Lastly,",
    example: "For instance,",
    conclusion: "In conclusion,",
  },
  {
    id: "dynamic",
    label: "Dynamic",
    opener: "To begin with,",
    idea1: "From the get-go,",
    idea2: "Furthermore,",
    idea3: "Ultimately,",
    example: "To illustrate,",
    conclusion: "To sum up,",
  },
  {
    id: "direct",
    label: "Direct",
    opener: "As far as I am concerned,",
    idea1: "First,",
    idea2: "On top of that,",
    idea3: "In the end,",
    example: "A good example is when",
    conclusion: "All in all,",
  },
];

export const CONNECTOR_SET_KEY = "icao_connectors_v1";

const GROUP_PREFIXES = {
  opener: CONNECTOR_GROUPS[0].items,
  idea1: CONNECTOR_GROUPS[1].items,
  idea2: CONNECTOR_GROUPS[2].items,
  idea3: CONNECTOR_GROUPS[3].items,
  example: CONNECTOR_GROUPS[4].items,
  conclusion: CONNECTOR_GROUPS[5].items,
};

function stripLeadingConnector(text: string, prefixes: readonly string[]): string {
  const trimmed = text.trimStart();
  const sorted = [...prefixes].sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
      return trimmed.slice(prefix.length).trimStart();
    }
  }
  return trimmed;
}

function withConnector(prefix: string, rest: string): string {
  if (prefix.endsWith("when")) return `${prefix} ${rest}`;
  return `${prefix} ${rest}`;
}

function replaceConnector(text: string, group: readonly string[], next: string): string {
  return withConnector(next, stripLeadingConnector(text, group));
}

function transformIdea(idea: string, connector: string, group: readonly string[]): string {
  const match = idea.match(/^([0-9] - [^:]+: )(.*)$/);
  if (!match) return idea;
  return match[1] + replaceConnector(match[2], group, connector);
}

export function resolveConnectorSet(id: ConnectorSetId, seed = 0): ConnectorSet {
  if (id !== "random") {
    return CONNECTOR_SETS.find((set) => set.id === id) ?? CONNECTOR_SETS[0];
  }
  return CONNECTOR_SETS[seed % CONNECTOR_SETS.length];
}

export function applyConnectorSet<
  T extends {
    opener: string;
    ideas: string[];
    example: string;
    conclusion: string;
    answer: string;
  },
>(card: T, setId: ConnectorSetId, seed = 0): T {
  if (setId === "classic") return card;

  const set = resolveConnectorSet(setId, seed);
  const opener = replaceConnector(card.opener, GROUP_PREFIXES.opener, set.opener);
  const ideas = card.ideas.map((idea, index) => {
    if (index === 0) return transformIdea(idea, set.idea1, GROUP_PREFIXES.idea1);
    if (index === 1) return transformIdea(idea, set.idea2, GROUP_PREFIXES.idea2);
    return transformIdea(idea, set.idea3, GROUP_PREFIXES.idea3);
  });
  const example = replaceConnector(card.example, GROUP_PREFIXES.example, set.example);
  const conclusion = replaceConnector(card.conclusion, GROUP_PREFIXES.conclusion, set.conclusion);
  const answer = [opener, ...ideas, example, conclusion].join(" ");

  return {
    ...card,
    opener,
    ideas,
    example,
    conclusion,
    answer,
  };
}

export function loadConnectorSet(): ConnectorSetId {
  if (typeof window === "undefined") return "classic";
  const stored = localStorage.getItem(CONNECTOR_SET_KEY);
  if (
    stored === "classic" ||
    stored === "formal" ||
    stored === "dynamic" ||
    stored === "direct" ||
    stored === "random"
  ) {
    return stored;
  }
  return "classic";
}

export function saveConnectorSet(id: ConnectorSetId) {
  localStorage.setItem(CONNECTOR_SET_KEY, id);
}
