const Meeting = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const meetingData = req.body;
        meetingData.createdDate = new Date();
        const meeting = new Meeting(meetingData);
        await meeting.save();
        res.status(200).json(meeting);
    } catch (err) {
        console.error('Failed to create Meeting:', err);
        res.status(400).json({ error: 'Failed to create Meeting' });
    }
}

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;
    // check if createBy is not null from db via query
    query.createBy = { $ne: null };
    
    const meetingResultsFromDB = await Meeting.find(query).populate({
        path: 'createBy',
        match: { deleted: false }
    }).exec();
    return res.status(200).json(meetingResultsFromDB);
}

const view = async (req, res) => {
    const meetingId = req.params.id;
    if(!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
        return res.status(400).json({ error: 'Invalid meeting ID' });
    }
    const meeting = await Meeting.findById(meetingId)
    .populate({ path: 'createBy',match: { deleted: false }})
    .populate({ path: 'attendes',match: { deleted: false }} )
    .populate({ path: 'attendesLead',match: { deleted: false }} )
    .exec();

    return res.status(200).json(meeting);
    

}

const deleteData = async (req, res) => {
    try {
        const meetingId = req.params.id;
        const deletedMeeting = await Meeting.findByIdAndUpdate(meetingId, { deleted: true }, { new: true });
        if (!deletedMeeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.status(200).json(deletedMeeting);
    } catch (err) {
        console.error('Failed to delete Meeting:', err);
        res.status(400).json({ error: 'Failed to delete Meeting' });
    }
}

const deleteMany = async (req, res) => {
    try {
        const meetingIds = req.body.ids;
        if (!Array.isArray(meetingIds) || meetingIds.length === 0) {
            return res.status(400).json({ error: 'Invalid request: ids must be a non-empty array' });
        }
        const deletedMeetings = await Meeting.updateMany(
            { _id: { $in: meetingIds } },
            { deleted: true },
            { new: true }
        );
        res.status(200).json(deletedMeetings);
    } catch (err) {
        console.error('Failed to delete Meetings:', err);
        res.status(400).json({ error: 'Failed to delete Meetings' });
    }
}
const addMany = async (req, res) => {
    try {
        const meetings = req.body;
        const meetingData = meetings.map(meeting => ({
            ...meeting,
            createdDate: new Date()
        }));
        const meetingResults = await Meeting.insertMany(meetingData);
        res.status(200).json(meetingResults);
    } catch (err) {
        console.error('Failed to create Meetings:', err);
        res.status(400).json({ error: 'Failed to create Meetings' });
    }
}

const edit = async (req, res) => {
    try {
        const meetingId = req.params.id;
        const updateData = req.body;
        updateData.updatedDate = new Date();

        const updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, updateData, { new: true });
        if (!updatedMeeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.status(200).json(updatedMeeting);
    } catch (err) {
        console.error('Failed to edit Meeting:', err);
        res.status(400).json({ error: 'Failed to edit Meeting' });
    }
}



module.exports = { add, index, view, deleteData, deleteMany, addMany, edit }