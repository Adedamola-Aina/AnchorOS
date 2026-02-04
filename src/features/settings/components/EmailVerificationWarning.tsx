/**
 * EmailVerificationWarning - Shown when email not verified
 * DES-002: Migrated to semantic tokens and primitives
 */

import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

export function EmailVerificationWarning() {
    return (
        <Card className="border-warning-200 dark:border-warning-800 bg-warning-50/50 dark:bg-warning-900/20">
            <CardContent className="p-6">
                <HStack gap="sm" align="start">
                    <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-500 mt-0.5 shrink-0" />
                    <VStack gap="xs">
                        <Text weight="semibold" className="text-warning-900 dark:text-warning-400">Email Verification Required</Text>
                        <Text size="sm" className="text-warning-700 dark:text-warning-500">
                            Please verify your email address before inviting family members. Check your inbox for a verification link.
                        </Text>
                    </VStack>
                </HStack>
            </CardContent>
        </Card>
    );
}

