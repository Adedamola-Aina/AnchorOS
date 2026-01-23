import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';

export function DiagnosticPanel() {
    const { user } = useAuth();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fixing, setFixing] = useState(false);

    const runDiagnostic = async () => {
        setLoading(true);
        try {
            const functions = getFunctions();
            const diagnose = httpsCallable(functions, 'diagnoseFamilySharing');
            const result = await diagnose();
            setReport(result.data);
            console.log('DIAGNOSTIC REPORT:', JSON.stringify(result.data, null, 2));
        } catch (error) {
            console.error('Diagnostic error:', error);
            setReport({ error: String(error) });
        } finally {
            setLoading(false);
        }
    };

    const fixSharedAccounts = async () => {
        setFixing(true);
        try {
            const functions = getFunctions();
            const fix = httpsCallable(functions, 'forceUpdateAccountScope');
            // Hardcoded account ID from diagnostic: Zenith Bank
            const result = await fix({ accountId: '47Ah2FnrcDJzDvxiLbBM' });
            const data = result.data as any;
            alert('✅ ' + data.message + '\n\nInvitee should refresh now!');
            setReport(null);
        } catch (error) {
            console.error('Fix error:', error);
            alert('❌ Error: ' + (error as Error).message);
        } finally {
            setFixing(false);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <button
                onClick={runDiagnostic}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm"
            >
                {loading ? 'Running...' : '🔍 Run Diagnostic'}
            </button>

            <button
                onClick={fixSharedAccounts}
                disabled={fixing}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm"
            >
                {fixing ? 'Fixing...' : '🔧 Fix Shared Accounts'}
            </button>

            {report && (
                <div className="mt-4 max-w-2xl bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg max-h-96 overflow-auto">
                    <h3 className="font-bold mb-2">Diagnostic Report:</h3>
                    <pre className="text-xs overflow-auto">
                        {JSON.stringify(report, null, 2)}
                    </pre>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(report, null, 2));
                            alert('Copied to clipboard!');
                        }}
                        className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded"
                    >
                        Copy Report
                    </button>
                </div>
            )}
        </div>
    );
}
