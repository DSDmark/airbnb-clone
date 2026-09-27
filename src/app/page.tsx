import { ListingPage } from "@/components/listing/ListingPage";
import { listing } from "@/data/listing";

export default function Home() {
  return <ListingPage listing={listing} />;
}
