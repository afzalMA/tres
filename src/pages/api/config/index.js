import { config } from "../../../data/menu";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const cachedData = config;
        // refreshing menu for a state once in a day
        if (cachedData && cachedData.data) {
            res.status(200).json(cachedData)
        } else {
            res.status(404).end()
        }
    } else if (req.method === 'POST') {
        const data = req.body.data;
        config.data = data;
        res.status(201).json(config)
    }
 }