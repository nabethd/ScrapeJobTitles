import mongoose, { Document } from 'mongoose';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

// JobTitle interface
interface JobTitle {
    title: string;
}

// JobTitle model
const JobTitleSchema = new mongoose.Schema<JobTitle>({
    title: String,
});

const JobTitle = mongoose.model<JobTitle>('JobTitle', JobTitleSchema);

interface JobTitle extends Document {
    title: string;
}

async function fetchJobTitlesByUrl(url: string) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        // make sure that the page loaded up completely
        await page.waitForFunction(
            () => {
                const textElement = document.querySelector('body');
                return textElement && textElement.textContent?.includes('Jobs starting with');
            },
            { timeout: 60000 },
        );
        const content = await page.content();
        await browser.close();
        const jobTitles: { title: string }[] = [];
        const $ = cheerio.load(content);

        $('li').each((_index, element) => {
            const title = $(element).text().trim();
            jobTitles.push({ title });
        });

        await JobTitle.insertMany(jobTitles);
        console.log(`Successfully stored ${jobTitles.length} job titles from ${url}`);
    } catch (error) {
        console.error('An error occurred while fetching and storing job titles:', error);
    }
}

export async function fetchAndStoreAllJobTitles() {
    try {
        // Fetch and store job titles for each letter

        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        for (const letter of letters) {
            //special URL cases
            if (letter === 'a') {
                await fetchJobTitlesByUrl('https://spotterful.com/blog/job-description-template/job-titles-list-a-z');
            } else if (letter === 'g') {
                await fetchJobTitlesByUrl(
                    'https://spotterful.com/blog/job-description-template/job-titles-list-starting-with-g',
                );
            } else {
                const url = `https://spotterful.com/blog/job-description-template/list-job-titles-starting-with-${letter}`;
                await fetchJobTitlesByUrl(url);
            }
        }
    } catch (error) {
        console.error('An error occurred while fetching and storing job titles:', error);
    }
}
