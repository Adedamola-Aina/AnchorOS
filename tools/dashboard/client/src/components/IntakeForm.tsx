import { useState } from 'react';
import axios from 'axios';
import { Plus, Bug, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { INTAKE_PRIORITIES, INTAKE_TYPES } from './intakeForm.constants';
import { getIntakeErrorMessage } from './intakeForm.utils';

interface IntakeFormProps {
    onSubmit?: () => void;
}

export function IntakeForm({ onSubmit }: IntakeFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [type, setType] = useState('bug');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('P1');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/intake', {
                type,
                title: title.trim(),
                description: description.trim(),
                priority
            });

            setSuccess(`Created ${response.data.ticket.id}: ${response.data.ticket.title}`);
            setTitle('');
            setDescription('');

            setTimeout(() => {
                setSuccess(null);
                setIsOpen(false);
            }, 3000);

            onSubmit?.();
        } catch (err) {
            setError(getIntakeErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const selectedType = INTAKE_TYPES.find((t) => t.value === type);
    const TypeIcon = selectedType?.icon || Bug;

    return (
        <div className="mb-6">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Report Bug or Request Feature
                </button>
            )}

            {isOpen && (
                <div className="card border-emerald-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Plus className="w-5 h-5 text-emerald-400" />
                            New Ticket
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {success && (
                        <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400">
                            <CheckCircle className="w-5 h-5" />
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            {INTAKE_TYPES.map(t => {
                                const Icon = t.icon;
                                return (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setType(t.value)}
                                        className={`p-3 rounded-lg border text-sm flex flex-col items-center gap-1 transition-all ${type === t.value
                                                ? 'bg-slate-700 border-emerald-500 text-white'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${t.color}`} />
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Title</label>
                            <div className="relative">
                                <TypeIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${selectedType?.color}`} />
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Brief summary..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Details..."
                                rows={3}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Priority</label>
                            <div className="flex gap-2">
                                {INTAKE_PRIORITIES.map(p => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => setPriority(p.value)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${priority === p.value
                                                ? p.color + ' font-bold'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !title.trim() || !description.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Create Ticket
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default IntakeForm;
