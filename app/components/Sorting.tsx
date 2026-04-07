"use client";
import React from 'react';
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterProps {
    sortOptions: { label: string; value: string }[];
}

const SortingAndFiltering = ({ sortOptions }: FilterProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper to update the URL
    const updateQuery = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.set("page", "1"); // this will reset the page

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex gap-4 p-4  rounded-lg">
            {/* sort by columns */}
            <div className="flex flex-col">
                <label className="text-sm font-bold">Sort By</label>
                <select
                    value={searchParams.get("status") || ""}
                    onChange={(e) => updateQuery("status", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Status</option>
                    
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ORDER (ASC/DESC)  */}
            <div className="flex flex-col">
                <label className="text-sm font-bold">Order</label>
                <select
                    value={searchParams.get("order") || "DESC"}
                    onChange={(e) => updateQuery("order", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="DESC">Descending (Newest/High)</option>
                    <option value="ASC">Ascending (Oldest/Low)</option>
                </select>
            </div>

            {/* LIMIT (for changing no. of datas displayed ) */}
            {/* <div className="flex flex-col">
        <label className="text-sm font-bold">Show</label>
        <select
          value={searchParams.get("limit") || "10"}
          onChange={(e) => updateQuery("limit", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div> */}
        </div>
    );
};

export default SortingAndFiltering;
