import { getShowcaseImages } from "@/app/actions/image-actions";
import { Globe, Download } from "lucide-react";
import Image from "next/image";

export async function ShowcaseGrid() {
    const images = await getShowcaseImages();

    if (images.length === 0) {
        return (
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex-1 min-h-[400px] border rounded-none border-dashed flex flex-col items-center justify-center p-12 text-center text-muted-foreground gap-4">
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div className="max-w-xs">
                        <p className="text-foreground">No public showcase yet</p>
                        <p className="text-sm mt-1">
                            Select images from your dashboard to feature them on your profile (Download them).
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
            {images.map((img) => (
                <div key={img.id} className="group relative aspect-square border overflow-hidden bg-muted">
                    <Image
                        src={img.url}
                        alt={img.prompt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-white text-xs line-clamp-2">{img.prompt}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

