const fs = require('fs');

const createFolderIfNotExists = dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

module.exports = {
    createFolderIfNotExists
};
