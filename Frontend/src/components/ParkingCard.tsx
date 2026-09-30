"use client";

import Link from "next/link";

export type Parking = {
  id: number;
  parkingName: string;
  location: string;
  description?: string;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number | string;
  owner?: {
    id: number;
    fullName?: string;
    email?: string;
  };
};

type ParkingCardProps = {
  parking: Parking;
  actionText?: string;
  actionHref?: string;
};

export default function ParkingCard({
  parking,
  actionText = "Reserve Slot",
  actionHref,
}: ParkingCardProps) {
  const isAvailable = Number(parking.availableSlots) > 0;
  const targetHref = actionHref || `/parking/${parking.id}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition p-5 flex flex-col justify-between">
      <div>
        {/* Header: Name and Status Badge */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {parking.parkingName}
          </h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border ${
              isAvailable
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {isAvailable
              ? `${parking.availableSlots} Available`
              : "Full"}
          </span>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
          {parking.location}
        </p>

        {/* Description */}
        {parking.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {parking.description}
          </p>
        )}

        {/* Slots & Pricing Info */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded mb-4 text-xs text-gray-700">
          <div>
            <span className="text-gray-500 block">Total Capacity</span>
            <span className="font-semibold text-gray-900 text-sm">
              {parking.totalSlots} Slots
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Rate</span>
            <span className="font-semibold text-blue-600 text-sm">
              ৳{Number(parking.pricePerHour)} / hr
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={targetHref}
        className={`w-full text-center py-2 px-4 rounded text-sm font-medium transition ${
          isAvailable
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        {actionText}
      </Link>
    </div>
  );
}
