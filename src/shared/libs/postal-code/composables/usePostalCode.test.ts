import { describe, it, expect } from "vitest";
import { usePostalCode } from "./usePostalCode";

const invalidMessage = (placeholder: string) =>
    `Invalid postal code. Expected: ${placeholder}`;

// ---------------------------------------------------------------------------
// Test-case registry
// ---------------------------------------------------------------------------

type CountryCase = {
    description: string;
    expectedMask: string;
    expectedPlaceholder: string;
    valid: Array<{ code: string; note: string }>;
    invalid: Array<{ code: string; note: string }>;
};

const CASES: Record<string, CountryCase> = {
    CA: {
        description: "Canada — A1A 1A1",
        expectedMask: "A#A #A#",
        expectedPlaceholder: "A1A 1A1",
        valid: [
            { code: "K1A 0B1", note: "standard with space" },
            { code: "K1A0B1",  note: "no space (space is optional in pattern)" },
            { code: "V5K 0A1", note: "BC province" },
            { code: "M4W 3L4", note: "Toronto" },
            { code: "H3Z 2Y7", note: "Quebec" },
            { code: "X0A 0H0", note: "Nunavut — leading zero digit" },
            { code: "k1a 0b1", note: "all lowercase" },
            { code: "k1a0b1",  note: "lowercase no space" },
        ],
        invalid: [
            { code: "K1A  0B1",  note: "double space" },
            { code: "1A1 1A1",   note: "starts with digit" },
            { code: "AA1 1A1",   note: "two letters then digit (wrong order)" },
            { code: "K1A 0B",    note: "missing last character" },
            { code: "K1A 0B12",  note: "extra character at end" },
            { code: "K1A-0B1",   note: "hyphen instead of space" },
            { code: "K1A0B",     note: "only 6 chars — too short" },
            { code: "K1A 0B1X",  note: "8 chars — too long" },
            { code: "K!A 0B1",   note: "special char inside" },
        ],
    },

    AU: {
        description: "Australia — 4 digits",
        expectedMask: "####",
        expectedPlaceholder: "2000",
        valid: [
            { code: "2000", note: "Sydney CBD" },
            { code: "0800", note: "Darwin — leading zero" },
            { code: "4000", note: "Brisbane" },
            { code: "9999", note: "numeric maximum" },
            { code: "0001", note: "leading zeros" },
        ],
        invalid: [
            { code: "123",    note: "3 digits — too short" },
            { code: "12345",  note: "5 digits — too long" },
            { code: "ABCD",   note: "letters only" },
            { code: "20 00",  note: "digit with space" },
            { code: "20-00",  note: "digit with hyphen" },
            { code: "2000 ",  note: "trailing space" },
            { code: " 2000",  note: "leading space" },
            { code: "200A",   note: "letter mixed in" },
        ],
    },

    IT: {
        description: "Italy — 5 digits",
        expectedMask: "#####",
        expectedPlaceholder: "00100",
        valid: [
            { code: "00100", note: "Rome" },
            { code: "12345", note: "generic" },
            { code: "99999", note: "maximum" },
            { code: "00001", note: "leading zeros" },
        ],
        invalid: [
            { code: "1234",    note: "4 digits — too short" },
            { code: "123456",  note: "6 digits — too long" },
            { code: "ABCDE",   note: "letters only" },
            { code: "001 00",  note: "with space" },
            { code: "001-00",  note: "with hyphen" },
            { code: "0010A",   note: "letter at end" },
        ],
    },

    DE: {
        description: "Germany — 5 digits",
        expectedMask: "#####",
        expectedPlaceholder: "12345",
        valid: [
            { code: "10115", note: "Berlin" },
            { code: "80331", note: "Munich" },
            { code: "00000", note: "all zeros" },
            { code: "99999", note: "all nines" },
        ],
        invalid: [
            { code: "1234",    note: "4 digits" },
            { code: "123456",  note: "6 digits" },
            { code: "1234 5",  note: "with space" },
            { code: "1234A",   note: "letter at end" },
        ],
    },

    NZ: {
        description: "New Zealand — 4 digits",
        expectedMask: "####",
        expectedPlaceholder: "6011",
        valid: [
            { code: "6011", note: "Wellington" },
            { code: "1010", note: "central Auckland" },
            { code: "9016", note: "Dunedin" },
            { code: "0001", note: "leading zeros" },
        ],
        invalid: [
            { code: "123",   note: "3 digits" },
            { code: "12345", note: "5 digits" },
            { code: "1A23",  note: "letter mixed in" },
            { code: "10 10", note: "with space" },
        ],
    },

    EE: {
        description: "Estonia — 5 digits",
        expectedMask: "#####",
        expectedPlaceholder: "15165",
        valid: [
            { code: "15165", note: "Tallinn" },
            { code: "10111", note: "Tallinn district" },
            { code: "80001", note: "Pärnu" },
        ],
        invalid: [
            { code: "1516",   note: "4 digits" },
            { code: "151650", note: "6 digits" },
            { code: "1516A",  note: "letter at end" },
        ],
    },

    FI: {
        description: "Finland — 5 digits",
        expectedMask: "#####",
        expectedPlaceholder: "00100",
        valid: [
            { code: "00100", note: "Helsinki" },
            { code: "33100", note: "Tampere" },
            { code: "90500", note: "Oulu" },
        ],
        invalid: [
            { code: "0010",   note: "4 digits" },
            { code: "001000", note: "6 digits" },
            { code: "FI001",  note: "country prefix included" },
        ],
    },

    NO: {
        description: "Norway — 4 digits",
        expectedMask: "####",
        expectedPlaceholder: "0161",
        valid: [
            { code: "0161", note: "Oslo" },
            { code: "5003", note: "Bergen" },
            { code: "9008", note: "Tromsø" },
            { code: "0001", note: "leading zero" },
        ],
        invalid: [
            { code: "016",   note: "3 digits" },
            { code: "01612", note: "5 digits" },
            { code: "NO01",  note: "country code prefix" },
            { code: "01 61", note: "with space" },
        ],
    },

    AT: {
        description: "Austria — 4 digits",
        expectedMask: "####",
        expectedPlaceholder: "1010",
        valid: [
            { code: "1010", note: "Vienna" },
            { code: "5020", note: "Salzburg" },
            { code: "8010", note: "Graz" },
            { code: "0001", note: "leading zero" },
        ],
        invalid: [
            { code: "101",   note: "3 digits" },
            { code: "10100", note: "5 digits" },
            { code: "10A0",  note: "letter inside" },
            { code: "10 10", note: "with space" },
        ],
    },

    SE: {
        description: "Sweden — 123 45",
        expectedMask: "### ##",
        expectedPlaceholder: "111 22",
        valid: [
            { code: "111 22", note: "Stockholm — with space" },
            { code: "11122",  note: "no space (space is optional in pattern)" },
            { code: "413 01", note: "Gothenburg" },
            { code: "901 85", note: "Umeå" },
        ],
        invalid: [
            { code: "111  22", note: "double space" },
            { code: "1112 2",  note: "space in wrong position" },
            { code: "111 2",   note: "second group too short" },
            { code: "111 222", note: "second group too long" },
            { code: "11A 22",  note: "letter in first group" },
            { code: "111 AB",  note: "letters in second group" },
            { code: "111-22",  note: "hyphen instead of space" },
            { code: "1122",    note: "4 digits total — too short" },
        ],
    },

    IE: {
        description: "Ireland — A12 B345",
        expectedMask: "A## NNNN",
        expectedPlaceholder: "D01 F5P2",
        valid: [
            { code: "D01 F5P2", note: "Dublin — with space" },
            { code: "D01F5P2",  note: "no space (space optional)" },
            { code: "V94 T9K2", note: "Limerick" },
            { code: "H91 R2KT", note: "Galway" },
            { code: "d01 f5p2", note: "all lowercase" },
            { code: "A12 B345", note: "all-digit second group" },
        ],
        invalid: [
            { code: "D1 F5P2",   note: "only 1 digit in routing key" },
            { code: "01 F5P2",   note: "starts with digit" },
            { code: "D01 F5P",   note: "second group only 3 chars" },
            { code: "D01 F5P23", note: "second group 5 chars — too long" },
            { code: "D01-F5P2",  note: "hyphen instead of space" },
            { code: "D0 F5P2",   note: "only 1 digit before optional space" },
        ],
    },

    NL: {
        description: "Netherlands — 1234 AB",
        expectedMask: "#### AA",
        expectedPlaceholder: "1012 AB",
        valid: [
            { code: "1012 AB", note: "Amsterdam — with space" },
            { code: "1012AB",  note: "no space (space optional)" },
            { code: "3011 AA", note: "Rotterdam" },
            { code: "1234 ab", note: "lowercase letters" },
            { code: "1234 ZZ", note: "maximum letters" },
        ],
        invalid: [
            { code: "1012 A",   note: "only 1 letter" },
            { code: "1012 ABC", note: "3 letters — too long" },
            { code: "12 AB",    note: "only 2 digits" },
            { code: "12345 AB", note: "5 digits" },
            { code: "1012 12",  note: "digits where letters expected" },
            { code: "1012-AB",  note: "hyphen instead of space" },
        ],
    },

    GB: {
        description: "United Kingdom — variable (A9 9AA … AA9A 9AA)",
        expectedMask: "",
        expectedPlaceholder: "SW1A 2AA",
        valid: [
            { code: "SW1A 2AA", note: "SW district — 2+1+1 with space" },
            { code: "E1W 1BB",  note: "E district — 1+1+1 with space" },
            { code: "M1 1AA",   note: "M district — 1+1 with space (no optional letter)" },
            { code: "B33 8TH",  note: "B district — 1+2 digits with space" },
            { code: "EC1A 1BB", note: "EC district — 2+1+1 with space" },
            { code: "CR2 6XH",  note: "CR district — 2+1 with space" },
            { code: "N1 9GU",   note: "N district — short format" },
            { code: "sw1a 2aa", note: "all lowercase" },
            { code: "SW1A2AA",  note: "no space — space is optional in pattern" },
        ],
        invalid: [
            { code: "1A 2AA",     note: "starts with digit" },
            { code: "SW 2AA",     note: "no digit after outward letters" },
            { code: "ABCD 2AA",   note: "4 letters at start (max is 2)" },
            { code: "SW1A 2A",    note: "inner code only 2 chars" },
            { code: "SW1A 2AAA",  note: "inner code 4 chars — too long" },
            { code: "M1A1A",      note: "inward code starts with letter not digit (M1 + A1A)" },
            { code: "SW1A 2",     note: "inner code only 1 char" },
            { code: "SW1A2",      note: "inner code missing last 2 letters" },
        ],
    },
};

// Cases for an unknown/unlisted country — triggers the DEFAULT_CONFIG
const DEFAULT_CASES = {
    valid: [
        { code: "12345",     note: "pure numeric" },
        { code: "A1B 2C3",   note: "alphanumeric with space" },
        { code: "1234-56",   note: "hyphen-separated" },
        { code: "AB-123",    note: "letter prefix hyphen" },
        { code: "A",         note: "single char — minimum" },
        { code: "ABCDE12345", note: "10 alphanumeric chars" },
    ],
    invalid: [
        { code: "@#$%",    note: "special characters" },
        { code: "ABC--123", note: "double hyphen" },
        { code: "ABC ",    note: "trailing space (nothing after separator)" },
        { code: " ABC",    note: "leading space (first char must be alphanumeric)" },
        { code: "ABC_123", note: "underscore not allowed" },
        { code: "AB@CD",   note: "at-sign not allowed" },
    ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRule(countryCode: string) {
    const { postalCodeRule } = usePostalCode(countryCode, invalidMessage);
    return postalCodeRule;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("usePostalCode — postalCodeRule", () => {
    describe("returns true for empty string (requiredRule handles it separately)", () => {
        it.each(Object.keys(CASES))("%s — empty string", (code) => {
            expect(makeRule(code)("")).toBe(true);
        });
    });

    describe("returns an error string (not true) for invalid codes", () => {
        Object.entries(CASES).forEach(([countryCode, { description, invalid }]) => {
            describe(`${countryCode} — ${description}`, () => {
                invalid.forEach(({ code, note }) => {
                    it(`"${code}" — ${note}`, () => {
                        const result = makeRule(countryCode)(code);
                        expect(result).not.toBe(true);
                        expect(typeof result).toBe("string");
                        expect(result as string).not.toBe("");
                    });
                });
            });
        });
    });

    describe("returns true for valid codes", () => {
        Object.entries(CASES).forEach(([countryCode, { description, valid }]) => {
            describe(`${countryCode} — ${description}`, () => {
                valid.forEach(({ code, note }) => {
                    it(`"${code}" — ${note}`, () => {
                        expect(makeRule(countryCode)(code)).toBe(true);
                    });
                });
            });
        });
    });

    describe("DEFAULT config — unlisted country falls through to the generic pattern", () => {
        const rule = makeRule("ZZ"); // ZZ is not in POSTAL_CODE_CONFIGS

        describe("accepts", () => {
            DEFAULT_CASES.valid.forEach(({ code, note }) => {
                it(`"${code}" — ${note}`, () => {
                    expect(rule(code)).toBe(true);
                });
            });
        });

        describe("rejects", () => {
            DEFAULT_CASES.invalid.forEach(({ code, note }) => {
                it(`"${code}" — ${note}`, () => {
                    const result = rule(code);
                    expect(result).not.toBe(true);
                    expect(typeof result).toBe("string");
                });
            });
        });
    });
});

describe("usePostalCode — postalMask and postalPlaceholder", () => {
    it.each(Object.entries(CASES))(
        "%s — mask and placeholder match config",
        (countryCode, { expectedMask, expectedPlaceholder }) => {
            const { postalMask, postalPlaceholder } = usePostalCode(countryCode, invalidMessage);
            expect(postalMask.value).toBe(expectedMask);
            expect(postalPlaceholder.value).toBe(expectedPlaceholder);
        },
    );

    it("unknown country code returns empty mask and placeholder", () => {
        const { postalMask, postalPlaceholder } = usePostalCode("ZZ", invalidMessage);
        expect(postalMask.value).toBe("");
        expect(postalPlaceholder.value).toBe("");
    });

    it("country code lookup is case-insensitive (lowercase input)", () => {
        const lower = usePostalCode("ca", invalidMessage);
        const upper = usePostalCode("CA", invalidMessage);
        expect(lower.postalMask.value).toBe(upper.postalMask.value);
        expect(lower.postalPlaceholder.value).toBe(upper.postalPlaceholder.value);
    });
});
