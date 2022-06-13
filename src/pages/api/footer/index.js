import { footer } from "../../../data/menu";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const cachedData = footer;
        // refreshing menu for a state once in a day
        if (cachedData && cachedData.data) {
            res.status(200).json(cachedData)
        } else {
            res.status(404).end()
        }
    } else if (req.method === 'POST') {
        const data = req.body.data;
        footer.data = data
        res.status(201).json(footer)
    }
 }