import { useState, useEffect } from 'react';

interface CropTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (cropType: string) => Promise<void>;
    initialValue?: string;
}

export function CropTypeModal({ isOpen, onClose, onSubmit, initialValue = '' }: CropTypeModalProps) {
    const [cropType, setCropType] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setCropType(initialValue);
            setError(null);
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cropType.trim()) {
            setError('Please enter a crop type.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(cropType.trim());
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to save crop type. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#1F2937]">
                            {initialValue ? 'Modify Crop Type' : 'Enter Crop Type'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="cropType"
                                className="block text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-2"
                            >
                                What are you growing?
                            </label>
                            <input
                                id="cropType"
                                type="text"
                                value={cropType}
                                onChange={(e) => setCropType(e.target.value)}
                                placeholder="e.g. Wheat, Corn, Tomatoes..."
                                className="w-full px-4 py-3 text-base border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all shadow-sm"
                                autoFocus
                                disabled={isSubmitting}
                            />
                            <p className="mt-2 text-xs text-[#6B7280]">
                                Enter a short but descriptive name for your crop.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-shake">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 text-sm font-bold text-[#374151] bg-white border border-[#D1D5DB] rounded-xl hover:bg-[#F3F4F6] transition-all"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    initialValue ? 'Update' : 'Save Crop Type'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
