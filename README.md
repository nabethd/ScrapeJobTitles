# ScrapeJobTitles
In this repository we get a full list of job titles from the web and save it in our MongoDB


## libraries:
- mongoose
- puppeteer
- cheerio

## Before Running the code:

- make sure that all the libraries are instaled.
- make sure to init the Mongo connection using 
``` await mongoose.connect(MONGODB_URI); ```

the code will iterate on all of the letters from a-z and will save the jobtitles in the MongoDB with a total of 13,385 entries
