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

import emojis from "./emoji.json";

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

/**
 * List of all emojis from:
 *
 * @see https://github.com/github/gemoji/commit/ed57eb86fd5215ff7f1bc68e12eaeee90133f359
 */
export default JSON.parse(emojis) as IGemoji[];
