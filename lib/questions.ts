import { QuestionId, AnswerValue } from "@/types/quiz";

export interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface Question {
  id: QuestionId;
  title: string;
  subtitle?: string;
  type: "single" | "slider" | "currency";
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  /** Returns the next question ID given current answers */
  next: (answers: Partial<Record<QuestionId, AnswerValue>>) => QuestionId | null;
}

export const QUESTIONS: Record<QuestionId, Question> = {
  state: {
    id: "state",
    title: "Which state or territory are you in?",
    subtitle: "Your location determines the First Home Guarantee property price cap and stamp duty concessions.",
    type: "single",
    options: [
      { value: "NSW", label: "New South Wales", icon: "🏙️" },
      { value: "VIC", label: "Victoria", icon: "🏙️" },
      { value: "QLD", label: "Queensland", icon: "🌴" },
      { value: "SA", label: "South Australia", icon: "🍷" },
      { value: "WA", label: "Western Australia", icon: "🌅" },
      { value: "TAS", label: "Tasmania", icon: "🏔️" },
      { value: "ACT", label: "ACT", icon: "🏛️" },
      { value: "NT", label: "Northern Territory", icon: "🦘" },
    ],
    next: () => "firstHomeBuyer",
  },

  firstHomeBuyer: {
    id: "firstHomeBuyer",
    title: "Is this your first time buying a home?",
    subtitle: "You qualify as a first home buyer if neither you nor your co-buyer have ever owned a residential property in Australia.",
    type: "single",
    options: [
      { value: "yes", label: "Yes – I have never owned property in Australia", icon: "✅" },
      { value: "no_previously", label: "No – I have owned property before", icon: "🏠" },
    ],
    next: () => "citizenship",
  },

  citizenship: {
    id: "citizenship",
    title: "What is your residency status?",
    subtitle: "Government schemes are generally limited to Australian citizens and permanent residents.",
    type: "single",
    options: [
      { value: "citizen", label: "Australian Citizen", icon: "🇦🇺" },
      { value: "pr", label: "Permanent Resident", icon: "🪪" },
      { value: "other", label: "Visa / Temporary Resident", icon: "✈️" },
    ],
    next: () => "buyingWith",
  },

  buyingWith: {
    id: "buyingWith",
    title: "Are you buying alone or with someone?",
    subtitle: "Joint applications can significantly increase your borrowing power and combined deposit.",
    type: "single",
    options: [
      { value: "sole", label: "Buying on my own", icon: "🧍" },
      { value: "partner", label: "Buying with a partner / spouse", icon: "👫" },
      { value: "friend", label: "Buying with a friend or family member", icon: "👥" },
    ],
    next: () => "income",
  },

  income: {
    id: "income",
    title: "What is your gross annual income?",
    subtitle: "For joint applications, enter your combined household income before tax. This helps estimate your borrowing capacity.",
    type: "currency",
    min: 30000,
    max: 500000,
    step: 5000,
    prefix: "$",
    next: () => "employmentStatus",
  },

  employmentStatus: {
    id: "employmentStatus",
    title: "What is your employment situation?",
    subtitle: "Employment type affects lender policies and borrowing capacity.",
    type: "single",
    options: [
      { value: "fulltime", label: "Full-time / Permanent employee", icon: "💼" },
      { value: "parttime", label: "Part-time or Casual", icon: "📋" },
      { value: "selfemployed", label: "Self-employed or business owner", icon: "🏢" },
      { value: "contractor", label: "Contractor / Freelancer", icon: "📝" },
    ],
    next: () => "deposit",
  },

  deposit: {
    id: "deposit",
    title: "How much deposit do you have saved?",
    subtitle: "Include savings, term deposits, and any First Home Super Saver Scheme funds you plan to use.",
    type: "currency",
    min: 5000,
    max: 500000,
    step: 5000,
    prefix: "$",
    next: () => "hasGuarantor",
  },

  hasGuarantor: {
    id: "hasGuarantor",
    title: "Do you have a family member who could act as guarantor?",
    subtitle: "A guarantor uses equity in their own property to help you avoid LMI or borrow with a smaller deposit. Usually a parent or close family member.",
    type: "single",
    options: [
      { value: "yes", label: "Yes – a family member has offered to help", icon: "🤝" },
      { value: "maybe", label: "Possibly – I haven't asked yet", icon: "🤔" },
      { value: "no", label: "No guarantor available", icon: "❌" },
    ],
    next: () => "propertyBudget",
  },

  propertyBudget: {
    id: "propertyBudget",
    title: "What is your target purchase price?",
    subtitle: "This is the maximum you're hoping to spend. We'll check if it fits within scheme caps for your state.",
    type: "currency",
    min: 200000,
    max: 3000000,
    step: 25000,
    prefix: "$",
    next: () => "currentLiving",
  },

  currentLiving: {
    id: "currentLiving",
    title: "What is your current living situation?",
    subtitle: "This helps us understand how urgently you need your own place and how much flexibility you have.",
    type: "single",
    options: [
      { value: "living_home", label: "Living at home (family / parents)", icon: "👨‍👩‍👦", description: "Little to no rent — maximum savings potential" },
      { value: "cheap_rent", label: "Renting cheaply (well below market)", icon: "🏠", description: "Manageable rent — some flexibility on timing" },
      { value: "expensive_rent", label: "Paying market or expensive rent", icon: "💸", description: "High rent — owning sooner reduces ongoing costs" },
    ],
    next: (answers) => {
      // If paying expensive rent, skip the interstate rentvesting path — owning makes more sense
      if (answers.currentLiving === "expensive_rent") return null;
      return "locationFlexible";
    },
  },

  locationFlexible: {
    id: "locationFlexible",
    title: "Would you consider buying a property in a different location to where you live?",
    subtitle: "Some buyers purchase an investment property interstate where prices are lower (rentvesting), while continuing to rent in their preferred location.",
    type: "single",
    options: [
      { value: "yes", label: "Yes – I'm open to buying interstate or regionally", icon: "🗺️" },
      { value: "regional", label: "Maybe – open to regional areas in my state", icon: "🌾" },
      { value: "no", label: "No – I want to buy where I currently live", icon: "📍" },
    ],
    next: (answers) => {
      if (answers.locationFlexible === "yes") return "rentWhileBuying";
      return null;
    },
  },

  rentWhileBuying: {
    id: "rentWhileBuying",
    title: "Would you continue renting where you live while your investment property builds equity?",
    subtitle: "Rentvesting lets you buy in a growth market now and live where you want — often cheaper than paying rent AND a mortgage in an expensive area.",
    type: "single",
    options: [
      { value: "yes", label: "Yes – happy to keep renting while investing", icon: "📊" },
      { value: "maybe", label: "Maybe – I'd want to see the numbers first", icon: "🔢" },
      { value: "no", label: "No – I want to live in the property I buy", icon: "🏡" },
    ],
    next: () => null,
  },
};

export const FIRST_QUESTION: QuestionId = "state";

export function getNextQuestion(
  currentId: QuestionId,
  answers: Partial<Record<QuestionId, AnswerValue>>
): QuestionId | null {
  const question = QUESTIONS[currentId];
  return question.next(answers);
}
