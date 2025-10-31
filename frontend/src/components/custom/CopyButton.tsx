import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
    text: string;
    label?: string;
}

export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            let url = `${window.location.origin}/${text}`
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="gap-2"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    {label}
                </>
            )}
        </Button>
    );
}
