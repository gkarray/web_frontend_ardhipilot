import { useState, useEffect } from 'react';

interface DatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: Date) => void;
    selectedDate: Date;
}

export function DatePickerModal({ isOpen, onClose, onSelect, selectedDate }: DatePickerModalProps) {
    const [dateString, setDateString] = useState(selectedDate.toISOString().split('T')[0]);
    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (isOpen) {
            setDateString(selectedDate.toISOString().split('T')[0]);
        }
    }, [isOpen, selectedDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const date = new Date(dateString);
        // Correct for timezone offset if needed, but standard input date is usually fine
        onSelect(date);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#1F2937]">
                            Select Date
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="obsDate"
                                className="block text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-2"
                            >
                                Observation Date
                            </label>
                            <input
                                id="obsDate"
                                type="date"
                                value={dateString}
                                max={todayStr}
                                onChange={(e) => setDateString(e.target.value)}
                                className="w-full px-4 py-3 text-base border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all shadow-sm"
                                autoFocus
                            />
                            <p className="mt-2 text-xs text-[#6B7280]">
                                Choose the date you want to view on the dashboard. Future dates are disabled.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 text-sm font-bold text-[#374151] bg-white border border-[#D1D5DB] rounded-xl hover:bg-[#F3F4F6] transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transform active:scale-95 transition-all shadow-lg shadow-emerald-100"
                            >
                                Confirm Date
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
