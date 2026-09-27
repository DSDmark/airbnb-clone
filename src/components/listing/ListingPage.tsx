import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingSidebar } from "@/components/booking/BookingSidebar";
import { SeoLinks } from "@/components/footer/SeoLinks";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { GalleryProvider } from "@/components/gallery/GalleryProvider";
import { PhotoTour } from "@/components/gallery/PhotoTour";
import { SiteHeader } from "@/components/header/SiteHeader";
import { HostSection } from "@/components/host/HostSection";
import { LocationSection } from "@/components/location/LocationSection";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { PressFeedback } from "@/components/ui/PressFeedback";
import { formatRating } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { Amenities } from "./Amenities";
import { Description } from "./Description";
import { HeroGallery } from "./HeroGallery";
import { Highlights } from "./Highlights";
import { HostSummary } from "./HostSummary";
import { ListingActionsProvider } from "./ListingActions";
import { Overview } from "./Overview";
import { SleepingArrangements } from "./SleepingArrangements";
import { StickySubnav } from "./StickySubnav";
import { ThingsToKnow } from "./ThingsToKnow";
import { TitleBar } from "./TitleBar";
import styles from "./ListingPage.module.css";

/** The listing detail page. Pure composition: all content comes from `listing`. */
export function ListingPage({ listing }: { listing: Listing }) {
  const byId = new Map(listing.photos.map((p) => [p.id, p]));
  const heroPhotos = listing.heroPhotoIds.map((id) => byId.get(id)).filter((p) => p !== undefined);
  const share = {
    title: listing.title,
    line: [
      `${listing.propertyType.replace(/^Entire /, "").replace(/^\w/, (c) => c.toUpperCase())} in ${listing.locationLabel.split(",")[0]}`,
      `★${formatRating(listing.reviews.overall)}`,
      ...listing.capacity.slice(1),
    ].join(" · "),
    imageUrl: heroPhotos[0]?.url ?? "",
  };

  return (
    <ListingActionsProvider listingId={listing.id} share={share} reviews={listing.reviews}>
      <GalleryProvider>
        <BookingProvider maxGuests={listing.booking.maxGuests} nightlyRate={listing.booking.nightlyRate}>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" tabIndex={-1} className={styles.main}>
            <StickySubnav rating={listing.reviews.overall} reviewCount={listing.reviews.count} />
            <div className={styles.page}>
              <TitleBar title={listing.title} />
              <HeroGallery photos={heroPhotos} title={listing.title} />

              <div className={styles.columns}>
                <div className={styles.content}>
                  <Overview listing={listing} />
                  <HostSummary host={listing.host} />
                  <Highlights items={listing.highlights} />
                  <Description sections={listing.description} translated={listing.translated} />
                  <SleepingArrangements spaces={listing.sleeping} photos={listing.photos} />
                  <Amenities
                    preview={listing.amenities.preview}
                    groups={listing.amenities.groups}
                    total={listing.amenities.total}
                  />
                </div>
                <aside className={styles.sidebar} aria-label="Reserve">
                  <BookingSidebar promo={listing.booking.promo} />
                </aside>
              </div>

              <ReviewsSection reviews={listing.reviews} />
              <LocationSection location={listing.location} />
              <HostSection host={listing.host} />
              <ThingsToKnow policies={listing.policies} />
            </div>
            <SeoLinks listing={listing} />
          </main>
          <SiteFooter />
          <PhotoTour photos={listing.photos} rooms={listing.rooms} />
          <PressFeedback />
        </BookingProvider>
      </GalleryProvider>
    </ListingActionsProvider>
  );
}
