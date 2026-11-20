import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  ChevronRight,
  Clock,
  User,
  Calendar,
  Share2,
  ArrowLeft,
  Scale,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Insight | LEGALEX" };

  return {
    title: `${post.title} | LEGALEX Chambers`,
    description: post.excerpt,
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  // Get other posts for related widget
  const morePosts = await prisma.blogPost.findMany({
    where: { slug: { not: slug } },
    take: 3,
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        {/* Header Hero */}
        <div className="bg-[#071526] text-white py-14 border-b border-[#132B4F]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              <Link href="/insights" className="hover:text-white">Insights</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span className="text-[#DFB75E] truncate">{post.category}</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#132B4F] text-[#DFB75E] border border-[#C9A24B]/30 mb-4">
              {post.category}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-2 border-t border-[#132B4F]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DFB75E] text-[#071526] flex items-center justify-center font-bold text-[10px]">
                  AR
                </div>
                <span>{post.authorName} (Sanad No. {siteConfig.founder.sanadNumber})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>{post.readTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Published {new Date(post.publishedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E0D5] shadow-sm space-y-8">
              <div className="aspect-[16/9] relative rounded-2xl overflow-hidden shadow-md" style={{ position: "relative" }}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Lead Paragraph */}
              <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed border-l-4 border-[#C9A24B] pl-4 italic">
                {post.excerpt}
              </p>

              {/* Formatted Content */}
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                {post.content}
              </div>

              {/* Author Bio Box */}
              <div className="mt-12 pt-8 border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center gap-6 bg-[#F8F6F1] p-6 rounded-2xl">
                <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 border-2 border-[#C9A24B]">
                  <Image
                    src={siteConfig.founder.image}
                    alt={siteConfig.founder.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-serif text-base font-bold text-[#071526]">
                    Authored by {siteConfig.founder.name}
                  </h4>
                  <p className="text-xs text-[#B88E33] font-semibold">
                    {siteConfig.founder.title} • Sanad No. {siteConfig.founder.sanadNumber}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Lead Counsel at Legalex Chambers. Specializes in Maharashtra Land Revenue litigation, high-value consumer claims, and constitutional courtroom defense.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-[#E5E0D5]">
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] hover:text-[#C9A24B]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to All Insights
                </Link>

                <Link
                  href="/book-consultation"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1F3A] text-white hover:bg-[#132B4F] text-xs font-semibold"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#DFB75E]" />
                  Consult with Counsel on this Topic
                </Link>
              </div>
            </article>

            {/* Related Articles */}
            {morePosts.length > 0 && (
              <div className="mt-16">
                <h3 className="font-serif text-2xl font-bold text-[#071526] mb-6">
                  More From Chambers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {morePosts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/insights/${p.slug}`}
                      className="bg-white rounded-xl p-5 border border-[#E5E0D5] hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#B88E33] uppercase">
                          {p.category}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#071526] line-clamp-2 my-1">
                          {p.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span>{p.readTime}</span>
                        <span className="text-[#0B1F3A] font-bold">Read →</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
