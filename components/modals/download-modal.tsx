'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, Check, Star } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { GeneratedImage } from "../dashboard/generator-view"

interface DownloadModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    image: GeneratedImage | null
}

export function DownloadModal({ open, onOpenChange, image }: DownloadModalProps) {
    const [quality, setQuality] = useState("hd")

    const handleDownload = async () => {
        if (!image) return;

        try {
            // In a real app, this might trigger a backend process to upscale
            // For now, we simulate different qualities by just downloading the original
            // potentially with a different filename suffix

            toast.promise(
                new Promise((resolve) => setTimeout(resolve, 1000)),
                {
                    loading: 'Preparing download...',
                    success: 'Download started!',
                    error: 'Failed to download'
                }
            );

            // Notify server that this image is 'downloaded' (showcased)
            const { markImageAsDownloaded } = await import('@/app/actions/image-actions');
            await markImageAsDownloaded(image.id);

            const response = await fetch(image.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `img-nano-${quality}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Download failed');
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Download Image</DialogTitle>
                    <DialogDescription>
                        Choose your preferred resolution and format.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <RadioGroup value={quality} onValueChange={setQuality} className="grid gap-4">

                        <div className="flex items-center justify-between space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                            <div className="flex items-center space-x-4">
                                <RadioGroupItem value="standard" id="standard" />
                                <div className="space-y-1">
                                    <Label htmlFor="standard" className="cursor-pointer font-medium">Standard</Label>
                                    <p className="text-xs text-muted-foreground">Original Resolution • JPG</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                            <div className="flex items-center space-x-4">
                                <RadioGroupItem value="hd" id="hd" />
                                <div className="space-y-1">
                                    <Label htmlFor="hd" className="cursor-pointer font-medium">High Definition</Label>
                                    <p className="text-xs text-muted-foreground">Upscaled 2x • PNG • Best for Web</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                <Star className="w-3 h-3 mr-1 fill-primary" /> Recommended
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                            <div className="flex items-center space-x-4">
                                <RadioGroupItem value="4k" id="4k" />
                                <div className="space-y-1">
                                    <Label htmlFor="4k" className="cursor-pointer font-medium">Ultra 4K</Label>
                                    <p className="text-xs text-muted-foreground">Upscaled 4x • PNG • Print Ready</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-xs">PRO</Badge>
                        </div>

                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleDownload} className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download {quality.toUpperCase()}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
