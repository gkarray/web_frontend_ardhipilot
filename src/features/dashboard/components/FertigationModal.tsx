import { useState, useEffect } from 'react';
import type { FertigationEvent, FertigationEventCreate } from '../../../api/fieldPlots';
import { createFertigationEvent, getFertigationEvents, updateFertigationEvent } from '../../../api/fieldPlots';

interface FertigationModalProps {
    isOpen: boolean;
    onClose: () => void;
    plotId: string;
    plotName: string;
}

export function FertigationModal({ isOpen, onClose, plotId, plotName }: FertigationModalProps) {
    const [events, setEvents] = useState<FertigationEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [fertilizerName, setFertilizerName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg/ha');
    const [notes, setNotes] = useState('');

    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && plotId) {
            loadEvents();
        } else {
            resetForm();
        }
    }, [isOpen, plotId]);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const data = await getFertigationEvents(plotId);
            setEvents(data);
        } catch (error) {
            console.error('Failed to load fertigation events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setFertilizerName('');
        setQuantity('');
        setUnit('kg/ha');
        setNotes('');
        setEditingEventId(null);
    };

    const handleEditClick = (event: FertigationEvent) => {
        setEditingEventId(event.id);
        setDate(event.date.split('T')[0]);
        setFertilizerName(event.fertilizer_name);
        setQuantity(event.quantity.toString());
        setUnit(event.unit);
        setNotes(event.notes || '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plotId) return;

        setIsSubmitting(true);
        try {
            const payload: FertigationEventCreate = {
                date: new Date(date).toISOString(),
                fertilizer_name: fertilizerName,
                quantity: parseFloat(quantity),
                unit,
                notes: notes || undefined,
            };

            if (editingEventId) {
                await updateFertigationEvent(editingEventId, payload);
            } else {
                await createFertigationEvent(plotId, payload);
            }

            await loadEvents();
            resetForm();
        } catch (error) {
            console.error('Failed to save fertigation event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all animate-scale-up max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">
                        Fertigation Log - {plotName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Section */}
                        <div>
                            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                                    {editingEventId ? 'Edit Event' : 'Log New Event'}
                                </h4>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Urea"
                                            value={fertilizerName}
                                            onChange={(e) => setFertilizerName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                placeholder="0.00"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                            <select
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all bg-white"
                                            >
                                                <option value="kg/ha">kg/ha</option>
                                                <option value="L/ha">L/ha</option>
                                                <option value="kg">kg</option>
                                                <option value="L">L</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                        <textarea
                                            rows={3}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        {editingEventId && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] focus:outline-none transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-100"
                                        >
                                            {isSubmitting ? 'Saving...' : (editingEventId ? 'Update Event' : 'Log Event')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="flex flex-col h-full min-h-[400px]">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center justify-between">
                                <span>Event History</span>
                                <span className="text-xs font-normal text-gray-500 normal-case bg-gray-100 px-2 py-1 rounded-full">
                                    {events.length} events
                                </span>
                            </h4>

                            {isLoading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="animate-spin h-6 w-6 text-[#10B981]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-sm text-gray-500">Loading history...</p>
                                    </div>
                                </div>
                            ) : events.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h5 className="text-gray-900 font-medium mb-1">No events yet</h5>
                                    <p className="text-sm text-gray-500">Log your first fertigation event to track your nutrient application.</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={() => handleEditClick(event)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md group relative overflow-hidden ${editingEventId === event.id
                                                ? 'border-[#10B981] bg-[#ECFDF5] ring-1 ring-[#10B981]'
                                                : 'border-gray-100 bg-white hover:border-[#10B981]'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-[#10B981] uppercase tracking-wide">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </span>
                                                    <h5 className="text-base font-bold text-gray-900">
                                                        {event.fertilizer_name}
                                                    </h5>
                                                </div>
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-lg">
                                                    {event.quantity} {event.unit}
                                                </span>
                                            </div>
                                            {event.notes && (
                                                <p className="text-sm text-gray-500 line-clamp-2 mt-1 pl-3 border-l-2 border-gray-200 group-hover:border-[#10B981] transition-colors">
                                                    {event.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
