"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  ShieldCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Layers,
} from "lucide-react";
import styles from "./hero.module.css";

export function HeroSection({
  heroImage,
}: {
  heroImage?: string | null;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [ambientVideoActive, setAmbientVideoActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const displayImage = heroImage || "/images/crochet-hero-bg.jpg";
  const videoSrc = "/videos/crochet-hero-bg.mp4";
  const posterSrc = "/images/crochet-video-poster.jpg";

  useEffect(() => {
    // Attempt autoplay
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
    if (bgVideoRef.current) {
      bgVideoRef.current.play().catch(() => {});
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (bgVideoRef.current) bgVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        if (bgVideoRef.current) bgVideoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className={styles.section}>
      {/* Dynamic Ambient Background Video (Infinite Running) */}
      {ambientVideoActive && (
        <div className={styles.ambientVideoContainer} aria-hidden="true">
          <video
            ref={bgVideoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={styles.ambientVideo}
          />
          <div className={styles.ambientVideoOverlay} />
        </div>
      )}

      {/* Decorative Crochet Background Pattern & Orbs */}
      <div className={styles.crochetPatternOverlay} aria-hidden="true" />
      <div className={styles.ambientGlowOrb1} aria-hidden="true" />
      <div className={styles.ambientGlowOrb2} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Text Column */}
          <div className={styles.leftColumn}>
            {/* Top Pill Badge */}
            <div className={styles.badge}>
              <span className={styles.pulseDot} />
              <Sparkles className={styles.badgeIcon} />
              <span>100% Handcrafted Crochet • Woven with Love</span>
            </div>

            {/* Main Heading */}
            <h1 className={styles.heading}>
              Artisanal Crochet,{" "}
              <span className={styles.headingHighlight}>
                Woven from the Heart
              </span>
            </h1>

            {/* Subheading */}
            <p className={styles.subheading}>
              Explore our boutique of delicate handmade crochet keychains, everlasting flower bouquets, cozy plushies, and custom bespoke commissions crafted from 100% organic milk cotton.
            </p>

            {/* Action Buttons Row */}
            <div className={styles.buttonGroup}>
              <Link href="/shop" className={styles.primaryBtn}>
                <span>Shop Pink Collection</span>
                <ArrowRight className={styles.btnIcon} />
              </Link>
              <Link href="/custom-order" className={styles.secondaryBtn}>
                <Sparkles className={styles.btnSparkleIcon} />
                <span>Custom Commission</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <Heart className={`${styles.trustIcon} fill-current`} />
                </div>
                <span>100% Handcrafted</span>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <ShieldCheck className={styles.trustIcon} />
                </div>
                <span>Hypoallergenic Cotton</span>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <Star className={`${styles.trustIcon} fill-current`} />
                </div>
                <span>5.0 Star Reviews</span>
              </div>
            </div>

            {/* Mini Features Ribbon */}
            <div className={styles.miniFeatures}>
              <div className={styles.miniFeatureItem}>
                <CheckCircle2 className={styles.miniCheckIcon} />
                <span>Slow Fashion</span>
              </div>
              <span className={styles.miniDivider}>•</span>
              <div className={styles.miniFeatureItem}>
                <CheckCircle2 className={styles.miniCheckIcon} />
                <span>Heirloom Quality</span>
              </div>
              <span className={styles.miniDivider}>•</span>
              <div className={styles.miniFeatureItem}>
                <CheckCircle2 className={styles.miniCheckIcon} />
                <span>Worldwide Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column - Infinite Video & Media Showcase */}
          <div className={styles.rightColumn}>
            <div className={styles.videoShowcaseWrapper}>
              {/* Glowing Pink Backdrop Halo */}
              <div className={styles.glowBackdrop} />

              <div className={styles.videoCard}>
                {/* Top Live Badge Bar */}
                <div className={styles.videoCardHeader}>
                  <div className={styles.liveTag}>
                    <span className={styles.liveIndicator} />
                    <span>Studio In-Action</span>
                  </div>
                  <div className={styles.craftBadge}>
                    <Flame className={styles.flameIcon} />
                    <span>Pure Hand Stitched</span>
                  </div>
                </div>

                {/* Video Player Frame */}
                <div className={styles.videoFrame}>
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={posterSrc}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    className={styles.mainVideo}
                    onClick={togglePlay}
                  />

                  {/* Dark subtle bottom gradient for text contrast */}
                  <div className={styles.videoBottomGradient} />

                  {/* Bottom Video Controls Overlay */}
                  <div className={styles.videoControlsBar}>
                    <div className={styles.videoDetails}>
                      <p className={styles.videoTitle}>Crochet Heart Stitching</p>
                      <p className={styles.videoSubtitle}>Slow Crafted • 100% Organic Cotton</p>
                    </div>

                    <div className={styles.controlButtons}>
                      <button
                        type="button"
                        onClick={togglePlay}
                        className={styles.ctrlBtn}
                        aria-label={isPlaying ? "Pause Video" : "Play Video"}
                        title={isPlaying ? "Pause Video" : "Play Video"}
                      >
                        {isPlaying ? <Pause className={styles.ctrlIcon} /> : <Play className={styles.ctrlIcon} />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className={styles.ctrlBtn}
                        aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                      >
                        {isMuted ? <VolumeX className={styles.ctrlIcon} /> : <Volume2 className={styles.ctrlIcon} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Review Badge */}
                <div className={styles.floatingReview}>
                  <div className={styles.reviewAvatarGroup}>
                    <span className={styles.avatarMini}>🌸</span>
                    <span className={styles.avatarMini}>🎀</span>
                    <span className={styles.avatarMini}>✨</span>
                  </div>
                  <div className={styles.reviewContent}>
                    <div className={styles.reviewRatingRow}>
                      <span className={styles.stars}>★★★★★</span>
                      <span className={styles.ratingNumber}>5.0</span>
                    </div>
                    <span className={styles.reviewText}>500+ Happy Customers</span>
                  </div>
                </div>

                {/* Floating Bespoke Badge */}
                <div className={styles.floatingBespokeBadge}>
                  <Layers className={styles.bespokeIcon} />
                  <span>Custom Orders Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
