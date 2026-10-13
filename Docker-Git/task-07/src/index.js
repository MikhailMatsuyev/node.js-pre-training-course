const express = require('express');

const app = express();
const PORT = 3000;

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.get('/data', (_req, res) => {
    res.json([
        { id: 1, name: 'First item' },
        { id: 2, name: 'Second item' },
        { id: 3, name: 'Third item' }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
