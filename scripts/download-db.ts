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

import axios from "axios";
import fs from "fs";
import os from 'os';
import path from "path";

const {
    stdout
} = process;

const {
    EOL
} = os;

const sourceRepo = "github/gemoji";
const sourceBranch = "master";
const sourcePath = "db/emoji.json";

const outFileName = "emoji.json";
const outFile = path.join(__dirname, "../src", outFileName);

const indexFile = path.join(__dirname, "../src", "index.ts");

async function main() {
    // get information about latest commit
    // in source repository
    let latestCommitHash: string;
    {
        stdout.write(`Downloading latest commit information from ${sourceRepo} repo ... `);

        const latestCommitResponse = await axios.get(
            `https://api.github.com/repos/${sourceRepo}/branches/${sourceBranch}`
        );

        const {
            "data": latestCommitData,
            "status": latestCommitStatus
        } = latestCommitResponse;

        if (latestCommitStatus !== 200) {
            throw new Error(`Unexpected response: ${latestCommitStatus}`);
        }

        latestCommitHash = latestCommitData.commit.sha;

        stdout.write(`✅ latest commit is ${latestCommitHash}${EOL}`);
    }

    // download 
    let emojiStringList: string;
    {
        stdout.write(`Downloading database from ${sourceRepo} repo ... `);

        const emojiResponse = await axios.get<Buffer>(
            `https://raw.githubusercontent.com/${sourceRepo}/${sourceBranch}/${sourcePath}`,
            {
                responseType: 'arraybuffer'
            }
        );

        const {
            "data": emojiData,
            "status": emojiStatus
        } = emojiResponse;

        if (emojiStatus !== 200) {
            throw new Error(`Unexpected response: ${emojiStatus}`);
        }

        emojiStringList = JSON.stringify(
            emojiData.toString('utf8')
        );

        stdout.write(`✅ downloaded ${emojiData.length} and shrink to about ${emojiStringList.length}${EOL}`);
    }

    await fs.promises.writeFile(outFile, emojiStringList, "utf8");

    const indexFileData = await fs.promises.readFile(indexFile, "utf8");
    {
        stdout.write(`Replace source URL of database in ${sourceRepo} repo ... `);

        const lines = indexFileData.split("\n");

        const matchingLineIndex = lines.findIndex((line) => {
            return line.includes("List of all emojis from:");
        });
        if (matchingLineIndex < 0) {
            throw new Error("No matching lines found");
        }

        lines[matchingLineIndex + 2] = ` * @see https://github.com/github/gemoji/commit/${encodeURIComponent(latestCommitHash)}`;

        await fs.promises.writeFile(indexFile, lines.join("\n"), "utf8");

        stdout.write(`✅ updated ${indexFile} file${EOL}`);
    }

    stdout.write(`All jobs done ✅ ${EOL}`);
}

main().catch((ex) => {
    console.error("🔥", "[UNHANDLED ERROR]", __filename, ex);

    process.exit(1);
});
