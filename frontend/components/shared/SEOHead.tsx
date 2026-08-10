interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  siteName?: string;
}

export function SEOHead({
  title,
  description,
  image,
  url,
  type = "website",
  siteName = "PhotoExhibit",
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://photography-app-q4be.vercel.app";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image?.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      <link rel="canonical" href={fullUrl} />
    </>
  );
}
