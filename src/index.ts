// Copyright (c) 2023  Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import emojiJSON from "./emoji.json";

/**
 * A selector for the groups of an `IGemoji` list.
 */
export type GemojiGroupKeySelector<TKey extends PropertyKey> = (item: IGemoji) => TKey;

/**
 * Grouped list of `IGemoji` items.
 */
export type GroupedGemojis<TKey extends PropertyKey> = Record<TKey, IGemoji[]>;

/**
 * A Gemoji.
 */
export interface IGemoji {
    /**
     * The aliases.
     */
    aliases: string[];
    /**
     * The category.
     */
    category: string;
    /**
     * A description.
     */
    description: string;
    /**
     * The emoji itself.
     */
    emoji: string;
    /**
     * The version of iOS.
     */
    ios_version: string;
    /**
     * Indicates if emoji has skin tones.
     */
    skin_tones?: boolean | undefined;
    /**
     * The tags.
     */
    tags: string[];
    /**
     * The unicode version.
     */
    unicode_version: string;
}

const emojis: IGemoji[] = JSON.parse(emojiJSON);

/**
 * Finds all `IGemoji` items by a filter
 * that is used with the `description` of each item.
 *
 * @param {string|RegExp} filter The filter.
 *
 * @example
 * ```typescript
 * import { findAll } from "@egomobile/emoji"
 *
 * // is case-insensitive
 * const allFacesByString = findAll("face")
 * console.log("allFacesByString", allFacesByString)
 *
 * // same with RegEx
 * const allFacesByRegex = findAll(/(face)/i)
 * console.log("allFacesByRegex", allFacesByRegex)
 * ```
 *
 * @returns {IGemoji[]} The matching items.
 */
export function findAll(filter: string | RegExp): IGemoji[] {
    if (filter instanceof RegExp) {
        return emojis.filter((item) => {
            return filter.test(item.description);
        });
    }

    const lcFilter = filter.toLowerCase();

    return emojis.filter((item) => {
        return item.description.toLowerCase()
            .includes(lcFilter);
    });
}

/**
 * Finds the first occurence of an `IGemoji` item by a filter
 * that is used with the `description` of each item.
 *
 * @param {string|RegExp} filter The filter.
 *
 * @example
 * ```typescript
 * import { findFirst } from "@egomobile/emoji"
 *
 * // is is case-insensitive
 * const firstFaceByString = findFirst("findFirst")
 * console.log("firstFaceByString", firstFaceByString)
 *
 * // same with RegEx
 * const firstFaceByRegex = findFirst(/(face)/i)
 * console.log("firstFaceByRegex", firstFaceByRegex)
 * ```
 *
 * @returns {IGemoji|undefined} The matching item or `undefined` if not found.
 */
export function findFirst(filter: string | RegExp): IGemoji | undefined {
    return findAll(filter)[0];
}

/**
 * Returns a new list of all `IGemoji` items in this module.
 *
 * @example
 * ```typescript
 * import { getAll } from "@egomobile/emoji"
 *
 * console.log("getAll", getAll())
 * ```
 *
 * @returns {IGemoji|undefined} The matching item or `undefined` if not found.
 */
export function getAll(): IGemoji[] {
    return [...emojis];
}

/**
 * Returns a new grouped list of `IGemoji` items by category.
 *
 * @example
 * ```typescript
 * import { getGrouped } from "@egomobile/emoji"
 *
 * for (const { category, items } of getGrouped()) {
 *   console.log("Category:", category)
 *   console.log("\tItems:", items.map((i) => i.emoji))
 * }
 * ```
 *
 * @returns {GroupedGemojis<string>} The new list.
 */
export function getGrouped(): GroupedGemojis<string> {
    return getGroupedBy((item) => {
        return item.category;
    });
}

/**
 * Returns a new grouped list of `IGemoji` items by
 * using a function to select the keys.
 *
 * @param {GemojiGroupKeySelector<TKey>} keySelector The key selector.
 *
 * @example
 * ```typescript
 * import { getGroupedBy } from "@egomobile/emoji"
 *
 * const grouped = getGroupedBy(item => item.category.toLowerCase())
 *
 * for (const { category, items } of grouped) {
 *   console.log("Category:", category)
 *   console.log("\tItems:", items.map((i) => i.emoji))
 * }
 * ```
 *
 * @returns {GroupedGemojis<TKey>} The new list.
 */
export function getGroupedBy<TKey extends PropertyKey = PropertyKey>(keySelector: GemojiGroupKeySelector<TKey>): GroupedGemojis<TKey> {
    return emojis.reduce((result, item) => {
        const key: any = keySelector(item);

        if (!result[key]) {
            result[key] = [];
        }

        result[key].push(item);

        return result;
    }, {} as any);
}

/**
 * List of all emojis from:
 *
 * @see https://github.com/github/gemoji/commit/ed57eb86fd5215ff7f1bc68e12eaeee90133f359
 */
export default emojis;
