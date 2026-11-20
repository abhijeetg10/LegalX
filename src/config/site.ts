export interface TeamMemberConfig {
  id: string;
  name: string;
  role: string;
  designation: string;
  sanadNumber?: string;
  specialization: string;
  experienceYears: number;
  email: string;
  phone: string;
  bio: string;
  image: string;
}

export interface PracticeAreaConfig {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  courtForums: string[];
  keyMatters: string[];
  icon: string;
  statHighlight: string;
}

export const siteConfig = {
  name: "LEGALEX Law Solutions",
  establishedYear: 2009,
  trademarkRegisteredYear: 2009,
  tagline: "Trusted Legal Counsel Since 2009.",
  motto: "Precision in Advocacy. Integrity in Counsel. Relentless Commitment to Justice.",
  
  founder: {
    name: "Advocate Amit Sharad Rathi",
    title: "Founder & CEO, Lead Counsel",
    sanadNumber: "5803-2008",
    barCouncil: "Bar Council of Maharashtra & Goa",
    experienceYears: 16,
    education: "B.S.L., LL.B., LL.M. (Corporate & Criminal Jurisprudence)",
    email: "amitrathi143@gmail.com",
    phone: "+91 9922079879",
    bio: "Advocate Amit Sharad Rathi is a veteran litigator with over a decade and a half of high-stakes courtroom experience across Maharashtra. Recognized for strategic mastery in Land Revenue, Complex Civil Title Litigation, High-Value Consumer Claims, and White-Collar Criminal Defence, he established Legalex in 2009 with a vision to combine unyielding ethical advocacy with modern institutional precision.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800",
  },

  contact: {
    phone: "+91 9922079879",
    phoneDisplay: "+91 99220 79879",
    whatsapp: "+919922079879",
    email: "amitrathi143@gmail.com",
    officeEmail: "contact@legalex.in",
    office1: {
      name: "Court Office",
      building: "C Building, New Lawyers Chambers",
      complex: "District Court Compound, Near Gate No. 1",
      area: "Shivaji Nagar",
      city: "Pune",
      pinCode: "411005",
      state: "Maharashtra, India",
    },
    office2: {
      name: "City Chambers",
      building: "Old Kumar Sadan Building, Block No. 10, First Floor",
      street: "CTS 444, Somwar Peth, Opposite Bank of Maharashtra, Near Apollo Talkies",
      city: "Pune",
      pinCode: "411011",
      state: "Maharashtra, India",
    },
    address: {
      chambers: "LEGALEX Law Solutions (Court Office)",
      building: "C Building, New Lawyers Chambers, District Court Compound",
      street: "Near Gate No. 1, Shivaji Nagar",
      city: "Pune",
      district: "Pune",
      state: "Maharashtra",
      pinCode: "411005",
      country: "India",
      googleMapsUrl: "https://maps.google.com/?q=Shivaji+Nagar+Pune+District+Court",
    },
    hours: "Monday – Saturday: 9:30 AM – 7:30 PM (Sunday by Prior Appointment for Urgent Relief)",
    emergencyPhone: "+91 98230 45678",
  },

  jurisdiction: "State of Maharashtra",
  courtsOfPractice: [
    "Bombay High Court (Principal Bench & Benches)",
    "District & Sessions Courts, Maharashtra",
    "Maharashtra Revenue Tribunal (MRT)",
    "Divisional Commissioner & Collector Revenue Courts",
    "State & District Consumer Disputes Redressal Commissions",
    "Motor Accident Claims Tribunal (MACT)",
    "National Company Law Tribunal (NCLT Mumbai Bench)",
  ],

  stats: {
    activeCases: 1291,
    completedCases: 480,
    yearsOfExperience: 16, // Since 2009
    teamSize: 8, // Founder + 7 assistants
    totalCasesRepresented: 1771,
    clientSatisfactionRate: "98.4%",
    recoveredOrProtectedAssets: "₹450+ Cr",
  },

  teamMembers: [
    {
      id: "team-1",
      name: "Adv. Amit S. Rathi",
      role: "FOUNDER",
      designation: "Founder & Lead Counsel",
      sanadNumber: "5803-2008",
      specialization: "Revenue, Civil Litigation & Constitutional Writs",
      experienceYears: 16,
      email: "amit.rathi@legalex.in",
      phone: "+91 99220 79879",
      bio: "Head of Chambers with 16+ years of trial and appellate practice across Maharashtra courts.",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "team-2",
      name: "Adv. Sneha K. Deshmukh",
      role: "ASSOCIATE_ADVOCATE",
      designation: "Senior Associate Advocate",
      sanadNumber: "MAH/4120/2014",
      specialization: "Civil & Family Law, Matrimonial Mediation",
      experienceYears: 10,
      email: "sneha.deshmukh@legalex.in",
      phone: "+91 98221 44321",
      bio: "Leads civil suits, partition deeds, injunctions, and contested family court disputes with meticulous brief formulation.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "team-3",
      name: "Adv. Vikramjit R. Shinde",
      role: "ASSOCIATE_ADVOCATE",
      designation: "Associate Advocate (Criminal Practice)",
      sanadNumber: "MAH/6789/2016",
      specialization: "Criminal Defence, Anticipatory Bail & MACT",
      experienceYears: 8,
      email: "vikram.shinde@legalex.in",
      phone: "+91 97654 32109",
      bio: "Handles session trials, bail applications, quashing petitions, and complex accident claim negotiations.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "team-4",
      name: "Adv. Rajeshree N. Patil",
      role: "ASSOCIATE_ADVOCATE",
      designation: "Associate Advocate (Revenue & Consumer)",
      sanadNumber: "MAH/9012/2018",
      specialization: "Land Revenue Code, 7/12 Mutation Disputes, Consumer Forums",
      experienceYears: 6,
      email: "rajeshree.patil@legalex.in",
      phone: "+91 94220 88765",
      bio: "Expertise before SDO, Collector, MRT, and State Consumer Commission in property and unfair trade disputes.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "team-5",
      name: "Adv. Omkar V. Kulkarni",
      role: "JUNIOR_ADVOCATE",
      designation: "Junior Advocate & Legal Researcher",
      sanadNumber: "MAH/11452/2021",
      specialization: "Legal Research, Drafting Petitions & High Court Briefs",
      experienceYears: 4,
      email: "omkar.kulkarni@legalex.in",
      phone: "+91 98810 55432",
      bio: "Assists in case jurisprudence research, drafting writ petitions, and compiling precedent authorities.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "team-6",
      name: "Adv. Tanvi M. Joshi",
      role: "JUNIOR_ADVOCATE",
      designation: "Junior Advocate",
      sanadNumber: "MAH/13890/2022",
      specialization: "Consumer Protection & MACT Document Substantiation",
      experienceYears: 3,
      email: "tanvi.joshi@legalex.in",
      phone: "+91 96570 99812",
      bio: "Specializes in client affidavits, claim calculations, and court registry procedural filings.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "team-7",
      name: "Mahesh B. Gaikwad",
      role: "COURT_CLERK",
      designation: "Senior Court Clerk & Registry Liaison",
      specialization: "Court Registry, Cause Lists, Summons & Certified Copies",
      experienceYears: 14,
      email: "mahesh.clerk@legalex.in",
      phone: "+91 93710 22345",
      bio: "Liaises with Pune & Mumbai court registries, managing daily cause list monitoring, vakalatnama verification, and certified orders.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "team-8",
      name: "Pooja S. Kadam",
      role: "ACCOUNTS_OFFICER",
      designation: "Accounts Officer & Client Billing Manager",
      specialization: "Legal Billing, Court Fees, GST Compliance & Trust Accounts",
      experienceYears: 7,
      email: "accounts@legalex.in",
      phone: "+91 91580 33456",
      bio: "Oversees invoice issuance, retainer billing, court stamp fee reconciliation, and trust accounting with transparency.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    },
  ],

  practiceAreas: [
    {
      id: "civil-and-family",
      slug: "civil-and-family",
      title: "Civil & Family Law",
      shortDescription: "Comprehensive representation in ancestral property partitions, title disputes, contract enforcement, and sensitive family matrimonial litigation.",
      fullDescription: "Civil and family disputes demand a delicate balance between fierce advocacy and strategic preservation of rights. Our chambers provide authoritative representation in Regular Civil Suits, specific performance of contracts, partition of ancestral properties, declaratory suits, injunctions, and matrimonial disputes (divorce, child custody, alimony, and mutual settlements) across Maharashtra trial and family courts.",
      courtForums: ["District & Sessions Court", "Family Courts, Maharashtra", "Bombay High Court"],
      keyMatters: [
        "Ancestral & Joint Family Property Partition Suits",
        "Declaratory Suits, Title Rectification & Permanent Injunctions",
        "Specific Performance of Sale Agreements & Commercial Contracts",
        "Matrimonial Petitions, Child Custody & Maintenance Appeals",
        "Succession Certificates, Probate of Wills & Letters of Administration"
      ],
      icon: "Scale",
      statHighlight: "420+ Civil & Matrimonial Matters Concluded",
    },
    {
      id: "revenue",
      slug: "revenue",
      title: "Revenue & Land Litigation",
      shortDescription: "Premier authority on Maharashtra Land Revenue Code (MLRC), 7/12 extract rectifications, tenancy disputes, and appeals before Revenue Authorities.",
      fullDescription: "With agriculture, urbanization, and rapid infrastructure expansion across Maharashtra, revenue disputes require deep procedural familiarity with the Maharashtra Land Revenue Code, 1966. Legalex has earned a benchmark reputation representing landowners, developers, and agriculturalists before Tahsildar, Sub-Divisional Officers (SDO), District Collectors, and the Maharashtra Revenue Tribunal (MRT).",
      courtForums: ["Tahsildar & SDO Courts", "Collector Revenue Courts", "Divisional Commissioner", "Maharashtra Revenue Tribunal (MRT)"],
      keyMatters: [
        "7/12 Extract Mutation Entry (Ferfar) Disputes & Appeals",
        "Agricultural Land Title Due Diligence & Section 84-C Inquiries",
        "Boundary Disputes, Demarcation & Right of Way (Vahiwat Rasta)",
        "Land Acquisition Compensation Enhancement Claims",
        "Tenancy & Agricultural Land Ceiling Act Matters"
      ],
      icon: "Landmark",
      statHighlight: "₹300+ Cr Land Value Safeguarded",
    },
    {
      id: "consumer",
      slug: "consumer",
      title: "Consumer Protection",
      shortDescription: "Aggressive defense and prosecution before District Commissions and the State Consumer Disputes Redressal Commission.",
      fullDescription: "Under the Consumer Protection Act, 2019, buyers and commercial entities have potent rights against deficiency of service, unfair trade practices, and builder-buyer delays. Legalex champions high-stake consumer complaints against real estate developers, insurance corporations, banking entities, and healthcare institutions.",
      courtForums: ["District Consumer Disputes Redressal Commission (DCDRC)", "State Consumer Commission (SCDRC Mumbai Bench)", "National Commission (NCDRC)"],
      keyMatters: [
        "Builder Delays, Possession Default & RERA-linked Consumer Redressal",
        "Repudiation of Medical, Life & Marine Insurance Claims",
        "Banking, Financial Fraud & Deficient Investment Services",
        "Defective Goods & Product Liability Enforcement",
        "Execution Petitions under Section 71 & 72 for Non-Compliance"
      ],
      icon: "ShieldCheck",
      statHighlight: "₹45+ Cr Compensation Recovered",
    },
    {
      id: "criminal",
      slug: "criminal",
      title: "Criminal Law & Trial Advocacy",
      shortDescription: "Strategic courtroom trial defense, anticipatory bail, white-collar defence, and FIR quashing petitions before the High Court.",
      fullDescription: "Liberty is sacred. Legalex provides rigorous, fearless criminal litigation defense. From the pre-arrest anticipatory bail stage to Sessions trials and appellate reviews before the High Court, our defense strategies are anchored in thorough forensic analysis, stringent cross-examination of prosecution witnesses, and constitutional safeguards.",
      courtForums: ["Judicial Magistrate First Class (JMFC)", "Sessions & Special Courts (CBI / ACB / PMLA)", "Bombay High Court"],
      keyMatters: [
        "Anticipatory Bail (Sec 438 CrPC / Sec 482 BNSS) & Regular Bail",
        "Negotiable Instruments Act (Section 138 Cheque Bounce Prosecutions)",
        "White Collar Crimes, Economic Offences Wing (EOW) & Cyber Fraud",
        "IPC / BNS Sessions Trials & Cross-Examination",
        "FIR Quashing & Criminal Revision Petitions in High Court"
      ],
      icon: "Gavel",
      statHighlight: "250+ Successful Bail & Acquittal Outcomes",
    },
    {
      id: "mact",
      slug: "mact",
      title: "Motor Accident Claims Tribunal (MACT)",
      shortDescription: "Expeditious claim filing and maximal compensation recovery for accident victims and families before Motor Accident Claims Tribunals.",
      fullDescription: "Accidents shatter families physically and financially. Legalex stands as a pillar of support for victims and legal heirs under the Motor Vehicles Act. We leave no stone unturned in establishing third-party insurer liability, calculating future prospects, loss of dependency, and medical damages to secure the highest legitimate compensation.",
      courtForums: ["Motor Accident Claims Tribunal (MACT), Pune & Satara", "High Court Appellate Jurisdiction"],
      keyMatters: [
        "Fatal Accident Dependency & Compensation Claims",
        "Permanent & Partial Disability Structured Settlements",
        "Contesting Insurance Company Repudiation on Driver Fitness",
        "Compromise Lok Adalat Expedited Settlements",
        "High Court Appeals for Compensation Enhancement"
      ],
      icon: "CarFront",
      statHighlight: "₹28+ Cr Claims Disbursed to Families",
    },
  ],

  bciDisclaimer: {
    rule: "Bar Council of India Rule 36, Section IV",
    text: "As per the rules of the Bar Council of India, law firms and advocates are not permitted to solicit work or advertise. By accessing this website (legalex.in), the user acknowledges that the information provided herein is solely for informational and educational purposes, made available at their own request, and does not create an advocate-client relationship. The firm disclaims liability for actions taken relying on this website.",
  },
};
