import { getBlogPosts } from "@/lib/actions/settings";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Sparkles, ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import styles from "./blog.module.css";

export const metadata = {
  title: "Crochet Stories, Patterns & Care Guides | Blog",
  description: "Read our artisanal crochet journal featuring pattern guides, yarn styling ideas, and care tips from our crochet studio.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { posts, total } = await getBlogPosts({ page, limit: 12 });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>
            <Sparkles className={styles.badgeIcon} /> The Crochet Journal
          </span>
          <h1 className={styles.title}>
            Stories & Care Guides
          </h1>
          <p className={styles.subtitle}>
            Explore behind-the-scenes studio stories, yarn guides, stitch tutorials, and handmade gift inspiration.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <BookOpen className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Stories Coming Soon</h3>
            <p className={styles.emptyText}>
              Our studio writers are crafting new articles. Check back soon!
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post: any) => (
              <article
                key={post.id}
                className={styles.card}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className={styles.imageLink}
                >
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.placeholder}>🧶</div>
                  )}
                  {post.category && (
                    <span className={styles.categoryBadge}>
                      {post.category.name}
                    </span>
                  )}
                </Link>

                <div className={styles.cardBody}>
                  <div className={styles.cardInfo}>
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

                    <Link href={`/blog/${post.slug}`} className={styles.postTitle}>
                      {post.title}
                    </Link>

                    {post.excerpt && (
                      <p className={styles.excerpt}>
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.readMoreBtn}
                  >
                    Read Article <ArrowRight className={styles.readMoreIcon} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
