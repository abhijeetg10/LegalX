import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import crypto from "crypto";

const prisma = new PrismaClient();

// Minimal valid PDF binary generator
function createSamplePdfBuffer(title: string, caseNo: string): Buffer {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 18 Tf
50 720 Td
(LEGALEX CHAMBERS & ADVOCATES - PUNE) Tj
0 -30 Td
/F1 12 Tf
(OFFICIAL COURT DOCUMENT - CASE: ${caseNo}) Tj
0 -25 Td
(Document: ${title}) Tj
0 -20 Td
(Jurisdiction: State of Maharashtra | Est. 2009) Tj
0 -20 Td
(Sanad No. 5803-2008 | Lead Counsel: Adv. Amit S. Rathi) Tj
0 -30 Td
(This certified copy is electronically generated and digitally sealed.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000224 00000 n 
0000000475 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
548
%%EOF`;
  return Buffer.from(content, "utf-8");
}

async function main() {
  console.log("🌱 Starting LEGALEX comprehensive database seeding...");

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Cleanup existing data in reverse order of foreign keys
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.document.deleteMany();
  await prisma.hearing.deleteMany();
  await prisma.caseTimeline.deleteMany();
  await prisma.caseAssignee.deleteMany();
  await prisma.case.deleteMany();
  await prisma.client.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.appointmentSlot.deleteMany();
  await prisma.contactInquiry.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.caseResult.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash("Admin@1234", salt);
  const teamPasswordHash = await bcrypt.hash("Team@1234", salt);
  const clientPasswordHash = await bcrypt.hash("Client@1234", salt);

  // 1. Create Core Role Users
  console.log("Creating System Users & Roles...");

  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@legalex.in",
      name: "Adv. Amit S. Rathi (Super Admin)",
      phone: "+91 99220 79879",
      passwordHash: commonPasswordHash,
      role: "SUPER_ADMIN",
      avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400",
    },
  });

  // Client Admin (Firm Administrator / Managing Partner)
  const clientAdmin = await prisma.user.create({
    data: {
      email: "admin@legalex.in",
      name: "Adv. Amit S. Rathi (Managing Partner)",
      phone: "+91 99220 79879",
      passwordHash: commonPasswordHash,
      role: "CLIENT_ADMIN",
      avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400",
      teamProfile: {
        create: {
          designation: "Founder, Director & CGO",
          sanadNumber: "5803-2008",
          specialization: "Revenue & Land Litigation, Civil Title, Writ Petitions",
          experienceYears: 16,
          bio: "Founder of Legalex. 16+ years practicing in High Court & District Courts across Maharashtra.",
          isPublic: true,
          order: 1,
        },
      },
    },
  });

  // 7 Team Legalex Members (Associates, Juniors, Clerk, Accounts)
  const teamSpecs = [
    {
      name: "Adv. Sneha K. Deshmukh",
      email: "team@legalex.in", // Default demo team login
      phone: "+91 98221 44321",
      role: "TEAM_MEMBER",
      designation: "Senior Associate Advocate",
      sanadNumber: "MAH/4120/2014",
      specialization: "Civil & Family Law, Matrimonial Mediation",
      experienceYears: 10,
      bio: "Leads civil suits, partition deeds, injunctions, and contested family court disputes with meticulous brief formulation.",
      order: 2,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Adv. Vikramjit R. Shinde",
      email: "vikram.shinde@legalex.in",
      phone: "+91 97654 32109",
      role: "TEAM_MEMBER",
      designation: "Associate Advocate (Criminal Practice)",
      sanadNumber: "MAH/6789/2016",
      specialization: "Criminal Defence, Anticipatory Bail & MACT",
      experienceYears: 8,
      bio: "Handles session trials, bail applications, quashing petitions, and complex accident claim negotiations.",
      order: 3,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Adv. Rajeshree N. Patil",
      email: "rajeshree.patil@legalex.in",
      phone: "+91 94220 88765",
      role: "TEAM_MEMBER",
      designation: "Associate Advocate (Revenue & Consumer)",
      sanadNumber: "MAH/9012/2018",
      specialization: "Land Revenue Code, 7/12 Mutation Disputes, Consumer Forums",
      experienceYears: 6,
      bio: "Expertise before SDO, Collector, MRT, and State Consumer Commission in property and unfair trade disputes.",
      order: 4,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Adv. Omkar V. Kulkarni",
      email: "omkar.kulkarni@legalex.in",
      phone: "+91 98810 55432",
      role: "TEAM_MEMBER",
      designation: "Junior Advocate & Legal Researcher",
      sanadNumber: "MAH/11452/2021",
      specialization: "Legal Research, Drafting Petitions & High Court Briefs",
      experienceYears: 4,
      bio: "Assists in case jurisprudence research, drafting writ petitions, and compiling precedent authorities.",
      order: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Adv. Tanvi M. Joshi",
      email: "tanvi.joshi@legalex.in",
      phone: "+91 96570 99812",
      role: "TEAM_MEMBER",
      designation: "Junior Advocate",
      sanadNumber: "MAH/13890/2022",
      specialization: "Consumer Protection & MACT Document Substantiation",
      experienceYears: 3,
      bio: "Specializes in client affidavits, claim calculations, and court registry procedural filings.",
      order: 6,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Mahesh B. Gaikwad",
      email: "mahesh.clerk@legalex.in",
      phone: "+91 93710 22345",
      role: "TEAM_MEMBER",
      designation: "Senior Court Clerk & Registry Liaison",
      specialization: "Court Registry, Cause Lists, Summons & Certified Copies",
      experienceYears: 14,
      bio: "Liaises with Pune & Mumbai court registries, managing daily cause list monitoring and certified orders.",
      order: 7,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Pooja S. Kadam",
      email: "accounts@legalex.in",
      phone: "+91 91580 33456",
      role: "TEAM_MEMBER",
      designation: "Accounts Officer & Client Billing Manager",
      specialization: "Legal Billing, Court Fees, GST Compliance & Trust Accounts",
      experienceYears: 7,
      bio: "Oversees invoice issuance, retainer billing, court stamp fee reconciliation, and trust accounting.",
      order: 8,
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    },
  ];

  const createdTeamUsers: any[] = [];
  for (const t of teamSpecs) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        name: t.name,
        phone: t.phone,
        passwordHash: teamPasswordHash,
        role: "TEAM_MEMBER",
        avatar: t.avatar,
        teamProfile: {
          create: {
            designation: t.designation,
            sanadNumber: t.sanadNumber,
            specialization: t.specialization,
            experienceYears: t.experienceYears,
            bio: t.bio,
            isPublic: true,
            order: t.order,
          },
        },
      },
    });
    createdTeamUsers.push(user);
  }

  // 2. Create 42 Realistic Clients across Maharashtra
  console.log("Creating 42 Realistic Clients...");
  const clientDataSeeds = [
    { name: "Rajesh S. Sharma", email: "client@legalex.in", company: "Rameshwar Industries Ltd.", city: "Pune", address: "Plot 42, Bhosari Industrial Area, MIDC, Pune" },
    { name: "Sunil V. Kadam", email: "sunil.kadam@sahyadriinfra.com", company: "Sahyadri Agro Infrastructure", city: "Satara", address: "14B Kisan Bhavan, Radhika Road, Satara" },
    { name: "Meenakshi R. Iyer", email: "meenakshi.iyer@gmail.com", company: "Iyer Biotech Pvt Ltd", city: "Mumbai", address: "802 Sea View Tower, Worli Sea Face, Mumbai" },
    { name: "Dnyaneshwar M. Patil", email: "dnyaneshwar.patil@outlook.com", company: "Patil Sugars & Farms", city: "Kolhapur", address: "Rajarampuri 5th Lane, Kolhapur" },
    { name: "Dr. Arvind G. Joshi", email: "arvind.joshi@careortho.in", company: "Sanjeevani Orthopedic Hospital", city: "Pune", address: "F.C. Road, Shivajinagar, Pune" },
    { name: "Ananya S. Deshpande", email: "ananya.deshpande@deshpandegroup.org", company: "Deshpande Hospitality", city: "Nashik", address: "Trimbak Road, Mahamin, Nashik" },
    { name: "Kishor H. Oswal", email: "kishor.oswal@oswaljewellers.com", company: "Oswal Gems & Gold LLP", city: "Pune", address: "Laxmi Road, Narayan Peth, Pune" },
    { name: "Pravin K. Shirole", email: "pravin.shirole@mahalaxmitec.com", company: "Mahalaxmi Engineering Works", city: "Chakan", address: "Chakan Phase-II, Tal. Khed, Dist. Pune" },
    { name: "Smita D. Bapat", email: "smita.bapat@gmail.com", company: "Bapat Consulting Services", city: "Pune", address: "Mayur Colony, Kothrud, Pune" },
    { name: "Gajanan R. More", email: "gajanan.more@morecoldstorage.com", company: "More Agro Cold Storage", city: "Baramati", address: "MIDC Baramati, Dist. Pune" },
    { name: "Vijaykumar T. Rathi", email: "vijay.rathi@rathitextiles.com", company: "Rathi Yarns & Fabrics", city: "Solapur", address: "Industrial Estate, Hotgi Road, Solapur" },
    { name: "Madhuri N. Jagtap", email: "madhuri.jagtap@yahoo.com", company: "Shree Ganesh Developers", city: "Pune", address: "Baner Road, Near Balewadi High Street, Pune" },
    { name: "Sachin P. Bhosale", email: "sachin.bhosale@bhosaleconstructions.com", company: "Bhosale Earthmovers & Infra", city: "Sangli", address: "Miraj Road, Vishrambag, Sangli" },
    { name: "Kavita S. Gaikwad", email: "kavita.gaikwad@rediffmail.com", company: "Gaikwad Dairy Consortium", city: "Ahmednagar", address: "Station Road, Ahmednagar" },
    { name: "Nitin A. Chordia", email: "nitin.chordia@chordiapolymers.in", company: "Chordia Polymer Solutions", city: "Pimpri-Chinchwad", address: "Nehrunagar, Pimpri, Pune" },
  ];

  // Add 27 more clients programmatically to reach 42+ clients
  const maharashtraTowns = ["Pune", "Mumbai", "Nashik", "Aurangabad", "Solapur", "Nagpur", "Thane", "Amravati", "Nanded"];
  for (let i = 16; i <= 42; i++) {
    const town = maharashtraTowns[i % maharashtraTowns.length];
    clientDataSeeds.push({
      name: `Client Contact #${i} (${town})`,
      email: `client${i}@legalex-demo.in`,
      company: `${town} Enterprise & Assets Group #${i}`,
      city: town,
      address: `Chambers Suite ${100 + i}, Commercial Zone, ${town}, Maharashtra`,
    });
  }

  const createdClients: any[] = [];
  let clientIdx = 1;
  for (const c of clientDataSeeds) {
    const code = `CL-2024-${String(clientIdx).padStart(3, "0")}`;
    const user = await prisma.user.create({
      data: {
        email: c.email,
        name: c.name,
        phone: `+91 ${9800000000 + clientIdx}`,
        passwordHash: clientPasswordHash,
        role: "CLIENT",
        clientProfile: {
          create: {
            clientCode: code,
            companyName: c.company,
            address: c.address,
            city: c.city,
            state: "Maharashtra",
            pinCode: "411005",
            panNumber: `AAACR${1000 + clientIdx}F`,
            aadhaarMasked: `XXXX-XXXX-${3000 + clientIdx}`,
            emergencyPhone: `+91 ${9700000000 + clientIdx}`,
            notes: "Verified client under Legalex retainer agreement.",
          },
        },
      },
      include: {
        clientProfile: true,
      },
    });
    createdClients.push(user.clientProfile);
    clientIdx++;
  }

  // 3. Create 65 Realistic Cases across 5 Practice Areas
  console.log("Creating 65 Comprehensive Cases...");
  const practiceAreas = ["CIVIL_AND_FAMILY", "REVENUE", "CONSUMER", "CRIMINAL", "MACT"];
  const courtNames = [
    "District & Sessions Court, Shivaji Nagar, Pune",
    "Court of Sub-Divisional Officer (SDO), Haveli, Pune",
    "Court of District Collector, Pune Revenue Division",
    "Maharashtra Revenue Tribunal (MRT), Pune Bench",
    "District Consumer Disputes Redressal Commission, Pune",
    "State Consumer Disputes Redressal Commission, Mumbai Bench",
    "Motor Accident Claims Tribunal (MACT), Pune",
    "Court of Judicial Magistrate First Class (JMFC), Pune",
    "High Court of Judicature at Bombay (Appellate Side)",
  ];

  const caseTemplates = [
    { title: "Rameshwar Industries vs. Maharashtra State Electricity Distribution Co. (MSEDCL)", area: "CIVIL_AND_FAMILY", prefix: "RCS", stage: "Evidence Stage", summary: "Civil suit for permanent injunction and declaration regarding industrial tariff dispute." },
    { title: "Sunil Kadam & Ors. vs. State of Maharashtra & Tahsildar Haveli", area: "REVENUE", prefix: "REV/APP", stage: "Final Arguments", summary: "Appeal under Section 247 of MLRC challenging illegal mutation entry on Gat No. 412/1." },
    { title: "Meenakshi Iyer vs. Sky Heights Luxury Developers Pvt. Ltd.", area: "CONSUMER", prefix: "CC", stage: "Order Reserved", summary: "Consumer complaint under Section 35 CPA for refund of ₹1.45 Cr with 12% interest for 4-year possession delay." },
    { title: "State of Maharashtra vs. Arvind Joshi (In Re: Medical Board Opinion)", area: "CRIMINAL", prefix: "CRI/BAIL", stage: "Notice Issued", summary: "Anticipatory bail application under Sec 438 CrPC concerning alleged medical negligence FIR." },
    { title: "Smt. Shanta Bhosale & Anr. vs. National Insurance Company Ltd.", area: "MACT", prefix: "MACP", stage: "Cross-Examination of PW-2", summary: "Motor accident claim seeking compensation of ₹75 Lakhs for fatal highway collision on Pune-Solapur Highway." },
    { title: "Oswal Gems LLP vs. Union Bank of India & Anr.", area: "CONSUMER", prefix: "CC", stage: "Pleadings Complete", summary: "Deficiency of service complaint for wrongful dishonor of LC causing substantial commercial injury." },
    { title: "Patil Sugar Mills vs. Divisional Commissioner (Sugar Directorate)", area: "REVENUE", prefix: "MRT/REV", stage: "Hearing on Stay Application", summary: "Revision application challenging sugarcane zone demarcation order under Maharashtra Sugar Cane Control Order." },
    { title: "Ananya Deshpande vs. Vikramaditya Deshpande", area: "CIVIL_AND_FAMILY", prefix: "HMA/PET", stage: "Mediation Report Awaited", summary: "Matrimonial petition under Section 13(1)(ia) of HMA with interlocutory maintenance petition." },
    { title: "State of Maharashtra (EOW) vs. Shirole Infra Partners", area: "CRIMINAL", prefix: "EOW/SPEC", stage: "Framing of Charges", summary: "Defence in alleged Section 420, 406 IPC commercial dispute escalated by complainant." },
    { title: "Kavita Gaikwad vs. Reliance General Insurance Co. Ltd.", area: "MACT", prefix: "MACP", stage: "Judgment Awaited", summary: "Permanent disability claim of 45% evaluated by Sassoon General Hospital medical board." },
  ];

  const createdCases: any[] = [];
  for (let i = 1; i <= 65; i++) {
    const tpl = caseTemplates[(i - 1) % caseTemplates.length];
    const client = createdClients[(i - 1) % createdClients.length];
    const area = practiceAreas[(i - 1) % practiceAreas.length];
    const year = 2021 + ((i - 1) % 4);
    const caseNumber = `${tpl.prefix}/${100 + i}/${year}`;
    const court = courtNames[(i - 1) % courtNames.length];
    const filingDate = new Date(year, (i * 2) % 12, (i * 3) % 28 + 1);

    // Realistic mix of statuses
    let status = "ACTIVE";
    if (i % 6 === 0) status = "COMPLETED";
    else if (i % 5 === 0) status = "HEARING_SCHEDULED";
    else if (i % 7 === 0) status = "JUDGMENT_RESERVED";
    else if (i % 11 === 0) status = "ON_HOLD";

    const nextHearingDate = status === "COMPLETED" 
      ? null 
      : new Date(Date.now() + (i % 18 + 1) * 24 * 60 * 60 * 1000);

    const c = await prisma.case.create({
      data: {
        caseNumber,
        casingTitle: `${tpl.title} [Ref #${i}]`,
        practiceArea: area,
        courtName: court,
        judgeName: `Hon'ble Presiding Judge Court #${(i % 8) + 1}`,
        jurisdiction: "State of Maharashtra",
        filingDate,
        status,
        stage: tpl.stage,
        summary: tpl.summary,
        internalNotes: "Pre-trial briefs scrutinized by Adv. Amit S. Rathi. Next steps discussed with client.",
        clientId: client.id,
        nextHearingDate,
      },
    });
    createdCases.push(c);

    // Assign team members (Adv. Amit S. Rathi / Client Admin + 1 or 2 Associates)
    await prisma.caseAssignee.create({
      data: {
        caseId: c.id,
        userId: clientAdmin.id,
        roleInCase: "Lead Counsel",
      },
    });

    const assignedAssociate = createdTeamUsers[(i - 1) % createdTeamUsers.length];
    await prisma.caseAssignee.create({
      data: {
        caseId: c.id,
        userId: assignedAssociate.id,
        roleInCase: "Assisting Advocate",
      },
    });

    // Create 2-4 Case Timeline Events
    await prisma.caseTimeline.create({
      data: {
        caseId: c.id,
        title: "Petition / Suit Instituted",
        description: `Vakalatnama and substantive petition lodged with Court Registry under ${caseNumber}.`,
        eventDate: filingDate,
        eventType: "FILING",
      },
    });

    await prisma.caseTimeline.create({
      data: {
        caseId: c.id,
        title: "Notice Issued to Respondents",
        description: "Court issued formal notices returnable within 30 days.",
        eventDate: new Date(filingDate.getTime() + 25 * 24 * 60 * 60 * 1000),
        eventType: "HEARING",
      },
    });

    if (status !== "ACTIVE" || i % 2 === 0) {
      await prisma.caseTimeline.create({
        data: {
          caseId: c.id,
          title: "Interim Relief / Evidence Argument",
          description: "Submissions advanced on interim stay application. Ad-interim protection granted.",
          eventDate: new Date(filingDate.getTime() + 75 * 24 * 60 * 60 * 1000),
          eventType: "ORDER",
        },
      });
    }

    // Create Past & Upcoming Hearings
    await prisma.hearing.create({
      data: {
        caseId: c.id,
        hearingDate: new Date(Date.now() - (i % 20 + 5) * 24 * 60 * 60 * 1000),
        courtRoom: `Court Hall #${(i % 5) + 1}`,
        purpose: "Verification of documents and examination-in-chief",
        summaryOutcome: "Plaintiff documents admitted. Matter posted for cross-examination.",
        nextSteps: "Prepare cross-examination questionnaire based on certified records.",
        isCompleted: true,
      },
    });

    if (nextHearingDate) {
      await prisma.hearing.create({
        data: {
          caseId: c.id,
          hearingDate: nextHearingDate,
          courtRoom: `Court Hall #${(i % 5) + 1}`,
          purpose: "Arguments on Interim Injunction & Cross Examination",
          nextSteps: "Adv. Amit S. Rathi to lead arguments.",
          isCompleted: false,
        },
      });
    }
  }

  // 4. Create Invoices, Line Items, and Payments
  console.log("Generating Case Invoices & Financial Records...");
  const invoiceStatuses = ["PAID", "PAID", "ISSUED", "PARTIALLY_PAID", "OVERDUE"];
  for (let i = 1; i <= 45; i++) {
    const caseRecord = createdCases[i - 1];
    const client = createdClients[(i - 1) % createdClients.length];
    const subtotal = 25000 + (i * 3500);
    const taxPercent = 18.0;
    const taxAmount = (subtotal * taxPercent) / 100;
    const totalAmount = subtotal + taxAmount;
    const status = invoiceStatuses[(i - 1) % invoiceStatuses.length];
    let paidAmount = 0;
    if (status === "PAID") paidAmount = totalAmount;
    else if (status === "PARTIALLY_PAID") paidAmount = Math.round(totalAmount / 2);

    const invoiceNumber = `INV-LX-2024-${String(i).padStart(3, "0")}`;
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        caseId: caseRecord.id,
        clientId: client.id,
        issueDate: new Date(Date.now() - (i * 3) * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + (15 - (i % 20)) * 24 * 60 * 60 * 1000),
        subtotal,
        taxPercent,
        taxAmount,
        totalAmount,
        paidAmount,
        status,
        notes: "Fee schedule as agreed under Legalex Engagement Letter. Payment subject to GST TDS where applicable.",
        items: {
          create: [
            {
              description: `Professional Court Appearance & Advocacy in ${caseRecord.caseNumber}`,
              quantity: 1,
              unitPrice: Math.round(subtotal * 0.65),
              amount: Math.round(subtotal * 0.65),
            },
            {
              description: "Pleadings Drafting, Affidavits & Legal Jurisprudence Compilation",
              quantity: 1,
              unitPrice: Math.round(subtotal * 0.35),
              amount: Math.round(subtotal * 0.35),
            },
          ],
        },
      },
    });

    if (paidAmount > 0) {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: paidAmount,
          paymentDate: new Date(),
          paymentMethod: i % 2 === 0 ? "NEFT/RTGS" : "UPI",
          transactionRef: `UTR-HDFC${908000 + i}`,
          notes: "Received and credited to Legalex Chambers Bank Account.",
        },
      });
    }
  }

  // 5. Create Documents with Sample PDFs & QR Verification
  console.log("Generating Official Case Documents & QR Authentications...");
  const docCategories = [
    { cat: "PETITION", name: "Special Civil Application & Plaint.pdf" },
    { cat: "INTERIM_ORDER", name: "Certified Copy of Ad-Interim Injunction Order.pdf" },
    { cat: "WRITTEN_STATEMENT", name: "Written Statement on behalf of Opponents.pdf" },
    { cat: "EVIDENCE", name: "List of Documents with 7-12 Extracts & Map.pdf" },
    { cat: "VAKALATNAMA", name: "Bar Council Verified Vakalatnama Form.pdf" },
    { cat: "FINAL_JUDGMENT", name: "Operative Decree & Final Certified Order.pdf" },
  ];

  for (let i = 1; i <= 50; i++) {
    const caseRecord = createdCases[i - 1];
    const docTpl = docCategories[(i - 1) % docCategories.length];
    const verificationId = `LX-2024-${String(1000 + i)}`;

    // Create actual PDF file on disk
    const fileName = `${verificationId}-${docTpl.name}`;
    const filePath = path.join(uploadDir, fileName);
    const pdfBuffer = createSamplePdfBuffer(docTpl.name, caseRecord.caseNumber);
    fs.writeFileSync(filePath, pdfBuffer);

    // Generate real QR code data URL pointing to the public verification page
    const verifyUrl = `http://localhost:3000/verify-document/${verificationId}`;
    const qrCodeUrl = await QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 2,
      color: { dark: "#0B1F3A", light: "#FFFFFF" },
    });

    const sealPayload = `${verificationId}|${caseRecord.caseNumber}|${docTpl.name}|LEGALEX_PUNE`;
    const digitalSealHash = crypto.createHash("sha256").update(sealPayload).digest("hex");

    await prisma.document.create({
      data: {
        caseId: caseRecord.id,
        title: `${docTpl.name.replace(".pdf", "")} (${caseRecord.caseNumber})`,
        category: docTpl.cat,
        fileName: docTpl.name,
        fileSize: pdfBuffer.length,
        mimeType: "application/pdf",
        filePath: `/uploads/documents/${fileName}`,
        version: 1,
        uploadedBy: "Adv. Amit S. Rathi",
        verificationId,
        qrCodeUrl,
        isVerified: true,
        verifiedAt: new Date(),
        digitalSealHash,
      },
    });
  }

  // 6. Create 14 Days of Appointment Slots for Booking Flow
  console.log("Generating 2 Weeks of Live Appointment Time Slots...");
  const slotHours = ["10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM", "05:30 PM"];
  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const slotDate = new Date();
    slotDate.setDate(slotDate.getDate() + dayOffset);
    if (slotDate.getDay() === 0) continue; // Skip Sundays

    for (let h = 0; h < slotHours.length; h++) {
      const isBooked = (dayOffset === 1 && h === 0) || (dayOffset === 2 && h === 2);
      await prisma.appointmentSlot.create({
        data: {
          date: slotDate,
          startTime: slotHours[h],
          endTime: slotHours[(h + 1) % slotHours.length],
          isBooked,
          clientName: isBooked ? "Pramod Deshmukh" : null,
          clientEmail: isBooked ? "pramod.d@gmail.com" : null,
          clientPhone: isBooked ? "+91 98220 12345" : null,
          practiceArea: isBooked ? "Revenue & Land Litigation" : null,
          mode: isBooked ? "In-Person Office (Pune)" : "Video Conference",
          notes: isBooked ? "Initial consultation on 7/12 Gat separation dispute." : null,
        },
      });
    }
  }

  // 7. Create 6 Comprehensive Blog Posts / Legal Insights
  console.log("Creating 6 In-Depth Legal Insights & Blog Articles...");
  const blogPosts = [
    {
      slug: "maharashtra-land-revenue-code-7-12-mutation-disputes",
      title: "Resolving 7/12 Extract Mutation Disputes under Maharashtra Land Revenue Code, 1966",
      category: "Revenue & Land Laws",
      excerpt: "A tactical analysis of Section 149 and 150 of the MLRC, handling disputed entries, and appellate procedures before the Sub-Divisional Officer (SDO) and Maharashtra Revenue Tribunal.",
      content: `The 7/12 extract (Satbara Utara) is arguably the most vital land record in Maharashtra. However, an entry in the 7/12 extract is a record of rights for fiscal purposes and does not inherently confer conclusive civil title.

Under Section 149 of the Maharashtra Land Revenue Code (MLRC), 1966, any person acquiring an interest in agricultural land by succession, partition, purchase, or decree must report such acquisition within three months to the Talathi. When objections arise under Section 150(2), the matter enters the register of disputed cases.

Appellate Strategy:
1. Challenge before the Sub-Divisional Officer (SDO) under Section 247 of MLRC within 60 days.
2. Second appeal or revision before the Additional Collector and Divisional Commissioner.
3. Revision before the Maharashtra Revenue Tribunal (MRT) under Section 315.
4. Concurrently, if title itself is in question, a Regular Civil Suit for declaration and permanent injunction must be instituted in the Civil Court, as revenue authorities cannot decide substantive questions of title.`,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      readTime: "7 min read",
    },
    {
      slug: "anticipatory-bail-guidelines-maharashtra-courts",
      title: "Navigating Anticipatory Bail Jurisprudence in Maharashtra Sessions & High Courts",
      category: "Criminal Law",
      excerpt: "Essential parameters considered by courts when granting pre-arrest protection under Section 438 CrPC / Bharatiya Nagarik Suraksha Sanhita (BNSS).",
      content: `The right to personal liberty under Article 21 of the Constitution forms the bedrock of anticipatory bail jurisprudence. In criminal practice across Maharashtra, pre-arrest bail applications require decisive legal framing.

Key Parameters Evaluated:
- Nature and gravity of the accusations.
- Role ascribed to the applicant in the FIR.
- Absence of criminal antecedents.
- Possibility of the applicant fleeing from justice or tampering with prosecution witnesses.
- Willingness to cooperate with the investigating officer.

In white-collar and commercial disputes often disguised as criminal cheating under Section 420 IPC / Section 318 BNS, our chambers consistently establish that civil commercial breaches cannot be converted into criminal proceedings to exert coercive pressure.`,
      imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
      readTime: "6 min read",
    },
    {
      slug: "builder-delay-compensation-consumer-protection-act-2019",
      title: "Real Estate Default: Seeking Refund and Compensation under CPA 2019 vs MahaRERA",
      category: "Consumer Law",
      excerpt: "How homebuyers can utilize the Supreme Court's Imperia Structures doctrine to seek compensation across Consumer Commissions and MahaRERA concurrently.",
      content: `Homebuyers in Pune, Mumbai, and Thane confronting prolonged possession delays have dual remedies under the Real Estate (Regulation and Development) Act, 2016 (MahaRERA) and the Consumer Protection Act, 2019.

The Supreme Court of India in Imperia Structures Ltd. v. Anil Patni authoritatively ruled that remedies under the Consumer Protection Act and RERA are concurrent and not mutually exclusive.

District and State Consumer Commissions have demonstrated decisive efficiency in ordering:
1. Full refund of deposited consideration with 9% to 12% annual interest.
2. Compensation for mental agony and escalating rental expenses.
3. Litigation costs.
4. Coercive attachment of builder bank accounts under Section 71/72 for disobedience.`,
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      readTime: "5 min read",
    },
    {
      slug: "ancestral-property-partition-hindu-succession-act",
      title: "Coparcenary Rights and Ancestral Property Partition in Maharashtra",
      category: "Civil & Family Law",
      excerpt: "The retrospective impact of Vineeta Sharma v. Rakesh Sharma on daughters' coparcenary rights and preliminary decree execution.",
      content: `Partition of ancestral coparcenary property requires a precise understanding of the Hindu Succession (Amendment) Act, 2005. Following the landmark Three-Judge Bench ruling of the Supreme Court in Vineeta Sharma v. Rakesh Sharma (2020), daughters possess identical coparcenary rights by birth as sons, irrespective of whether the father was alive on September 9, 2005.

Procedural Milestones:
- Filing a Regular Civil Suit (RCS) before the Civil Judge Senior Division.
- Adjudication of genealogy, nature of property (ancestral vs. self-acquired), and legal necessities.
- Passing of Preliminary Decree determining share fractions.
- Appointment of Court Commissioner (usually Tahsildar or Cadastral Surveyor) for actual physical division by metes and bounds.`,
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
      readTime: "8 min read",
    },
    {
      slug: "motor-accident-claims-tribunal-mact-compensation-formula",
      title: "Formulation of Maximal Compensation before Motor Accident Claims Tribunals (MACT)",
      category: "MACT",
      excerpt: "Application of Pranay Sethi and Sarla Verma multipliers in determining fair compensation for road traffic accident victims.",
      content: `Accident compensation before MACT is designed to place the claimant in the same financial position as if the tragedy had not occurred.

Core heads of computation:
1. Income Assessment: Tax returns, payslips, or minimum wage indices.
2. Future Prospects: Adding 40% to 50% for victims under 40 years of age with permanent employment.
3. Deduction for Personal Living Expenses: 1/2 for bachelors, 1/3 for 2-3 dependents.
4. Multiplier: Determined strictly according to the victim's age bracket under Sarla Verma.
5. Conventional Heads: Loss of consortium (₹44,000 per dependent), loss of estate, and funeral expenses.`,
      imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
      readTime: "6 min read",
    },
    {
      slug: "disclaimer-compliance-and-legal-ethics-bar-council-of-india",
      title: "Legal Ethics and Digital Verification: Transparency in 21st Century Law Practice",
      category: "Legal Ethics",
      excerpt: "How modern law chambers maintain strict compliance with Bar Council of India Rule 36 while delivering seamless digital transparency to clients.",
      content: `Rule 36 of the Bar Council of India Rules mandates that an advocate shall not solicit work or advertise, either directly or indirectly.

At Legalex, established in 2009 by Adv. Amit S. Rathi, every digital platform we build honors both the spirit and letter of Bar Council ethics. Our client management portal, verifiable digital seals, and encrypted case repositories ensure that clients receive transparent courtroom intelligence without compromising legal propriety.`,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      readTime: "4 min read",
    },
  ];

  for (const p of blogPosts) {
    await prisma.blogPost.create({ data: p });
  }

  // 8. Create 8 Authentic Testimonials
  console.log("Creating 8 Authentic Client Testimonials...");
  const testimonials = [
    {
      clientName: "Rajesh S. Sharma",
      clientRole: "Managing Director, Rameshwar Industries Ltd.",
      practiceArea: "Civil & Commercial Litigation",
      feedback: "Adv. Amit S. Rathi and the Legalex team represented our manufacturing group in an intricate land injunction dispute. Their command over statutory nuances and strategic cross-examination secured an interim injunction that saved our operational plant.",
      rating: 5,
      caseYear: "2023",
    },
    {
      clientName: "Sunil V. Kadam",
      clientRole: "Founder, Sahyadri Agro Infrastructure",
      practiceArea: "Revenue & Land Litigation",
      feedback: "When our 12-acre agricultural consolidation was unlawfully contested in the revenue records, Legalex pursued the matter up to the Maharashtra Revenue Tribunal. Their depth in the Maharashtra Land Revenue Code is peerless.",
      rating: 5,
      caseYear: "2022",
    },
    {
      clientName: "Meenakshi R. Iyer",
      clientRole: "Executive Director, Iyer Biotech",
      practiceArea: "Consumer Protection Forum",
      feedback: "After waiting five agonizing years for our luxury residential apartment, Legalex represented us before the State Consumer Commission. They recovered our entire investment with 11% interest and substantial damages.",
      rating: 5,
      caseYear: "2024",
    },
    {
      clientName: "Kishor H. Oswal",
      clientRole: "Partner, Oswal Gems LLP",
      practiceArea: "Commercial & Banking Disputes",
      feedback: "What sets Legalex apart is institutional reliability. The portal allows our board to monitor cause lists, download digitally signed orders, and track invoice transparency without friction.",
      rating: 5,
      caseYear: "2023",
    },
    {
      clientName: "Dnyaneshwar M. Patil",
      clientRole: "Agriculturalist & Landowner, Kolhapur",
      practiceArea: "Revenue & Right of Way (Vahiwat)",
      feedback: "The road access to our farmland was blocked by neighboring holders. Adv. Amit Rathi personally argued the matter before the SDO and obtained an immediate order for removal of obstruction under Mamlatdar's Courts Act.",
      rating: 5,
      caseYear: "2024",
    },
    {
      clientName: "Dr. Arvind G. Joshi",
      clientRole: "Chief Orthopedic Surgeon, Pune",
      practiceArea: "Criminal Defence & Bail Advocacy",
      feedback: "When a malicious and unfounded criminal complaint was registered against our medical staff, Legalex stepped in within hours, securing anticipatory bail and subsequently having the FIR stayed at the Bombay High Court.",
      rating: 5,
      caseYear: "2023",
    },
    {
      clientName: "Smt. Shanta Bhosale",
      clientRole: "Claimant & Legal Heir",
      practiceArea: "Motor Accident Claims Tribunal",
      feedback: "Following the tragic loss of my husband in a highway collision, Adv. Vikramjit Shinde and Adv. Amit Rathi fought for our family against a recalcitrant insurance company and secured a landmark compensation of ₹68 Lakhs.",
      rating: 5,
      caseYear: "2022",
    },
    {
      clientName: "Ananya S. Deshpande",
      clientRole: "Entrepreneur, Pune",
      practiceArea: "Family & Matrimonial Settlement",
      feedback: "The family litigation team handled our complex property division and settlement with supreme dignity and tact. Their compassionate yet firm approach saved years of painful courtroom attrition.",
      rating: 5,
      caseYear: "2023",
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // 9. Create 6 Landmark Case Results
  console.log("Creating 6 Landmark Case Results...");
  const caseResults = [
    {
      title: "Commercial Land Title & Revenue Mutation Affirmation",
      forum: "Maharashtra Revenue Tribunal (MRT)",
      practiceArea: "REVENUE",
      summary: "Successfully overturned adverse mutation entries affecting 22 acres of prime industrial land in Chakan MIDC corridor, securing clear title for our corporate client.",
      outcome: "Favorable Order - Mutation Restored & Revision Dismissed",
      year: "2023",
    },
    {
      title: "Pre-Arrest Protection in High-Profile Corporate Investigation",
      forum: "Bombay High Court (Appellate Side)",
      practiceArea: "CRIMINAL",
      summary: "Secured urgent interim protection and subsequent anticipatory bail in an alleged ₹14 Cr corporate banking dispute wrongfully criminalized as breach of trust.",
      outcome: "Anticipatory Bail Absolute with Full Liberty Safeguards",
      year: "2024",
    },
    {
      title: "Full Refund with 12% Interest for Commercial Mall Default",
      forum: "State Consumer Disputes Redressal Commission, Mumbai",
      practiceArea: "CONSUMER",
      summary: "Prosecuted consumer complaint against leading national developer for 6-year handover delay, securing ₹2.8 Cr refund plus damages.",
      outcome: "Decreed in Favor of Complainant with Execution Attachment",
      year: "2023",
    },
    {
      title: "Landmark Compensation for Fatal Highway Accident",
      forum: "Motor Accident Claims Tribunal (MACT), Pune",
      practiceArea: "MACT",
      summary: "Established third-party liability against heavy commercial transport insurer, proving substantial future dependency prospects for surviving family.",
      outcome: "₹72.5 Lakhs Awarded with 8% Interest from Filing Date",
      year: "2022",
    },
    {
      title: "Ancestral Hindu Coparcenary Partition Decree",
      forum: "Court of Civil Judge Senior Division, Pune",
      practiceArea: "CIVIL_AND_FAMILY",
      summary: "Secured preliminary partition decree granting 1/4th undivided share to married daughters applying the Supreme Court's Vineeta Sharma doctrine.",
      outcome: "Preliminary Partition Decree Passed with Injunction",
      year: "2023",
    },
    {
      title: "Stay against Illegal Encroachment on Industrial Right-of-Way",
      forum: "District Court, Shivaji Nagar, Pune",
      practiceArea: "CIVIL_AND_FAMILY",
      summary: "Obtained ad-interim mandatory injunction restraining interference with 40-foot transit approach road for manufacturing logistics.",
      outcome: "Mandatory Injunction Granted; Police Protection Ordered",
      year: "2024",
    },
  ];

  for (const cr of caseResults) {
    await prisma.caseResult.create({ data: cr });
  }

  // 10. Create Initial System Audit Logs and Notifications
  console.log("Generating Audit Trail & System Alerts...");
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "SYSTEM_INITIALIZATION",
      details: "LEGALEX production platform initialized with encrypted credentials and RBAC security policies.",
      ipAddress: "127.0.0.1",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: clientAdmin.id,
      action: "CASE_REGISTRATION",
      details: "Seeded 65 active and completed litigation matters under Adv. Amit S. Rathi supervision.",
      ipAddress: "127.0.0.1",
    },
  });

  await prisma.notification.create({
    data: {
      userId: clientAdmin.id,
      title: "Upcoming Hearing Alert",
      message: "Matter RCS/101/2021 is listed for Final Arguments tomorrow at Court Hall #2.",
      link: "/portal/cases",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: createdTeamUsers[0].id,
      title: "New Case Assigned",
      message: "You have been assigned as Assisting Advocate on Revenue Appeal REV/APP/102/2022.",
      link: "/portal/cases",
      isRead: false,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("-----------------------------------------------------------------");
  console.log("DEMO LOGIN CREDENTIALS:");
  console.log("1. Super Admin:  email: superadmin@legalex.in | pass: Admin@1234");
  console.log("2. Client Admin: email: admin@legalex.in      | pass: Admin@1234");
  console.log("3. Team Legalex: email: team@legalex.in       | pass: Team@1234");
  console.log("4. Client User:  email: client@legalex.in     | pass: Client@1234");
  console.log("-----------------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
