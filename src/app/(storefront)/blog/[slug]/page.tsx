import { getBlogPost } from "@/lib/actions/settings";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Share2, Sparkles } from "lucide-react";
import { Metadata } from "next";
import styles from "./blog-post.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.metaTitle || post.title} | Blog`,
    description: post.metaDescription || post.excerpt || post.title,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className={styles.container}>
      <div className={styles.wrapper}>
        {/* Navigation */}
        <Link
          href="/blog"
          className={styles.backLink}
        >
          <ArrowLeft className={styles.backIcon} /> Back to All Articles
        </Link>

        {/* Post Title & Metadata */}
        <div className={styles.header}>
          {post.category && (
            <span className={styles.categoryBadge}>
              {post.category.name}
            </span>
          )}
          <h1 className={styles.title}>
            {post.title}
          </h1>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <Calendar className={styles.metaIcon} />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            {post.authorName && (
              <span className={styles.metaItem}>
                <User className={styles.metaIcon} />
                {post.authorName}
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className={styles.imageWrapper}>
            <img
              src={post.featuredImage}
              alt={post.title}
              className={styles.image}
            />
          </div>
        )}

        {/* Post Content */}
        <div className={styles.contentBox}>
          {post.content.split("\n\n").map((paragraph: string, index: number) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsSection}>
              <Tag className={styles.tagIcon} />
              {post.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className={styles.tag}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Next/Previous Article Footer */}
        <div className={styles.footerBox}>
          <Sparkles className={styles.footerIcon} />
          <h3 className={styles.footerTitle}>
            Loved this handmade story?
          </h3>
          <p className={styles.footerText}>
            Discover our collection of handcrafted crochet pieces ready to add cozy elegance to your daily routine.
          </p>
          <Link
            href="/shop"
            className={styles.footerBtn}
          >
            Explore Handmade Shop
          </Link>
        </div>
      </div>
    </article>
  );
}
