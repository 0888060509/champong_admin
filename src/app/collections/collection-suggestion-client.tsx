
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
import { suggestProductCollections } from "@/ai/flows/suggest-product-collections";
import type { SuggestedCollection } from "@/ai/flows/suggest-product-collections";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface CollectionSuggestionClientProps {
    onSuggestionClick: (suggestion: SuggestedCollection) => void;
}

export function CollectionSuggestionClient({ onSuggestionClick }: CollectionSuggestionClientProps) {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description.trim()) {
        toast({
            title: "Error",
            description: "Please describe the kind of products you want to group.",
            variant: "destructive"
        })
        return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      const result = await suggestProductCollections({ description });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get collection suggestions:", error);
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
            AI Collection Assistant
          </CardTitle>
          <CardDescription>
            Describe the products you want to group, and let AI suggest a complete collection with rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Product Group Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., 'Our most profitable main courses' or 'vegetarian appetizers that are quick to prepare'."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Suggest Collections
          </Button>
        </CardFooter>
      </form>

      {(isLoading || suggestions.length > 0) && (
        <>
            <hr className="mx-6"/>
            <CardContent className="pt-6">
            <h3 className="text-lg font-semibold font-headline mb-4">AI Suggestions</h3>
            <p className="text-sm text-muted-foreground mb-4">Click a suggestion to pre-fill the creation form.</p>
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="bg-muted h-5 w-3/4 rounded-md"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted h-4 w-full rounded-md"></div>
                          <div className="bg-muted h-4 w-1/2 rounded-md mt-2"></div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
            )}
            {suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestions.map((suggestion, index) => (
                       <Card 
                            key={index} 
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => onSuggestionClick(suggestion)}
                        >
                           <CardHeader>
                               <CardTitle className="text-base font-headline">{suggestion.publicTitle}</CardTitle>
                               <CardDescription className="text-xs">{suggestion.publicSubtitle}</CardDescription>
                           </CardHeader>
                           <CardContent>
                                <p className="text-xs text-muted-foreground mb-2">Internal Name: {suggestion.name}</p>
                               <Badge variant="outline" className="font-mono text-xs p-1 whitespace-normal">
                                {formatCondition(suggestion.suggestedConditions)}
                               </Badge>
                           </CardContent>
                       </Card>
                    ))}
                </div>
            )}
            </CardContent>
        </>
      )}
    </Card>
  );
}

// Helper function to display conditions, can be extracted to a shared util
const operatorMap: { [key: string]: string } = {
  eq: '=',
  neq: '!=',
  gte: '>=',
  lte: '<=',
  contains: 'contains',
};

const criteriaMap: { [key: string]: string } = {
    category: 'Category',
    price: 'Price',
    profit_margin: 'Profit Margin',
    stock_level: 'Stock Level',
    tags: 'Tags'
}

const formatCondition = (condition: any): string => {
    if (condition.type === 'group') {
        const nested = condition.conditions.map(formatCondition).join(` ${condition.logic} `);
        return `(${nested})`;
    }
    const { criteria, operator, value } = condition;
    const formattedCriteria = criteriaMap[criteria] || criteria;
    const formattedOperator = operatorMap[operator] || operator;
    const formattedValue = typeof value === 'string' ? `'${value}'` : value;

    return `${formattedCriteria} ${formattedOperator} ${formattedValue}`;
}
