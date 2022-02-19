const Folder = require('../models/folder');
const Record = require('../models/record');
const Comment = require('../models/comment');
const moment = require('moment');

function test() {
    const folderId = '62113cec14beaac76532b17c';
    const folderRecords = await Record.find({ folder: folderId }).populate('payer');
    const folder = await Folder.findById(folderId).populate({
        path: 'members',
        select: 'username'
    });
    const spendingStatus = new Map();

    for (member of folder.members) {

    }

}

test();