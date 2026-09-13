const fs = require("fs");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

class CSVParser extends Transform {
    constructor() {
        super({ objectMode: true });
        this.headers = null;
        this.lineNumber = 0;
        /*
        * The buffer stores an incomplete line between _transform() calls.
        * A stream does not always provide complete lines in each chunk. A line can be split between two chunks.
        * For example:
        * First _transform():
        * chunk = "john doe,john@example.com,123"
        * buffer = "john doe,john@example.com,123"

        * Second _transform():
        * chunk = "4567890\n"
        * buffer = "john doe,john@example.com,1234567890\n"
        * The second chunk completes the line, so the parser can process it as a complete CSV record.
        * In short: the buffer keeps incomplete data from one _transform() call until the next chunk arrives.
        * */
        this.buffer = "";
    }

    _transform(chunk, encoding, callback) {
        // TODO: Implement CSV parsing
        // 1. Convert chunk to string and add to buffer
        // 2. Split buffer by newlines
        // 3. Keep last incomplete line in buffer
        // 4. Process complete lines:
        //    - First line: extract headers
        //    - Other lines: create objects with headers as keys
        // 5. Push objects to next stream

        try {
            this.buffer += chunk.toString();

            const lines = this.buffer.split(/\r?\n/);

            // Последняя строка может быть неполной.
            this.buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) {
                    continue;
                }

                this.lineNumber++;

                // Первая строка содержит заголовки.
                if (!this.headers) {
                    this.headers = line.split(",").map((header) => header.trim());
                    continue;
                }

                const values = line.split(",");

                if (values.length !== this.headers.length) {
                    throw new Error(
                        `Malformed CSV at line ${ this.lineNumber }: expected ${ this.headers.length } columns, got ${ values.length }`,
                    );
                }

                const record = {};

                this.headers.forEach((header, index) => {
                    record[header] = values[index].trim();
                });

                this.push(record);
            }

            callback();
        } catch (error) {
            callback(error);
        }
    }


    // _flush() is called when the stream has finished
    // receiving data. It is used to process any remaining data
    // in the buffer before the stream ends.
    _flush(callback) {
        // TODO: Process any remaining data in buffer
        try {
            if (this.buffer.trim()) {
                this.lineNumber++;

                if (!this.headers) {
                    this.headers = this.buffer
                        .split(",")
                        .map((header) => header.trim());
                } else {
                    const values = this.buffer.split(",");

                    if (values.length !== this.headers.length) {
                        throw new Error(
                            `Malformed CSV at line ${ this.lineNumber }: expected ${ this.headers.length } columns, got ${ values.length }`,
                        );
                    }

                    const record = {};

                    this.headers.forEach((header, index) => {
                        record[header] = values[index].trim();
                    });

                    this.push(record);
                }
            }

            callback();
        } catch (error) {
            callback(error);
        }
    }
}

/**
 * Data Transformer Stream
 * Applies transformations to each record
 */
class DataTransformer extends Transform {
    constructor(options = {}) {
        super({ objectMode: true });
    }

    _transform(record, encoding, callback) {
        // TODO: Apply transformations to record
        // 1. Capitalize name using capitalizeName()
        // 2. Normalize email using normalizeEmail()
        // 3. Format phone using formatPhone()
        // 4. Standardize date using standardizeDate()
        // 5. Capitalize city name
        // 6. Push transformed record

        try {
            const transformedRecord = {
                ...record,
                name: capitalizeName(record.name),
                email: normalizeEmail(record.email),
                phone: formatPhone(record.phone),
                birthdate: standardizeDate(record.birthdate),
                city: capitalizeName(record.city),
            };

            this.push(transformedRecord);

            callback();
        } catch (error) {
            callback(error);
        }
    }
}

/**
 * CSV Writer Transform Stream
 * Converts objects back to CSV format
 */
class CSVWriter extends Transform {
    constructor(options = {}) {
        super({ objectMode: true });
        this.headerWritten = false;
    }

    _transform(record, encoding, callback) {
        // TODO: Convert object to CSV format
        // 1. Write headers on first record
        // 2. Convert record values to CSV line
        // 3. Handle special characters and quotes
        // 4. Push CSV line as string

        try {
            if (!this.headerWritten) {
                const headers = Object.keys(record);
                this.push(`${ headers.join(",") }\n`);
                this.headerWritten = true;
            }

            const values = Object.values(record).map((value) => {
                const stringValue = String(value);

                // Если значение содержит запятую, кавычку или перенос строки,
                // заключаем его в двойные кавычки.
                if (/[",\n]/.test(stringValue)) {
                    return `"${ stringValue.replace(/"/g, "\"\"") }"`;
                }

                return stringValue;
            });

            this.push(`${ values.join(",") }\n`);

            callback();
        } catch (error) {
            callback(error);
        }
    }
}

/**
 * Helper Functions
 */

/**
 * Capitalize names properly
 * @param {string} name - Name to capitalize
 * @returns {string} Capitalized name
 */
function capitalizeName(name) {
    // TODO: Implement name capitalization
    // 1. Handle empty/null names
    // 2. Split by spaces and hyphens
    // 3. Capitalize each part
    // 4. Join back together
    // Examples:
    // "john doe" → "John Doe"
    // "mary-jane smith" → "Mary-Jane Smith"
    if (!name) {
        return name;
    }

    return name
        .trim()
        .split(/\s+/)
        .map((part) =>
            part
                .split("-")
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join("-"),
        )
        .join(" ");

    return name;
}

/**
 * Normalize email addresses
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email or original if invalid
 */
function normalizeEmail(email) {
    // TODO: Implement email normalization
    // 1. Convert to lowercase
    // 2. Validate basic email format (contains @ and .)
    // 3. Return normalized email or original if invalid

    if (!email) {
        return email;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        return email;
    }

    return normalizedEmail;
}

/**
 * Format phone numbers
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone or "INVALID"
 */
function formatPhone(phone) {
    // TODO: Implement phone formatting
    // 1. Extract only digits
    // 2. Check if exactly 10 digits
    // 3. Format as (XXX) XXX-XXXX
    // 4. Return "INVALID" if not valid

    if (!phone) {
        return "INVALID";
    }

    const digits = String(phone).replace(/\D/g, "");

    if (digits.length !== 10) {
        return "INVALID";
    }

    return `(${ digits.slice(0, 3) }) ${ digits.slice(3, 6) }-${ digits.slice(6) }`;
}

/**
 * Standardize date formats
 * @param {string} date - Date to standardize
 * @returns {string} Date in YYYY-MM-DD format
 */
function standardizeDate(date) {
    // TODO: Implement date standardization
    // 1. Handle different input formats:
    //    - MM/DD/YYYY
    //    - YYYY-MM-DD
    //    - YYYY/MM/DD
    // 2. Convert to YYYY-MM-DD format
    // 3. Validate date is real
    // 4. Return original if invalid
    if (!date) {
        return date;
    }

    const value = date.trim();

    let year;
    let month;
    let day;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        [month, day, year] = value.split("/");
    } else if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(value)) {
        [year, month, day] = value.split(/[-/]/);
    } else {
        return date;
    }

    const parsedDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
    );

    if (
        parsedDate.getFullYear() !== Number(year) ||
        parsedDate.getMonth() !== Number(month) - 1 ||
        parsedDate.getDate() !== Number(day)
    ) {
        return date;
    }

    return `${ year }-${ month }-${ day }`;

    return date;
}

/**
 * Main function to process CSV file
 * @param {string} inputPath - Path to input CSV file
 * @param {string} outputPath - Path to output CSV file
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function processCSVFile(inputPath, outputPath) {
    // TODO: Implement the main processing pipeline
    // 1. Create read stream from input file
    // 2. Create transform streams (CSVParser, DataTransformer, CSVWriter)
    // 3. Create write stream to output file
    // 4. Use pipeline() to connect all streams
    // 5. Handle errors appropriately
    // 6. Return promise that resolves when complete

    try {
        const readStream = fs.createReadStream(inputPath);
        const parser = new CSVParser();
        const transformer = new DataTransformer();
        const writer = new CSVWriter();
        const writeStream = fs.createWriteStream(outputPath);

        /*
        * pipeline() connects multiple streams into a single processing pipeline
        * and handles data flow and errors between them.
        * It is used to safely pass data from one stream to another
        * until the entire operation is completed.
        *
        * Instead pipeline() we can type:
        * readStream.pipe(parser).pipe(transformer).pipe(writer).pipe(writeStream);
        * And need to do error handling and other things.
        * */
        await pipeline(
            readStream,
            parser,
            transformer,
            writer,
            writeStream,
        );
    } catch (error) {
        throw new Error(`Failed to process CSV file: ${ error.message }`);
    }
}

/**
 * Create sample input data for testing
 */
function createSampleData() {
    // TODO: Create data directory and sample CSV file
    // 1. Create 'data' directory if it doesn't exist
    // 2. Write sample CSV data as specified in task description
    const sampleData = `name,email,phone,birthdate,city
john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago
alice brown,alice.brown@company.org,9876543210,1988/07/04,houston`;

    const dataDir = "data";

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = `${ dataDir }/users.csv`;

    fs.writeFileSync(filePath, sampleData);

    return filePath;
}

// Export classes and functions
module.exports = {
    CSVParser,
    DataTransformer,
    CSVWriter,
    processCSVFile,
    capitalizeName,
    normalizeEmail,
    formatPhone,
    standardizeDate,
    createSampleData,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
    // Create sample data
    createSampleData();

    // Process the file
    processCSVFile("data/users.csv", "data/users_transformed.csv")
        .then(() => {
            console.log("✅ File transformation completed successfully!");

            // Read and display results
            const output = fs.readFileSync("data/users_transformed.csv", "utf-8");
            console.log("\n📄 Transformed CSV output:");
            console.log(output);
        })
        .catch((error) => {
            console.error("❌ Error processing file:", error.message);
        });
}
