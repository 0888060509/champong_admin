
import { addDays } from 'date-fns';

type Condition = {
  id?: string;
  type: 'condition';
  criteria: string;
  operator: string;
  value: any;
};

type ConditionGroup = {
    id?: string;
    type: 'group';
    logic: 'AND' | 'OR';
    conditions: (Condition | ConditionGroup)[];
};

type SegmentRule = {
    name: string;
    description: string;
    root: ConditionGroup;
}

/**
 * Defines the static business rules for creating segments from RFM analysis.
 * Uses dynamic placeholder strings for date values.
 */
const RFM_SEGMENT_RULE_MAPPING: { [key: string]: SegmentRule } = {
    'Champions': {
        name: 'Champions',
        description: 'Best customers who bought recently, buy often and spend the most.',
        root: { type: 'group', logic: 'AND', conditions: [
            { type: 'condition', criteria: 'lastVisit', operator: 'after', value: 'DATE_30_DAYS_AGO' },
            { type: 'condition', criteria: 'orderFrequency', operator: 'gte', value: 5 },
            { type: 'condition', criteria: 'totalSpend', operator: 'gte', value: 1000 },
        ]}
    },
    'Loyal Customers': {
        name: 'Loyal Customers',
        description: 'Customers who buy on a regular basis. Responsive to promotions.',
        root: { type: 'group', logic: 'AND', conditions: [
             { type: 'condition', criteria: 'orderFrequency', operator: 'gte', value: 3 },
             { type: 'condition', criteria: 'totalSpend', operator: 'gte', value: 500 },
        ]}
    },
    'At Risk': {
        name: 'At Risk',
        description: 'Spent big money and purchased often, but long time ago. Need to bring them back!',
        root: { type: 'group', logic: 'AND', conditions: [
            { type: 'condition', criteria: 'lastVisit', operator: 'before', value: 'DATE_90_DAYS_AGO' },
            { type: 'condition', criteria: 'totalSpend', operator: 'gte', value: 500 },
        ]}
    },
     'Hibernating': {
        name: 'Hibernating',
        description: 'Last purchase was long back, low spenders and low number of orders.',
        root: { type: 'group', logic: 'AND', conditions: [
            { type: 'condition', criteria: 'lastVisit', operator: 'before', value: 'DATE_180_DAYS_AGO' },
            { type: 'condition', criteria: 'orderFrequency', operator: 'lte', value: 2 },
        ]}
    },
    // Add other segment mappings here
};

/**
 * Processes a rule object, replacing dynamic date placeholders with actual ISO date strings.
 * @param rule The raw rule object from the mapping.
 * @returns A new rule object with calculated date values.
 */
function processDynamicValues(rule: SegmentRule): SegmentRule {
    const processedRoot = JSON.parse(JSON.stringify(rule.root)); // Deep copy to avoid mutation

    function traverse(conditions: (Condition | ConditionGroup)[]) {
        for (const condition of conditions) {
            if (condition.type === 'group') {
                traverse(condition.conditions);
            } else if (typeof condition.value === 'string' && condition.value.startsWith('DATE_')) {
                condition.value = calculateDateValue(condition.value);
            }
        }
    }

    traverse(processedRoot.conditions);

    return { ...rule, root: processedRoot };
}

/**
 * Calculates a date based on a dynamic placeholder string.
 * @param placeholder The placeholder string (e.g., 'DATE_30_DAYS_AGO').
 * @returns An ISO date string.
 */
function calculateDateValue(placeholder: string): string {
    const now = new Date();
    const parts = placeholder.split('_');

    if (placeholder === 'DATE_TODAY') {
        return now.toISOString();
    }
    
    if (parts.length > 2 && parts[1].match(/^\d+$/)) {
        const amount = parseInt(parts[1], 10);
        const unit = parts[2];
        
        if (unit === 'DAYS' && parts[3] === 'AGO') {
            return addDays(now, -amount).toISOString();
        }
        if (unit === 'DAYS' && parts[3] === 'FROM' && parts[4] === 'NOW') {
            return addDays(now, amount).toISOString();
        }
    }

    // Fallback for unhandled placeholders
    return now.toISOString();
}


/**
 * Retrieves the processed, ready-to-use segment rules for a given segment name.
 * @param segmentName The name of the RFM segment (e.g., 'Champions').
 * @returns The processed segment rule object or null if not found.
 */
export function getSegmentRules(segmentName: string): SegmentRule | null {
    const rawRule = RFM_SEGMENT_RULE_MAPPING[segmentName];
    if (!rawRule) {
        return null;
    }
    return processDynamicValues(rawRule);
}

    