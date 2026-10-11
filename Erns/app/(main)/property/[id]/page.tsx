import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyDetailAction } from "@/lib/actions/properties";
import { PropertyDetailView } from "@/components/property/PropertyDetail/PropertyDetailView";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getPropertyDetailAction(id);
  const property = res.property;

  if (!property) {
    return { title: "Property Not Found | ERNS Real Estate" };
  }

  return {
    title: `${property.title} | ERNS Ethiopia`,
    description: `${property.beds} Bed, ${property.baths} Bath ${property.propertyType} in ${property.subCity}, Addis Ababa. Price: ETB ${property.price.toLocaleString()}.`,
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.images.length > 0 ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const res = await getPropertyDetailAction(id);

  if (!res.success || !res.property) {
    notFound();
  }

  return <PropertyDetailView property={res.property} />;
}
