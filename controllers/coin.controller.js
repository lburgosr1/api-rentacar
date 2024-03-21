const { response } = require('express');

const Coin = require('../models/coin.model');

const getCoins = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || true;

    //Colleccion de promesa
    const [coins, total] = await Promise.all([
        Coin
            .find({
                $or: [
                    { coinName: regex },
                ],
                $and: [
                    { status: status }
                ]
            })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'coinName': 1 }),

        Coin
            .find({
                $or: [
                    { coinName: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .count()

    ]);


    res.json({
        ok: true,
        coins,
        total
    });

}

const getAllCoins = async (req, res) => {

    //Colleccion de promesa
    const coins = await Coin
            .find({
                $and: [
                    { status: true }
                ]
            })
            .sort({ 'coinName': 1 });


    res.json({
        ok: true,
        coins
    });

}

const getCoinById = async (req, res) => {

    const id = req.params.id;

    try {
        const coin = await coin.findById(id);

        res.json({
            ok: true,
            coin
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createCoin = async (req, res = response) => {
    
    const coin =  new Coin(req.body);

    try {

        await coin.save();

        res.json({
            ok: true,
            coin: coin
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateCoin = async (req, res = response) => {

    const coinId = req.params.id;

    try {

        const coinDB = await Coin.findById(coinId);

        if (!coinDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Coin no existe'
            });
        }

        await Coin.findByIdAndUpdate(coinId, req.body);
        const coinUpdate = await Coin.findById(coinId);

        res.json({
            ok: true,
            coin: coinUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteCoin = async (req, res = response) => {

    const coinId = req.params.id
    
    try {
        const coinDB = await Coin.findById(coinId);

        if (!coinDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Moneda no existe'
            });
        }

        const coin = req.body;

        await Coin.findByIdAndUpdate(coinId, coin);
        res.json({
            ok: true,
            msg: 'Estatus actualizado'
        });

    } catch {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

module.exports = {
    getCoins,
    createCoin,
    updateCoin,
    deleteCoin,
    getCoinById,
    getAllCoins
}