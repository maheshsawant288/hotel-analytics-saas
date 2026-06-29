'use client';

import { useState } from 'react';
import { createHotelWithDetails } from './actions';
import type { Channel, PropertyCategory, BedConfiguration } from '@/types';

// ─── constants ────────────────────────────────────────────────

const INPUT = 'w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white';

const STEPS = ['Property', 'Rooms', 'Room Types', 'Channels', 'Registration'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const PROPERTY_CATEGORIES: { value: PropertyCategory; label: string }[] = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'resort', label: 'Resort' },
  { value: 'boutique', label: 'Boutique Hotel' },
  { value: 'guest_house', label: 'Guest House' },
  { value: 'heritage', label: 'Heritage Property' },
];

const BED_CONFIGS: { value: BedConfiguration; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'twin', label: 'Twin' },
  { value: 'multiple', label: 'Multiple' },
];

const CHANNELS: { value: Channel; label: string; commission: number }[] = [
  { value: 'direct', label: 'Direct Booking', commission: 0 },
  { value: 'walk_in', label: 'Walk-in', commission: 0 },
  { value: 'booking_com', label: 'Booking.com', commission: 18 },
  { value: 'makemytrip', label: 'MakeMyTrip', commission: 20 },
  { value: 'agoda', label: 'Agoda', commission: 18 },
  { value: 'goibibo', label: 'Goibibo', commission: 18 },
  { value: 'expedia', label: 'Expedia', commission: 20 },
];

// ─── types ────────────────────────────────────────────────────

interface RoomTypeRow {
  name: string;
  room_count: string;
  base_rate: string;
  max_occupancy: string;
  bed_configuration: BedConfiguration;
}

const blankRoomType = (): RoomTypeRow => ({
  name: '',
  room_count: '',
  base_rate: '',
  max_occupancy: '2',
  bed_configuration: 'double',
});

// ─── component ────────────────────────────────────────────────

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 — property basics
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [starRating, setStarRating] = useState(3);
  const [category, setCategory] = useState<PropertyCategory>('hotel');

  // Step 2 — capacity
  const [totalRooms, setTotalRooms] = useState('');
  const [checkIn, setCheckIn] = useState('14:00');
  const [checkOut, setCheckOut] = useState('11:00');

  // Step 3 — room types
  const [roomTypes, setRoomTypes] = useState<RoomTypeRow[]>([blankRoomType()]);

  // Step 4 — channels (direct + walk_in pre-selected)
  const [channels, setChannels] = useState<Channel[]>(['direct', 'walk_in']);

  // Step 5 — registration (all optional)
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  // ─── helpers ──────────────────────────────────────────────

  const allocatedRooms = roomTypes.reduce(
    (sum, rt) => sum + (parseInt(rt.room_count) || 0),
    0
  );
  const totalRoomsInt = parseInt(totalRooms) || 0;
  const overAllocated = allocatedRooms > totalRoomsInt;

  function validate(): string {
    switch (step) {
      case 1:
        if (!name.trim()) return 'Hotel name is required.';
        if (!city.trim()) return 'City is required.';
        if (!state) return 'Please select a state.';
        return '';
      case 2:
        if (!totalRooms || totalRoomsInt < 1) return 'Total rooms must be at least 1.';
        return '';
      case 3: {
        if (roomTypes.length === 0) return 'Add at least one room type.';
        for (let i = 0; i < roomTypes.length; i++) {
          const rt = roomTypes[i];
          if (!rt.name.trim()) return `Room type ${i + 1}: name is required.`;
          if (!rt.room_count || parseInt(rt.room_count) < 1)
            return `Room type ${i + 1}: room count must be at least 1.`;
          if (!rt.base_rate || parseFloat(rt.base_rate) < 1)
            return `Room type ${i + 1}: base rate is required.`;
        }
        if (overAllocated)
          return `Allocated rooms (${allocatedRooms}) exceed total rooms (${totalRooms}).`;
        return '';
      }
      case 4:
        if (channels.length === 0) return 'Select at least one booking channel.';
        return '';
      default:
        return '';
    }
  }

  function next() {
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError('');
    setStep((s) => s + 1);
  }

  function back() {
    setFormError('');
    setStep((s) => s - 1);
  }

  function toggleChannel(ch: Channel) {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  }

  function updateRoomType(idx: number, field: keyof RoomTypeRow, value: string) {
    setRoomTypes((prev) =>
      prev.map((rt, i) => (i === idx ? { ...rt, [field]: value } : rt))
    );
  }

  function addRoomType() {
    setRoomTypes((prev) => [...prev, blankRoomType()]);
  }

  function removeRoomType(idx: number) {
    setRoomTypes((prev) => prev.filter((_, i) => i !== idx));
  }

  async function submit() {
    setLoading(true);
    setFormError('');

    const result = await createHotelWithDetails({
      name: name.trim(),
      city: city.trim(),
      state,
      star_rating: starRating,
      property_category: category,
      total_rooms: totalRoomsInt,
      check_in_time: checkIn,
      check_out_time: checkOut,
      room_types: roomTypes.map((rt) => ({
        name: rt.name.trim(),
        room_count: parseInt(rt.room_count),
        base_rate: parseFloat(rt.base_rate),
        max_occupancy: parseInt(rt.max_occupancy),
        bed_configuration: rt.bed_configuration,
      })),
      active_channels: channels,
      gst_number: gst.trim() || undefined,
      pan_number: pan.trim() || undefined,
      hotel_phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      pincode: pincode.trim() || undefined,
    });

    if (result?.error) {
      setFormError(result.error);
      setLoading(false);
    }
    // success → server action calls redirect('/dashboard'), page navigates
  }

  // ─── render ───────────────────────────────────────────────

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">

      {/* Step indicator */}
      <div className="flex items-start mb-8">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  done
                    ? 'bg-zinc-900 text-white'
                    : active
                    ? 'bg-zinc-900 text-white ring-2 ring-zinc-900 ring-offset-2'
                    : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {done ? '✓' : n}
                </div>
                <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${active ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mb-4 mx-1 ${done ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Property ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Hotel Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Grand Pune"
              className={INPUT}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    category === value
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'border-zinc-300 text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune"
                className={INPUT}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select value={state} onChange={(e) => setState(e.target.value)} className={INPUT}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStarRating(s)}
                  className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-colors ${
                    starRating === s
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'border-zinc-300 text-zinc-500 hover:border-zinc-400'
                  }`}
                >
                  {s}★
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Rooms ── */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Total Rooms <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={totalRooms}
              onChange={(e) => setTotalRooms(e.target.value)}
              placeholder="e.g. 50"
              className={INPUT}
            />
            <p className="text-xs text-zinc-400 mt-1">Total inventory including all room types</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Standard Check-in</label>
              <input
                type="time"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={INPUT}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Standard Check-out</label>
              <input
                type="time"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={INPUT}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-medium text-blue-800">Why this matters</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Check-in and check-out times help us accurately calculate daily occupancy when multiple bookings share the same day.
            </p>
          </div>
        </div>
      )}

      {/* ── Step 3: Room Types ── */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-700">Room Types</p>
              <p className={`text-xs mt-0.5 ${overAllocated ? 'text-red-500 font-medium' : 'text-zinc-400'}`}>
                {allocatedRooms} of {totalRooms} rooms allocated
                {allocatedRooms > 0 && !overAllocated && allocatedRooms < totalRoomsInt && (
                  <span className="ml-1 text-amber-500">— {totalRoomsInt - allocatedRooms} unassigned</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={addRoomType}
              className="text-sm text-zinc-700 border border-zinc-300 rounded-lg px-3 py-1.5 hover:bg-zinc-50 transition-colors font-medium"
            >
              + Add type
            </button>
          </div>

          {roomTypes.map((rt, idx) => (
            <div key={idx} className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-700">Room Type {idx + 1}</p>
                {roomTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoomType(idx)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                  Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rt.name}
                  onChange={(e) => updateRoomType(idx, 'name', e.target.value)}
                  placeholder="e.g. Deluxe, Suite, Standard"
                  className={INPUT}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    No. of Rooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rt.room_count}
                    onChange={(e) => updateRoomType(idx, 'room_count', e.target.value)}
                    placeholder="e.g. 20"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Base Rate / Night (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rt.base_rate}
                    onChange={(e) => updateRoomType(idx, 'base_rate', e.target.value)}
                    placeholder="e.g. 3500"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rt.max_occupancy}
                    onChange={(e) => updateRoomType(idx, 'max_occupancy', e.target.value)}
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Bed Configuration</label>
                  <select
                    value={rt.bed_configuration}
                    onChange={(e) =>
                      updateRoomType(idx, 'bed_configuration', e.target.value)
                    }
                    className={INPUT}
                  >
                    {BED_CONFIGS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Step 4: Channels ── */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            Select all channels you accept bookings through. We use this to calculate net revenue after OTA commissions.
          </p>
          <div className="space-y-2">
            {CHANNELS.map(({ value, label, commission }) => (
              <label
                key={value}
                className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={channels.includes(value)}
                  onChange={() => toggleChannel(value)}
                  className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span className="flex-1 text-sm font-medium text-zinc-800">{label}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    commission === 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {commission === 0 ? 'No commission' : `${commission}% commission`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 5: Registration (optional) ── */}
      {step === 5 && (
        <div className="space-y-5">
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
            <p className="text-sm font-medium text-zinc-700">Optional — skip if you prefer</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Registration details can be added any time from Settings.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">GST Number</label>
            <input
              type="text"
              value={gst}
              onChange={(e) => setGst(e.target.value.toUpperCase())}
              placeholder="e.g. 27AABCT1234A1Z5"
              maxLength={15}
              className={INPUT}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">PAN Number</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="e.g. AABCT1234A"
                maxLength={10}
                className={INPUT}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Hotel Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 020-2567-8901"
                className={INPUT}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 12 MG Road"
              className={INPUT}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Pin Code</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 411001"
              maxLength={6}
              className={INPUT}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {formError && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-5">
          {formError}
        </p>
      )}

      {/* Navigation */}
      <div className={`flex gap-3 mt-6 ${step === 1 ? '' : ''}`}>
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
        )}

        {step < 5 && (
          <button
            type="button"
            onClick={next}
            className="flex-1 bg-zinc-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Continue →
          </button>
        )}

        {step === 5 && (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-zinc-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Setting up…' : 'Finish setup →'}
          </button>
        )}
      </div>

      {step === 5 && (
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="w-full mt-3 text-sm text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
        >
          Skip registration and go to dashboard
        </button>
      )}
    </div>
  );
}
