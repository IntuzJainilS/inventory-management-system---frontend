"use client"

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface iDefault {
    defaultValue?: string;
}

const SearchBar = ({ defaultValue }: iDefault) => {

    const router = useRouter();
    const pathname = usePathname(); // this will get the current route (for example for books or for user etc)
    const searchParams = useSearchParams();

    const [inputValue, setInputValue] = useState(defaultValue ?? "");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        // const inputValue = event.target.value;
        setInputValue(event.target.value);
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            const value = inputValue.trim();

            //  if (!value) {
            //     return;
            // }
            // if (value.length < 3) return;

            const params = new URLSearchParams(searchParams.toString()); // create new url based on route

            if (!value) {
                params.delete("search");
            } else if (value.length >= 3) {
                params.set("search", value);
            } else {
                return;
            }

            router.push(`${pathname}?${params.toString()}`);
            // router.push(`/issueBook?search=${encodeURIComponent(value)}`);
        }, 500);

        return () => clearTimeout(delay);
    }, [inputValue]);

    return (
        <div className="flex justify-center">
            <div className="border p-2 rounded-4xl space-y-3 m-2 bg-white w-150">
                <input
                    type="text"
                    id="inputId"
                    placeholder="Enter your keywords"
                    value={inputValue ?? ""}
                    onChange={handleChange}
                    className="bg-transparent outline-none border-none w-full py-3 pl-2 pr-3"
                />
            </div>
        </div>
    );

}

export default SearchBar
