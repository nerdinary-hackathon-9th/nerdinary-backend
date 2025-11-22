const challengeRepo = require('../repositories/challenge.repository');
import { successHandler } from "../middlewares/responseHandler.js";

// GET /api/challenge
async function getChallenges(req, res) {
    try {
        const challenges = await challengeRepo.findAllChallenges();
        res.json({ success: true, data: challenges });
    } catch (err) {
        console.error('getChallenges error: ', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// GET /api/challenge/list
async function getChallengeList(req, res) {
    try {
        const { popular, latest } = req.query;
        const challenges = await challengeRepo.findChallengeListWithOptions({
            popular,
            latest,
        });

        res.json({ success: true, data: challenges });
    } catch (err) {
        console.error('getChallengeList error: ', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// // GET /api/challenge/:challengeId
