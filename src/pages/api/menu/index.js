import { menu } from "../../../data/menu";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const state = req.query.url;
        const cachedData = menu[state];
        // refreshing menu for a state once in a day
        if (cachedData && ((Date.now() - cachedData.time) / (1000 * 60 * 60 * 24)) < 1) {
            res.status(200).json(cachedData.data)
        } else {
            menu[state] = null;
            res.status(404).end()
        }
    } else if (req.method === 'POST') {
        const data = req.body.data;
        menu[req.query.url] = {
            data,
            time: Date.now()
        }

        res.status(201).json(menu[req.query.state])
    }
 }