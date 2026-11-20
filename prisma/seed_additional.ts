import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAdditionalModules() {
  console.log("Seeding Reminders, Tasks, Expenses, and Conflict Checks...");

  // Fetch some existing cases and clients to link
  const cases = await prisma.case.findMany({ take: 10 });
  const clients = await prisma.client.findMany({ take: 10, include: { user: true } });

  const c1 = cases[0]?.id;
  const c2 = cases[1]?.id;
  const c3 = cases[2]?.id;
  const c4 = cases[3]?.id;

  const cl1 = clients[0]?.id;
  const cl2 = clients[1]?.id;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // 1. Reminders
  await prisma.reminder.deleteMany();
  await prisma.reminder.createMany({
    data: [
      {
        title: "Final Arguments in Shivaji Nagar District Court",
        description: "Appear before 4th Addl. District Judge for final oral arguments in Special Civil Suit.",
        category: "HEARING",
        caseId: c1,
        clientId: cl1,
        assignedTo: "Adv. Amit S. Rathi",
        dueDate: today,
        dueTime: "11:00 AM",
        priority: "URGENT",
        status: "PENDING",
        isCompleted: false,
      },
      {
        title: "File Reply to Contempt Notice under Section 12",
        description: "Verify supporting affidavit and file reply in High Court bench chamber.",
        category: "FILING_DEADLINE",
        caseId: c2,
        assignedTo: "Adv. Sneha Kulkarni",
        dueDate: tomorrow,
        dueTime: "03:00 PM",
        priority: "HIGH",
        status: "PENDING",
        isCompleted: false,
      },
      {
        title: "Follow up with Collectorate Office on 7/12 Extract Correction",
        description: "Submit certified copy of RTS Appeal order to Haveli Taluka Revenue Inspector.",
        category: "CASE_FOLLOW_UP",
        caseId: c3,
        assignedTo: "Adv. Rahul Deshmukh",
        dueDate: nextWeek,
        dueTime: "02:30 PM",
        priority: "NORMAL",
        status: "PENDING",
        isCompleted: false,
      },
      {
        title: "Client Consultation with Kirloskar Pneumatic legal team",
        description: "Pre-hearing briefing on MACT settlement quantum calculations.",
        category: "CLIENT_FOLLOW_UP",
        clientId: cl2,
        assignedTo: "Adv. Amit S. Rathi",
        dueDate: today,
        dueTime: "04:30 PM",
        priority: "HIGH",
        status: "SNOOZED",
        isCompleted: false,
        snoozeUntil: new Date(now.getTime() + 60 * 60 * 1000),
      },
      {
        title: "Submit Certified Copy of Insurance Policy to MACT Tribunal",
        description: "Third-party motor liability claim submission deadline.",
        category: "DOCUMENT_SUBMISSION",
        caseId: c4,
        assignedTo: "Vikram Gaikwad",
        dueDate: yesterday,
        dueTime: "05:00 PM",
        priority: "URGENT",
        status: "OVERDUE",
        isCompleted: false,
      },
      {
        title: "Follow up on Pending Retainer Fee Invoice LX-INV-2024-001",
        description: "Contact finance controller regarding clearance of overdue legal retainer fees.",
        category: "PAYMENT",
        clientId: cl1,
        assignedTo: "Ananya Joshi",
        dueDate: twoDaysAgo,
        dueTime: "01:00 PM",
        priority: "NORMAL",
        status: "OVERDUE",
        isCompleted: false,
      },
      {
        title: "Bar Council Annual Sanad Renewal & Compliance Verification",
        description: "Submit triennial compliance declaration to Bar Council of Maharashtra & Goa.",
        category: "PERSONAL",
        assignedTo: "Adv. Amit S. Rathi",
        dueDate: yesterday,
        dueTime: "12:00 PM",
        priority: "HIGH",
        status: "COMPLETED",
        isCompleted: true,
        completedAt: yesterday,
      },
      {
        title: "Draft Writ Petition Synopsis under Article 226",
        description: "Challenging arbitral interim award before Bombay High Court.",
        category: "TASK",
        caseId: c1,
        assignedTo: "Adv. Priyanka Shinde",
        dueDate: tomorrow,
        dueTime: "06:00 PM",
        priority: "NORMAL",
        status: "PENDING",
        isCompleted: false,
      },
    ],
  });

  // 2. Tasks
  await prisma.task.deleteMany();
  await prisma.task.createMany({
    data: [
      {
        title: "Draft Written Statement under Order VIII Rule 1 CPC",
        description: "Draft comprehensive paragraph-wise denial and special pleadings for Civil Suit No. 129/2024.",
        caseId: c1,
        assignedTo: "Adv. Sneha Kulkarni",
        priority: "HIGH",
        status: "IN_PROGRESS",
        dueDate: tomorrow,
        isCompleted: false,
      },
      {
        title: "Inspect Original Revenue Mutation Register at Haveli Tahsil",
        description: "Verify entry no. 4821 regarding ancestral land partition in Somwar Peth.",
        caseId: c2,
        assignedTo: "Vikram Gaikwad",
        priority: "URGENT",
        status: "PENDING",
        dueDate: today,
        isCompleted: false,
      },
      {
        title: "Collate Medical Disability Certificates for MACT Claim",
        description: "Obtain certified disability percentage certificate from Sassoon General Hospital board.",
        caseId: c3,
        assignedTo: "Adv. Rahul Deshmukh",
        priority: "NORMAL",
        status: "IN_PROGRESS",
        dueDate: nextWeek,
        isCompleted: false,
      },
      {
        title: "Serve Legal Demand Notice u/s 138 NI Act by Registered AD",
        description: "Draft statutory 15-day notice and dispatch via India Post Speed Post with tracking.",
        caseId: c4,
        assignedTo: "Adv. Priyanka Shinde",
        priority: "URGENT",
        status: "COMPLETED",
        dueDate: yesterday,
        isCompleted: true,
      },
      {
        title: "Prepare Cross-Examination Questionnaire for Complainant",
        description: "Consumer dispute regarding structural defects in commercial real estate handover.",
        caseId: c1,
        assignedTo: "Adv. Amit S. Rathi",
        priority: "HIGH",
        status: "NOT_STARTED",
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        isCompleted: false,
      },
    ],
  });

  // 3. Expenses
  await prisma.expense.deleteMany();
  await prisma.expense.createMany({
    data: [
      {
        title: "Court Process Fees & Stamp Duty - Special Civil Suit",
        category: "COURT_FEES",
        amount: 14500,
        expenseDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        caseId: c1,
        paidTo: "District Court Pune Nazir Branch",
        paymentMethod: "BANK_TRANSFER",
        description: "Ad-valorem court fees stamped on plaints under Maharashtra Court Fees Act.",
        recordedBy: "Ananya Joshi (Accounts Desk)",
      },
      {
        title: "Certified Copy Charges - Revenue RTS Appeal",
        category: "FILING_FEES",
        amount: 2800,
        expenseDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        caseId: c2,
        paidTo: "Sub-Divisional Officer Pune Record Room",
        paymentMethod: "CASH",
        description: "Urgent certified copies of village form 6 and mutation entries.",
        recordedBy: "Sunil Shinde (Court Clerk)",
      },
      {
        title: "Travel & Advocate Conveyance - Bombay High Court Appearance",
        category: "TRAVEL",
        amount: 6200,
        expenseDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        caseId: c1,
        paidTo: "Pune-Mumbai Expressway Cab Service",
        paymentMethod: "UPI",
        description: "Senior counsel and associate transit for urgent listing mention in Courtroom 14.",
        recordedBy: "Adv. Amit S. Rathi",
      },
      {
        title: "High-Volume Brief Printing & Hard Bound Paperbooks (8 Sets)",
        category: "PRINTING",
        amount: 4350,
        expenseDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        caseId: c3,
        paidTo: "Shivaji Nagar Legal Xeroxing & Bookbinders",
        paymentMethod: "UPI",
        description: "Green ledger paper printing with index and pagination for Tribunal bench.",
        recordedBy: "Sunil Shinde (Court Clerk)",
      },
      {
        title: "Monthly Legal Software Subscription & Chambers High-Speed Fiber",
        category: "OFFICE_EXPENSES",
        amount: 8500,
        expenseDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        paidTo: "Airtel Business Enterprise & SCC Online",
        paymentMethod: "BANK_TRANSFER",
        description: "Monthly chambers infrastructure and legal research database access.",
        recordedBy: "Ananya Joshi (Accounts Desk)",
      },
      {
        title: "Advocates Welfare Fund Stamps & Vakalatnama Court Stamps",
        category: "MISCELLANEOUS",
        amount: 1950,
        expenseDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        paidTo: "Pune Bar Association Stamp Counter",
        paymentMethod: "CASH",
        description: "Welfare stamps and court fee labels for 15 new filings.",
        recordedBy: "Sunil Shinde (Court Clerk)",
      },
    ],
  });

  // 4. Conflict of Interest Checks
  await prisma.conflictCheck.deleteMany();
  await prisma.conflictCheck.createMany({
    data: [
      {
        searchQuery: "Poonawalla Real Estate Developers LLP",
        category: "OPPOSITE_PARTY",
        potentialMatches: 0,
        matchSummary: "Zero active briefs or past representation found across 1,771 firm records.",
        status: "CLEARED",
        reviewedBy: "Adv. Amit S. Rathi",
        notes: "No conflict of interest exists. Cleared for accepting fresh brief on land acquisition.",
      },
      {
        searchQuery: "Deshmukh Agro Industries Pvt Ltd",
        category: "RELATED_ENTITY",
        potentialMatches: 2,
        matchSummary: "Matching active RCS No. 441/2023 where associate company was opposite party.",
        status: "POTENTIAL_CONFLICT",
        reviewedBy: "Adv. Amit S. Rathi",
        notes: "Potential adversary conflict identified under Bar Council of India Rule 6. Brief declined.",
      },
      {
        searchQuery: "Rajeshwar Balwant Kulkarni",
        category: "CLIENT_NAME",
        potentialMatches: 0,
        matchSummary: "Individual party search cleared across all 5 practice area registries.",
        status: "CLEARED",
        reviewedBy: "Adv. Amit S. Rathi",
        notes: "Verified clean standing. Retainer agreement authorized for family partition suit.",
      },
      {
        searchQuery: "Maharashtra State Road Transport Corporation",
        category: "OPPOSITE_PARTY",
        potentialMatches: 3,
        matchSummary: "Existing MACT claim pending in Tribunal Court 3 representing accident victims.",
        status: "UNDER_REVIEW",
        reviewedBy: "Adv. Sneha Kulkarni",
        notes: "Reviewing whether new commercial tender advisory breaches victim claimant representation.",
      },
    ],
  });

  console.log("Successfully seeded Reminders, Tasks, Expenses, and Conflict Checks!");
}

seedAdditionalModules()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
