import { MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface SupportSettingsProps {
    onOpenContact: () => void;
}

export const SupportSettings = ({ onOpenContact }: SupportSettingsProps) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-cyan-50/30 dark:bg-cyan-900/10">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-cyan-500" />
                    </div>
                    Contact & Feedback
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Get in Touch</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Report bugs, suggest features, or share feedback directly.
                        </p>
                    </div>
                    <Button
                        onClick={onOpenContact}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 h-10 shadow-cyan-500/20 whitespace-nowrap w-full md:w-auto"
                    >
                        Send Message
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
