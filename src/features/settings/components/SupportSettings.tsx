/**
 * SupportSettings - Contact and feedback
 * DES-002: Migrated to semantic tokens and primitives
 */

import { MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface SupportSettingsProps {
    onOpenContact: () => void;
}

export const SupportSettings = ({ onOpenContact }: SupportSettingsProps) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-[var(--border-subtle)] bg-info-50/30 dark:bg-info-900/10">
                <CardTitle className="text-base font-bold text-foreground dark:text-foreground-dark flex items-center gap-3">
                    <div className="p-2 bg-info-500/10 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-info-500" />
                    </div>
                    Contact & Feedback
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <HStack justify="between" align="center" className="flex-col md:flex-row text-center md:text-left gap-6">
                    <VStack gap="xs">
                        <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Get in Touch</Text>
                        <Text variant="muted" size="sm">
                            Report bugs, suggest features, or share feedback directly.
                        </Text>
                    </VStack>
                    <Button
                        onClick={onOpenContact}
                        className="!bg-info-500 hover:!bg-info-600 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 h-10 shadow-info-500/20 whitespace-nowrap w-full md:w-auto"
                    >
                        Send Message
                    </Button>
                </HStack>
            </CardContent>
        </Card>
    );
};

