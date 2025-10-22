
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { suggestCustomerSegmentsWithRules } from "@/ai/flows/suggest-customer-segments-with-rules";
import type { SuggestedSegment } from "@/ai/flows/suggest-customer-segments-with-rules";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SegmentationClientProps {
    onSuggestionClick: (suggestion: SuggestedSegment) => void;
}

export function SegmentationClient({ onSuggestionClick }: SegmentationClientProps) {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description.trim()) {
        toast({
            title: "Error",
            description: "Please enter a description for the customer segment.",
            variant: "destructive"
        })
        return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      const result = await suggestCustomerSegmentsWithRules({ description });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      toast({
        title: "AI Error",
        description: "Failed to get suggestions from the AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-accent w-6 h-6" />
            Customer Segmentation Tool
          </CardTitle>
          <CardDescription>
            Describe your desired customer segment, and let AI suggest some ideas to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Segment Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., 'Customers who frequently buy coffee on weekday mornings and live near downtown.'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div></div>
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Suggest Segments
          </Button>
        </CardFooter>
      </form>

      {(isLoading || suggestions.length > 0) && (
        <>
            <hr className="mx-6"/>
            <CardContent className="pt-6">
            <h3 className="text-lg font-semibold font-headline mb-4">AI Suggestions</h3>
            {isLoading && (
                <div className="space-y-2">
                    <div className="animate-pulse bg-muted h-8 w-1/2 rounded-md"></div>
                    <div className="animate-pulse bg-muted h-8 w-2/3 rounded-md"></div>
                    <div className="animate-pulse bg-muted h-8 w-1/3 rounded-md"></div>
                </div>
            )}
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                        <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-base p-2 cursor-pointer hover:bg-muted"
                            onClick={() => onSuggestionClick(suggestion)}
                        >
                            {suggestion.name}
                        </Badge>
                    ))}
                </div>
            )}
            </CardContent>
        </>
      )}
    </Card>
  );
}
