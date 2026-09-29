import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper function to get page data from our local JSON file
function getPageBySlug(slug: string) {
  const filePath = path.join(process.cwd(), "src/data/migrated_content.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);
  return data.pages.find((page: any) => page.slug === slug);
}

// Generate exact SEO metadata mapped from WordPress
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: page.seo.title || page.title,
    description: page.seo.description,
    alternates: {
      canonical: page.seo.canonical,
    },
  };
}

// Generates static paths for all our slugs at build time
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "src/data/migrated_content.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);
  
  return data.pages.map((page: any) => ({
    slug: page.slug,
  }));
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      
      {/* 
        This renders the raw HTML from WordPress. 
        Note: If Elementor styling is missing, we will need to rebuild 
        these specific pages as native Next.js components. 
      */}
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </main>
  );
}
